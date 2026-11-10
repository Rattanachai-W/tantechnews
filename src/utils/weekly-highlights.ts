import type { NewsEntry } from "./content";

const DAY_MS = 24 * 60 * 60 * 1000;

export function getIsoWeekSeed(date = new Date()): string {
  const utc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((utc.getTime() - yearStart.getTime()) / DAY_MS + 1) / 7);
  return `${utc.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

function hashSeed(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number): () => number {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededShuffle<T>(items: T[], seed: string): T[] {
  const result = [...items];
  const random = mulberry32(hashSeed(seed));

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

export function getArticlesFromLastDays(
  articles: NewsEntry[],
  days = 7,
  now = new Date()
): NewsEntry[] {
  const cutoff = now.getTime() - days * DAY_MS;
  return articles.filter((article) => article.data.publishedAt.getTime() >= cutoff);
}

export function getWeeklyHighlightArticles(
  articles: NewsEntry[],
  limit = 5,
  now = new Date()
): NewsEntry[] {
  if (limit <= 0) return [];

  const recent = getArticlesFromLastDays(articles, 7, now);
  const pool = recent.length > 0 ? recent : articles.slice(0, Math.max(limit * 2, limit));
  const seed = getIsoWeekSeed(now);
  return seededShuffle(pool, seed).slice(0, Math.min(limit, pool.length));
}
