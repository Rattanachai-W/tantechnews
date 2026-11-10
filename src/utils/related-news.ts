import type { NewsEntry } from "./content";

function sharedCount(left: string[], right: string[]): number {
  if (left.length === 0 || right.length === 0) return 0;
  const rightSet = new Set(right.map((value) => value.toLowerCase()));
  return left.reduce(
    (count, value) => (rightSet.has(value.toLowerCase()) ? count + 1 : count),
    0
  );
}

export function getRelatedNews(
  current: NewsEntry,
  candidates: NewsEntry[],
  limit = 6
): NewsEntry[] {
  if (limit <= 0) return [];

  const others = candidates.filter((entry) => entry.id !== current.id);
  const scored = others.map((entry) => ({
    entry,
    tagScore: sharedCount(current.data.tags, entry.data.tags),
    categoryScore: sharedCount(current.data.categories, entry.data.categories),
    publishedAt: entry.data.publishedAt.getTime()
  }));

  const byTags = scored
    .filter((item) => item.tagScore > 0)
    .sort(
      (a, b) =>
        b.tagScore - a.tagScore ||
        b.categoryScore - a.categoryScore ||
        b.publishedAt - a.publishedAt
    );

  const byCategory = scored
    .filter((item) => item.tagScore === 0 && item.categoryScore > 0)
    .sort(
      (a, b) =>
        b.categoryScore - a.categoryScore || b.publishedAt - a.publishedAt
    );

  const byLatest = scored
    .filter((item) => item.tagScore === 0 && item.categoryScore === 0)
    .sort((a, b) => b.publishedAt - a.publishedAt);

  return [...byTags, ...byCategory, ...byLatest]
    .slice(0, limit)
    .map((item) => item.entry);
}
