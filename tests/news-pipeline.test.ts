import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { calculateReadingTime } from "../scripts/content/calculate-reading-time";
import { mapWithConcurrency } from "../scripts/shared/concurrency";
import { deduplicateArticles } from "../scripts/news/deduplicate-articles";
import { parseArticleHtml } from "../scripts/news/extract-article";
import { loadSources, normalizeApiItems } from "../scripts/news/fetch-articles";
import { filterArticles, loadBlockedDomains } from "../scripts/news/filter-articles";
import { generateDailyDigest } from "../scripts/news/generate-daily-digest";
import { generateMarkdown } from "../scripts/news/generate-markdown";
import { normalizeArticle, normalizeUrl } from "../scripts/news/normalize-articles";
import {
  hasProcessedArticle,
  loadProcessedState,
  saveProcessedState
} from "../scripts/news/processed-state";
import { scoreArticles } from "../scripts/news/score-articles";
import { selectTopArticles } from "../scripts/news/select-top-articles";
import { buildScoringPrompt } from "../scripts/news/scoring-prompt";
import { aiScoringResponseSchema } from "../scripts/news/validate-score";
import { resolveGenerationOptions } from "../scripts/news/workflow-options";
import type { ArticleCategory, ArticleSummary, RawArticle, ScoredArticle } from "../src/types/article";
import { groupArticlesByPublishedMonth } from "../src/utils/archive";
import { countCategories } from "../src/utils/categories";
import type { ApiNewsSource, NewsSource } from "../src/types/source";

const source: NewsSource = {
  id: "example-source",
  name: "Example Source",
  url: "https://example.com/feed.xml",
  type: "rss",
  enabled: true,
  tier: 1,
  categories: ["AI"],
  language: "en"
};

const apiSource: ApiNewsSource = {
  id: "example-api",
  name: "Example API",
  url: "https://api.example.com/news",
  type: "api",
  enabled: true,
  tier: 2,
  categories: ["Business"],
  language: "en",
  mapping: {
    itemsPath: "data.items",
    title: "headline",
    url: "links.canonical",
    publishedAt: "published_at",
    description: "summary",
    author: "byline.name",
    imageUrl: "image.url"
  }
};

function rawArticle(overrides: Partial<RawArticle> = {}): RawArticle {
  return {
    id: "article-1",
    title: "OpenAI launches developer API",
    url: "https://example.com/news/openai-api",
    sourceName: "Example Source",
    sourceType: "rss",
    publishedAt: new Date().toISOString(),
    description: "A new API for developers",
    ...overrides
  };
}

function scoredArticle(overrides: Partial<ScoredArticle> = {}): ScoredArticle {
  return {
    ...rawArticle(),
    score: {
      importance: 8,
      relevance: 8,
      novelty: 6,
      credibility: 7,
      totalScore: 7.4,
      category: "AI",
      reason: "Test score"
    },
    ...overrides
  };
}

const summary: ArticleSummary = {
  titleTh: "OpenAI launches developer API",
  excerpt: "A concise summary for testing",
  whatHappened: "OpenAI announced a developer API for testing.",
  whyItMatters: "It matters because developers may need to evaluate the API.",
  impacts: [
    {
      group: "developers",
      title: "Developer impact",
      description: "Developers should read the original source before acting."
    }
  ],
  tantechView: "This is a draft that separates analysis from facts.",
  oneSentenceSummary: "OpenAI announced an API for developers.",
  categories: ["AI"],
  tags: ["OpenAI", "API"]
};

