import type { RawArticle } from "../../src/types/article";

function titleKey(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9ก-๙]+/g, " ").trim();
}

function stemWord(word: string): string {
  if (word.length <= 3) return word;
  return word
    .toLowerCase()
    .replace(/(?:ing|es|s|ed|ly)$/i, "");
}

function extractTitleTokens(title: string): Set<string> {
  const stopWords = new Set([
    "a", "an", "the", "in", "on", "at", "for", "to", "of", "and", "or", "is", "are",
    "by", "with", "its", "all", "after", "from", "over", "into", "new"
  ]);

  const words = title
    .toLowerCase()
    .replace(/[^a-z0-9ก-๙]+/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w))
    .map(stemWord);

  return new Set(words);
}

/**
 * Extract ASCII product/brand tokens for cross-language duplicate detection.
 * Strips common English function words so only meaningful product/brand names
 * (e.g. "ChatGPT", "OpenAI", "CodeAI") remain for comparison.
 */
function extractAsciiProductTokens(title: string): Set<string> {
  const stopWords = new Set([
    "the", "for", "and", "built", "with", "new", "how", "why", "that",
    "introducing", "partnering", "prepare", "first", "generation",
    "learning", "backed", "protections", "teens", "teen", "this",
    "from", "into", "over", "after", "about", "using", "based",
    "today", "right", "when", "will", "your", "our", "its"
  ]);
  const words = title.match(/[a-zA-Z0-9]{3,}/g) ?? [];
  return new Set(words.map((w) => w.toLowerCase()).filter((w) => !stopWords.has(w)));
}

export function calculateTokenSimilarity(titleA: string, titleB: string): number {
  const tokensA = extractTitleTokens(titleA);
  const tokensB = extractTitleTokens(titleB);
  if (tokensA.size === 0 || tokensB.size === 0) return 0;

  let intersection = 0;
  for (const token of tokensA) {
    if (tokensB.has(token)) intersection += 1;
  }

  const union = new Set([...tokensA, ...tokensB]).size;
  return union > 0 ? intersection / union : 0;
}

export function isFuzzyDuplicateTitle(titleA: string, titleB: string, threshold = 0.30): boolean {
  if (titleKey(titleA) === titleKey(titleB)) return true;

  // Cross-language check: ASCII product/brand token overlap ≥ 2 → duplicate
  // Catches EN title vs TH title from the same source (e.g. "ChatGPT for Teens")
  const asciiA = extractAsciiProductTokens(titleA);
  const asciiB = extractAsciiProductTokens(titleB);
  let asciiOverlap = 0;
  for (const t of asciiA) {
    if (asciiB.has(t)) asciiOverlap++;
  }
  if (asciiOverlap >= 2) return true;

  const tokensA = extractTitleTokens(titleA);
  const tokensB = extractTitleTokens(titleB);
  let intersection = 0;
  for (const token of tokensA) {
    if (tokensB.has(token)) intersection += 1;
  }
  // Match if 3 or more key tokens match, or similarity ratio >= threshold
  if (intersection >= 3) return true;
  return calculateTokenSimilarity(titleA, titleB) >= threshold;
}


function sourceRank(article: RawArticle): number {
  return article.sourceTier ?? 99;
}

function descriptionLength(article: RawArticle): number {
  return article.description?.length ?? 0;
}

function publishedTime(article: RawArticle): number {
  const time = new Date(article.publishedAt).getTime();
  return Number.isFinite(time) ? time : Number.MAX_SAFE_INTEGER;
}

function chooseBetterArticle(current: RawArticle, candidate: RawArticle): RawArticle {
  if (sourceRank(candidate) !== sourceRank(current)) {
    return sourceRank(candidate) < sourceRank(current) ? candidate : current;
  }

  if (descriptionLength(candidate) !== descriptionLength(current)) {
    return descriptionLength(candidate) > descriptionLength(current) ? candidate : current;
  }

  return publishedTime(candidate) < publishedTime(current) ? candidate : current;
}

export function deduplicateArticles(articles: RawArticle[]): RawArticle[] {
  const byUrl = new Map<string, RawArticle>();
  const order: string[] = [];

  for (const article of articles) {
    let duplicateOfUrl: string | null = null;

    // 1. Check exact URL
    if (byUrl.has(article.url)) {
      duplicateOfUrl = article.url;
    } else {
      // 2. Check exact or fuzzy title against existing pool
      for (const existing of byUrl.values()) {
        if (isFuzzyDuplicateTitle(article.title, existing.title)) {
          duplicateOfUrl = existing.url;
          break;
        }
      }
    }

    if (!duplicateOfUrl) {
      byUrl.set(article.url, article);
      order.push(article.url);
      continue;
    }

    const existing = byUrl.get(duplicateOfUrl);
    if (existing) {
      const better = chooseBetterArticle(existing, article);
      if (better.url !== existing.url) {
        byUrl.delete(existing.url);
        byUrl.set(better.url, better);
        const idx = order.indexOf(existing.url);
        if (idx >= 0) order[idx] = better.url;
      }
    }
  }

  return order.flatMap((url) => {
    const article = byUrl.get(url);
    return article ? [article] : [];
  });
}

export function filterHistoricalDuplicates(
  articles: RawArticle[],
  processedUrls: Set<string>,
  processedTitles: Set<string>
): RawArticle[] {
  return articles.filter((article) => {
    if (processedUrls.has(article.url)) return false;
    const key = titleKey(article.title);
    if (processedTitles.has(key)) return false;

    for (const existingTitle of processedTitles) {
      if (isFuzzyDuplicateTitle(article.title, existingTitle)) {
        return false;
      }
    }

    return true;
  });
}

