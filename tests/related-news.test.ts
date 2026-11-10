import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { NewsEntry } from "../src/utils/content";
import { getRelatedNews } from "../src/utils/related-news";

function makeArticle(
  id: string,
  options: {
    categories?: string[];
    tags?: string[];
    publishedAt: string;
  }
): NewsEntry {
  return {
    id: `${id}.md`,
    slug: id,
    collection: "news",
    body: "",
    data: {
      title: id,
      excerpt: id,
      publishedAt: new Date(options.publishedAt),
      sourcePublishedAt: new Date(options.publishedAt),
      sourceUrl: `https://example.com/${id}`,
      sourceName: "Example",
      categories: options.categories ?? ["AI"],
      tags: options.tags ?? [],
      readingTimeMinutes: 3,
      draft: false,
      references: []
    }
  } as unknown as NewsEntry;
}

describe("getRelatedNews", () => {
  const current = makeArticle("current", {
    categories: ["AI"],
    tags: ["OpenAI", "API"],
    publishedAt: "2026-11-10T00:00:00Z"
  });

  const tagMatchOlder = makeArticle("tag-old", {
    categories: ["Gadgets"],
    tags: ["OpenAI"],
    publishedAt: "2026-11-01T00:00:00Z"
  });
  const tagMatchNewer = makeArticle("tag-new", {
    categories: ["AI"],
    tags: ["OpenAI", "API"],
    publishedAt: "2026-11-09T00:00:00Z"
  });
  const categoryOnly = makeArticle("cat-only", {
    categories: ["AI"],
    tags: ["Robotics"],
    publishedAt: "2026-11-08T00:00:00Z"
  });
  const latestUnrelated = makeArticle("latest", {
    categories: ["Business"],
    tags: ["Finance"],
    publishedAt: "2026-11-10T12:00:00Z"
  });
  const olderUnrelated = makeArticle("older", {
    categories: ["Business"],
    tags: ["Market"],
    publishedAt: "2026-10-01T00:00:00Z"
  });

  it("prioritizes tag overlap, then category, then latest", () => {
    const related = getRelatedNews(
      current,
      [
        current,
        olderUnrelated,
        categoryOnly,
        tagMatchOlder,
        latestUnrelated,
        tagMatchNewer
      ],
      6
    );

    assert.deepEqual(
      related.map((entry) => entry.slug),
      ["tag-new", "tag-old", "cat-only", "latest", "older"]
    );
  });

  it("excludes the current article and respects the limit", () => {
    const related = getRelatedNews(
      current,
      [current, tagMatchNewer, categoryOnly, latestUnrelated],
      2
    );

    assert.equal(related.length, 2);
    assert.equal(related.some((entry) => entry.id === current.id), false);
    assert.deepEqual(
      related.map((entry) => entry.slug),
      ["tag-new", "cat-only"]
    );
  });
});