describe("news pipeline helpers", () => {
  it("resolves workflow generation options from environment variables", () => {
    const options = resolveGenerationOptions({
      NEWS_DATE: "2026-08-03",
      MAX_ARTICLES: "7",
      DRY_RUN: "true"
    });

    assert.deepEqual(options, {
      date: new Date("2026-08-03T00:00:00.000Z"),
      maxArticles: 7,
      dryRun: true
    });
  });

  it("normalizes URLs by removing tracking parameters but keeping identity parameters", () => {
    const normalized = normalizeUrl(
      "https://example.com/article?id=123&utm_source=newsletter&fbclid=abc#section"
    );

    assert.equal(normalized, "https://example.com/article?id=123");
  });

  it("normalizes RSS article metadata into stable RawArticle shape", () => {
    const article = normalizeArticle({
      title: "  OpenAI   launches API  ",
      url: "https://example.com/article?utm_campaign=x",
      publishedAt: "2026-08-01T00:00:00Z",
      source,
      description: "  Useful   update "
    });

    assert.equal(article.title, "OpenAI launches API");
    assert.equal(article.description, "Useful update");
    assert.equal(article.url, "https://example.com/article");
    assert.equal(article.sourceTier, 1);
    assert.match(article.id, /^[a-f0-9]{64}$/);
  });

  it("loads API sources when required mapping is present", async () => {
    const dir = await mkdtemp(join(tmpdir(), "tantech-sources-"));
    const path = join(dir, "sources.json");

    try {
      await writeFile(
        path,
        JSON.stringify({
          sources: [
            {
              ...apiSource,
              headers: { "X-Public-Client": "tantech" }
            }
          ]
        }),
        "utf8"
      );

      const sources = await loadSources(path);

      assert.equal(sources.length, 1);
      assert.equal(sources[0]?.type, "api");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("normalizes mapped API payload items and skips incomplete entries", () => {
    const articles = normalizeApiItems(
      {
        data: {
          items: [
            {
              headline: "  Startup raises cloud funding ",
              links: { canonical: "https://example.com/api-story?utm_source=x&id=42" },
              published_at: "2026-08-01T00:00:00Z",
              summary: "  Funding update for cloud infrastructure ",
              byline: { name: "Reporter" },
              image: { url: "https://example.com/image.png" }
            },
            {
              headline: "Missing URL",
              published_at: "2026-08-01T00:00:00Z"
            }
          ]
        }
      },
      apiSource
    );

    assert.equal(articles.length, 1);
    assert.equal(articles[0]?.title, "Startup raises cloud funding");
    assert.equal(articles[0]?.url, "https://example.com/api-story?id=42");
    assert.equal(articles[0]?.sourceName, "Example API");
    assert.equal(articles[0]?.sourceType, "api");
    assert.equal(articles[0]?.sourceTier, 2);
    assert.equal(articles[0]?.author, "Reporter");
    assert.equal(articles[0]?.imageUrl, "https://example.com/image.png");
  });

  it("deduplicates by URL and normalized title", () => {
    const deduped = deduplicateArticles([
      rawArticle({ id: "1", title: "Same Title", url: "https://example.com/a" }),
      rawArticle({ id: "2", title: "Same   Title", url: "https://example.com/b" }),
      rawArticle({ id: "3", title: "Different", url: "https://example.com/a" }),
      rawArticle({ id: "4", title: "Different", url: "https://example.com/c" })
    ]);

    assert.deepEqual(
      deduped.map((article) => article.id),
      ["1", "4"]
    );
  });

  it("deduplicates duplicate titles by preferring higher source tier", () => {
    const deduped = deduplicateArticles([
      rawArticle({
        id: "tier-3",
        title: "Same Launch",
        url: "https://example.com/community",
        sourceTier: 3,
        description: "Longer community post that should lose to primary source."
      }),
      rawArticle({
        id: "tier-1",
        title: "Same Launch",
        url: "https://example.com/official",
        sourceTier: 1,
        description: "Official announcement."
      })
    ]);

    assert.deepEqual(
      deduped.map((article) => article.id),
      ["tier-1"]
    );
  });

  it("filters old and sponsored articles while keeping recent relevant items", () => {
    const recent = new Date().toISOString();
    const old = new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString();
    const filtered = filterArticles(
      [
        rawArticle({ id: "recent", publishedAt: recent }),
        rawArticle({ id: "old", publishedAt: old }),
        rawArticle({ id: "sponsored", title: "Sponsored: cloud platform", publishedAt: recent })
      ],
      48
    );

    assert.deepEqual(
      filtered.map((article) => article.id),
      ["recent"]
    );
  });

  it("filters articles from blocked domains and subdomains", () => {
    const filtered = filterArticles(
      [
        rawArticle({ id: "allowed", url: "https://trusted.example/news" }),
        rawArticle({ id: "blocked", url: "https://spam.example/news" }),
        rawArticle({ id: "blocked-subdomain", url: "https://www.bad.spam.example/news" })
      ],
      48,
      new Set(["spam.example"])
    );

    assert.deepEqual(
      filtered.map((article) => article.id),
      ["allowed"]
    );
  });

  it("scores and categorizes articles from metadata", () => {
    const [article] = scoreArticles([
      rawArticle({
        title: "Critical security vulnerability affects cloud API",
        description: "Developers should patch affected infrastructure"
      })
    ]);

    assert.equal(article.score.category, "Programming");
    assert.ok(article.score.totalScore > 0);
  });

  it("uses source tier when calculating rule-based credibility", () => {
    const [primary, discovery] = scoreArticles([
      rawArticle({ id: "primary", sourceTier: 1 }),
      rawArticle({ id: "discovery", sourceTier: 3 })
    ]);

    assert.equal(primary.score.credibility, 9);
    assert.equal(discovery.score.credibility, 4);
    assert.ok(primary.score.totalScore > discovery.score.totalScore);
  });

  it("parses readable article HTML and rejects very short content", () => {
    const readable = parseArticleHtml(
      `<!doctype html>
      <html>
        <head><title>Readable story</title></head>
        <body>
          <article>
            <h1>Readable story</h1>
            <p>${"This paragraph contains useful technology reporting details. ".repeat(12)}</p>
          </article>
        </body>
      </html>`,
      "https://example.com/readable"
    );
    const short = parseArticleHtml(
      "<html><body><article><h1>Short</h1><p>Too short.</p></article></body></html>",
      "https://example.com/short"
    );

    assert.equal(readable?.title, "Readable story");
    assert.ok((readable?.textContent.length ?? 0) >= 300);
    assert.equal(short, null);
  });

  it("builds scoring prompts from metadata only", () => {
    const prompt = buildScoringPrompt([rawArticle({ id: "score-1" })]);

    assert.match(prompt.system, /metadata เท่านั้น/);
    assert.match(prompt.user, /score-1/);
    assert.match(prompt.user, /Allowed categories/);
    assert.doesNotMatch(prompt.user, /Original article content/);
  });

  it("validates AI scoring responses", () => {
    const result = aiScoringResponseSchema.safeParse({
      articles: [
        {
          id: "score-1",
          score: {
            importance: 8,
            relevance: 7,
            novelty: 6,
            credibility: 9,
            totalScore: 7.4,
            category: "AI",
            reason: "Important AI launch from a credible source"
          }
        }
      ]
    });

    assert.equal(result.success, true);
  });

  it("selects top articles with category diversity before filling remaining slots", () => {
    const articles = [
      scoredArticle({ id: "ai-1", score: { ...scoredArticle().score, category: "AI", totalScore: 10 } }),
      scoredArticle({ id: "ai-2", score: { ...scoredArticle().score, category: "AI", totalScore: 9 } }),
      scoredArticle({ id: "ai-3", score: { ...scoredArticle().score, category: "AI", totalScore: 8 } }),
      scoredArticle({ id: "cloud-1", score: { ...scoredArticle().score, category: "Cloud", totalScore: 7 } }),
      scoredArticle({ id: "security-1", score: { ...scoredArticle().score, category: "Cybersecurity", totalScore: 6 } })
    ];

    const selected = selectTopArticles(articles, {
      maxArticles: 4,
      maxPerCategory: 2
    });

    assert.deepEqual(
      selected.map((article) => article.id),
      ["ai-1", "ai-2", "cloud-1", "security-1"]
    );
  });

  it("fills remaining slots when diversity cap leaves capacity", () => {
    const articles = [
      scoredArticle({ id: "ai-1", score: { ...scoredArticle().score, category: "AI", totalScore: 10 } }),
      scoredArticle({ id: "ai-2", score: { ...scoredArticle().score, category: "AI", totalScore: 9 } }),
      scoredArticle({ id: "ai-3", score: { ...scoredArticle().score, category: "AI", totalScore: 8 } })
    ];

    const selected = selectTopArticles(articles, {
      maxArticles: 3,
      maxPerCategory: 2
    });

    assert.deepEqual(
      selected.map((article) => article.id),
      ["ai-1", "ai-2", "ai-3"]
    );
  });

  it("counts articles across multiple categories", () => {
    const entries = [
      { data: { categories: ["AI", "Programming"] } },
      { data: { categories: ["AI"] } }
    ] satisfies Array<{ data: { categories: ArticleCategory[] } }>;
    const counts = countCategories(entries);

    assert.equal(counts.get("AI"), 2);
    assert.equal(counts.get("Programming"), 1);
    assert.equal(counts.get("Cloud"), 0);
  });

  it("groups archive entries by published month with newest month first", () => {
    const groups = groupArticlesByPublishedMonth([
      { data: { publishedAt: new Date("2026-07-15T00:00:00Z") }, id: "july" },
      { data: { publishedAt: new Date("2026-08-01T00:00:00Z") }, id: "august-1" },
      { data: { publishedAt: new Date("2026-08-02T00:00:00Z") }, id: "august-2" }
    ]);

    assert.deepEqual(
      groups.map((group) => group.key),
      ["2026-08", "2026-07"]
    );
    assert.equal(groups[0]?.articles.length, 2);
  });

  it("calculates reading time with a minimum of one minute", () => {
    assert.equal(calculateReadingTime("สั้นมาก"), 1);
    assert.ok(calculateReadingTime("ข่าว ".repeat(3000)) > 1);
  });

  it("saves processed state idempotently", async () => {
    const dir = await mkdtemp(join(tmpdir(), "tantech-state-"));
    const path = join(dir, "processed.json");

    try {
      await saveProcessedState(
        [
          {
            id: "a",
            url: "https://example.com/a",
            slug: "first",
            sourceName: "Example",
            processedAt: "2026-08-01T00:00:00Z"
          }
        ],
        path
      );
      await saveProcessedState(
        [
          {
            id: "a",
            url: "https://example.com/a",
            slug: "updated",
            sourceName: "Example",
            processedAt: "2026-08-01T01:00:00Z"
          }
        ],
        path
      );

      const state = await loadProcessedState(path);
      assert.equal(state.articles.length, 1);
      assert.equal(state.articles[0]?.slug, "updated");
      assert.equal(hasProcessedArticle(state, "a"), true);
      assert.equal(hasProcessedArticle(state, "missing"), false);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("loads blocked domains into a normalized set", async () => {
    const dir = await mkdtemp(join(tmpdir(), "tantech-blocked-"));
    const path = join(dir, "blocked.json");

    try {
      await mkdir(dir, { recursive: true });
      await import("node:fs/promises").then(({ writeFile }) =>
        writeFile(path, JSON.stringify({ domains: ["Spam.Example"] }), "utf8")
      );

      const blocked = await loadBlockedDomains(path);
      assert.equal(blocked.has("spam.example"), true);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("maps with a concurrency limit", async () => {
    let active = 0;
    let maxActive = 0;
    const result = await mapWithConcurrency([1, 2, 3, 4], 2, async (item) => {
      active += 1;
      maxActive = Math.max(maxActive, active);
      await new Promise((resolve) => setTimeout(resolve, 20));
      active -= 1;
      return item * 2;
    });

    assert.deepEqual(result, [2, 4, 6, 8]);
    assert.equal(maxActive, 2);
  });

  it("generates daily digest markdown with unique slugs", async () => {
    const dir = await mkdtemp(join(tmpdir(), "tantech-digest-"));
    const cwd = process.cwd();

    try {
      process.chdir(dir);
      await mkdir(join("src", "content", "daily"), { recursive: true });
      const filePath = await generateDailyDigest(["one", "two", "one"], new Date("2026-08-01T01:00:00Z"));
      assert.equal(filePath, join("src", "content", "daily", "2026-08-01.md"));

      const content = await readFile(filePath, "utf8");
      assert.match(content, /articleSlugs:\n  - one\n  - two/);
      assert.match(content, /draft: true/);
    } finally {
      process.chdir(cwd);
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("generates news markdown without overwriting an existing slug", async () => {
    const dir = await mkdtemp(join(tmpdir(), "tantech-news-"));
    const cwd = process.cwd();

    try {
      process.chdir(dir);
      const now = new Date();
      const bangkokYear = new Intl.DateTimeFormat("en-CA", {
        year: "numeric",
        timeZone: "Asia/Bangkok"
      }).format(now);
      const bangkokMonth = new Intl.DateTimeFormat("en-CA", {
        month: "2-digit",
        timeZone: "Asia/Bangkok"
      }).format(now);
      const targetDir = join("src", "content", "news", bangkokYear, bangkokMonth);
      await mkdir(targetDir, { recursive: true });
      await writeFile(join(targetDir, "openai-launches-developer-api.md"), "existing", "utf8");

      const generated = await generateMarkdown(scoredArticle(), summary);
      assert.equal(generated.slug, "openai-launches-developer-api-2");

      const existing = await readFile(join(targetDir, "openai-launches-developer-api.md"), "utf8");
      const created = await readFile(generated.filePath, "utf8");
      assert.equal(existing, "existing");
      assert.match(created, /slug: "openai-launches-developer-api-2"/);
    } finally {
      process.chdir(cwd);
      await rm(dir, { recursive: true, force: true });
    }
  });
});
