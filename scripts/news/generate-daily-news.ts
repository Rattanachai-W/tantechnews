import { logger } from "../shared/logger";
import { mapWithConcurrency } from "../shared/concurrency";
import { deduplicateArticles, filterHistoricalDuplicates } from "./deduplicate-articles";
import { extractArticle } from "./extract-article";
import { generateDailyDigest } from "./generate-daily-digest";
import { fetchArticles } from "./fetch-articles";
import { filterArticles, loadBlockedDomains } from "./filter-articles";
import { generateMarkdown } from "./generate-markdown";
import {
  hasProcessedArticle,
  loadProcessedState,
  saveProcessedState,
  type ProcessedArticleRecord
} from "./processed-state";
import { scoreArticles } from "./score-articles";
import { selectTopArticles } from "./select-top-articles";
import { summarizeArticle } from "./summarize-article";
import { articleSummarySchema } from "./validate-summary";
import { resolveGenerationOptions } from "./workflow-options";
import type { ScoredArticle } from "../../src/types/article";

const MAX_ARTICLES_PER_DAY = 10;
const MAX_ARTICLES_PER_CATEGORY = 3;
const MAX_CONCURRENT_ARTICLE_PROCESSING = 1;

interface GeneratedArticleResult {
  slug: string;
  record: ProcessedArticleRecord;
}

async function processSelectedArticle(article: ScoredArticle): Promise<GeneratedArticleResult | null> {
  try {
    const extracted = await extractArticle(article.url);
    if (!extracted) {
      logger.warn("Skipping article because full text extraction failed", {
        sourceUrl: article.url
      });
      return null;
    }

    // Pass source content to summarizer for verification
    const summary = await summarizeArticle(article, extracted.textContent);
    if (!summary) {
      logger.warn("Skipping article: fallback summary had insufficient Thai content", {
        sourceUrl: article.url
      });
      return null;
    }
    const validation = articleSummarySchema.safeParse(summary);
    if (!validation.success) {
      logger.warn("Skipping article because summary validation failed", {
        sourceUrl: article.url,
        issues: validation.error.issues
      });
      return null;
    }

    const generated = await generateMarkdown(article, validation.data as import("../../src/types/article").ArticleSummary);
    logger.info("Generated draft markdown", { filePath: generated.filePath, sourceUrl: article.url });

    return {
      slug: generated.slug,
      record: {
        id: article.id,
        url: article.url,
        slug: generated.slug,
        sourceName: article.sourceName,
        processedAt: new Date().toISOString()
      }
    };
  } catch (error) {
    logger.error("Failed to process selected article", {
      sourceUrl: article.url,
      error: error instanceof Error ? error.message : String(error)
    });
    return null;
  }
}

async function main(): Promise<void> {
  const options = resolveGenerationOptions();
  const fetched = await fetchArticles();
  const processedState = await loadProcessedState();
  const blockedDomains = await loadBlockedDomains();

  const processedUrls = new Set(processedState.articles.map((a) => a.url));
  const processedTitles = new Set(processedState.articles.map((a) => a.slug.replace(/-/g, " ")));

  const unique = deduplicateArticles(fetched);
  const historicallyFiltered = filterHistoricalDuplicates(unique, processedUrls, processedTitles);
  const filtered = filterArticles(historicallyFiltered, 48, blockedDomains).filter(
    (article) => !hasProcessedArticle(processedState, article.id)
  );
  const scored = selectTopArticles(scoreArticles(filtered), {
    maxArticles: Math.min(options.maxArticles, MAX_ARTICLES_PER_DAY),
    maxPerCategory: MAX_ARTICLES_PER_CATEGORY
  });

  logger.info("Selected articles for draft generation", {
    fetched: fetched.length,
    unique: unique.length,
    filtered: filtered.length,
    selected: scored.length
  });

  const results = await mapWithConcurrency(
    scored,
    MAX_CONCURRENT_ARTICLE_PROCESSING,
    (article) => processSelectedArticle(article)
  );
  const generated = results.filter((result) => result !== null);
  const generatedSlugs = generated.map((result) => result.slug);
  const processedRecords = generated.map((result) => result.record);

  if (!options.dryRun) {
    await saveProcessedState(processedRecords);
  }
  const digestPath = await generateDailyDigest(generatedSlugs, options.date);
  if (digestPath) {
    logger.info("Generated daily digest", { digestPath, articles: generatedSlugs.length, dryRun: options.dryRun });
  }
}

main().catch((error) => {
  logger.error("Daily news generation failed", {
    error: error instanceof Error ? error.message : String(error)
  });
  process.exitCode = 1;
});
