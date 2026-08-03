import type { RawArticle } from "../../src/types/article";

function titleKey(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9ก-๙]+/g, " ").trim();
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
  const byTitle = new Map<string, RawArticle>();
  const order: string[] = [];

  for (const article of articles) {
    const key = titleKey(article.title);
    const existingByUrl = byUrl.get(article.url);
    const existingByTitle = byTitle.get(key);
    const existing = existingByUrl ?? existingByTitle;

    if (!existing) {
      byUrl.set(article.url, article);
      byTitle.set(key, article);
      order.push(article.url);
      continue;
    }

    const better = chooseBetterArticle(existing, article);
    byUrl.delete(existing.url);
    byTitle.delete(titleKey(existing.title));
    byUrl.set(better.url, better);
    byTitle.set(titleKey(better.title), better);

    const index = order.indexOf(existing.url);
    if (index >= 0) {
      order[index] = better.url;
    }
  }

  return order.flatMap((url) => {
    const article = byUrl.get(url);
    return article ? [article] : [];
  });
}
