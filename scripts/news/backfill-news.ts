import { logger } from "../shared/logger";
import { getBangkokDateParts } from "../shared/date";
import { deduplicateArticles } from "./deduplicate-articles";
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
import type { ScoredArticle } from "../../src/types/article";

const DEFAULT_DAYS_BACK = 30;
const DEFAULT_MAX_ARTICLES_PER_DAY = 3;
const MAX_ARTICLES_PER_CATEGORY = 2;

async function processArticle(article: ScoredArticle, date: Date): Promise<{ slug: string; record: ProcessedArticleRecord } | null> {
  try {
    const extracted = await extractArticle(article.url);
    if (!extracted) {
      logger.warn("Skipping article because full text extraction failed", { sourceUrl: article.url });
      return null;
    }

    const summary = await summarizeArticle(article, extracted.textContent);
    if (!summary) {
      logger.warn("Skipping article: fallback summary had insufficient Thai content", { sourceUrl: article.url });
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

    const generated = await generateMarkdown(article, validation.data as import("../../src/types/article").ArticleSummary, date);
    logger.info("Generated article", { filePath: generated.filePath, titleTh: summary.titleTh });

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
    logger.error("Failed to process article", {
      sourceUrl: article.url,
      error: error instanceof Error ? error.message : String(error)
    });
    return null;
  }
}

async function main(): Promise<void> {
  const daysBack = Number.parseInt(process.env.DAYS_BACK ?? String(DEFAULT_DAYS_BACK), 10);
  const maxPerDay = Number.parseInt(process.env.MAX_PER_DAY ?? String(DEFAULT_MAX_ARTICLES_PER_DAY), 10);

  logger.info("Starting news backfill pipeline", { daysBack, maxPerDay });

  const fetched = await fetchArticles();
  const blockedDomains = await loadBlockedDomains();
  const unique = deduplicateArticles(fetched);

  // Filter with large window (30 days = 720 hours)
  const windowHours = (daysBack + 2) * 24;
  const filtered = filterArticles(unique, windowHours, blockedDomains);

  logger.info("Fetched and filtered articles for backfill", {
    fetched: fetched.length,
    unique: unique.length,
    filtered: filtered.length
  });

  // Calculate target dates (from oldest to newest)
  const now = new Date();
  const dateList: string[] = [];
  for (let i = daysBack - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    dateList.push(getBangkokDateParts(d).isoDate);
  }

  // Group articles by Bangkok date
  const articlesByDate = new Map<string, typeof filtered>();
  for (const article of filtered) {
    const articleDate = new Date(article.publishedAt);
    if (!isNaN(articleDate.getTime())) {
      const isoDate = getBangkokDateParts(articleDate).isoDate;
      const list = articlesByDate.get(isoDate) ?? [];
      list.push(article);
      articlesByDate.set(isoDate, list);
    }
  }

  let totalGenerated = 0;
  let totalDigests = 0;

  for (let dayIndex = 0; dayIndex < dateList.length; dayIndex++) {
    const isoDate = dateList[dayIndex]!;
    const dayArticles = articlesByDate.get(isoDate) ?? [];

    if (dayArticles.length === 0) {
      logger.info(`[Day ${dayIndex + 1}/${dateList.length}] ${isoDate}: No articles found`);
      continue;
    }

    // Reload processed state to skip already processed
    const processedState = await loadProcessedState();
    const unprocessed = dayArticles.filter((a) => !hasProcessedArticle(processedState, a.id));

    if (unprocessed.length === 0) {
      logger.info(`[Day ${dayIndex + 1}/${dateList.length}] ${isoDate}: All articles already processed`);
      continue;
    }

    const scored = selectTopArticles(scoreArticles(unprocessed), {
      maxArticles: maxPerDay,
      maxPerCategory: MAX_ARTICLES_PER_CATEGORY
    });

    logger.info(`[Day ${dayIndex + 1}/${dateList.length}] ${isoDate}: Processing ${scored.length} articles...`);

    const dayDate = new Date(`${isoDate}T12:00:00.000+07:00`);
    const daySlugs: string[] = [];
    const dayRecords: ProcessedArticleRecord[] = [];

    for (const article of scored) {
      const result = await processArticle(article, dayDate);
      if (result) {
        daySlugs.push(result.slug);
        dayRecords.push(result.record);
        totalGenerated++;
      }
    }

    if (dayRecords.length > 0) {
      await saveProcessedState(dayRecords);
      const digestPath = await generateDailyDigest(daySlugs, dayDate);
      if (digestPath) {
        totalDigests++;
        logger.info(`[Day ${dayIndex + 1}/${dateList.length}] ${isoDate}: Daily digest generated with ${daySlugs.length} articles`);
      }
    }
  }

  logger.info("News backfill completed!", {
    totalArticlesGenerated: totalGenerated,
    totalDailyDigests: totalDigests
  });
}

main().catch((error) => {
  logger.error("News backfill failed", {
    error: error instanceof Error ? error.message : String(error)
  });
  process.exitCode = 1;
});
