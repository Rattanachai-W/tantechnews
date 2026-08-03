import { getCollection, type CollectionEntry } from "astro:content";
import { ARTICLE_CATEGORIES, type ArticleCategory } from "../types/article";
import {
  countCategories,
  getCategoryHref as getPureCategoryHref
} from "./categories";
import { shouldIncludeDraftContent } from "./drafts";

export type NewsEntry = CollectionEntry<"news">;
export type DailyEntry = CollectionEntry<"daily">;

const newsContentModules = import.meta.glob("../content/news/**/*.md");
const dailyContentModules = import.meta.glob("../content/daily/**/*.md");

function isVisibleDraftState(draft: boolean): boolean {
  return shouldIncludeDraftContent() || !draft;
}

export async function getPublishedNews(): Promise<NewsEntry[]> {
  if (Object.keys(newsContentModules).length === 0) return [];

  const entries = await getCollection(
    "news",
    ({ data }: { data: NewsEntry["data"] }) => isVisibleDraftState(data.draft)
  );
  return (entries as NewsEntry[]).sort(
    (a: NewsEntry, b: NewsEntry) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime()
  );
}

export async function getAllNewsForPreview(): Promise<NewsEntry[]> {
  if (Object.keys(newsContentModules).length === 0) return [];

  const entries = await getCollection("news");
  return (entries as NewsEntry[]).sort(
    (a: NewsEntry, b: NewsEntry) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime()
  );
}

export async function getPublishedDailyDigests(): Promise<DailyEntry[]> {
  if (Object.keys(dailyContentModules).length === 0) return [];

  const entries = await getCollection(
    "daily",
    ({ data }: { data: DailyEntry["data"] }) => isVisibleDraftState(data.draft)
  );
  return (entries as DailyEntry[]).sort(
    (a: DailyEntry, b: DailyEntry) => b.data.date.getTime() - a.data.date.getTime()
  );
}

export function getPrimaryCategory(entry: NewsEntry): ArticleCategory {
  return entry.data.categories[0] ?? "AI";
}

export function getCategoryHref(category: ArticleCategory): string {
  return getPureCategoryHref(category);
}

export function countArticlesByCategory(entries: NewsEntry[]): Map<ArticleCategory, number> {
  return countCategories(entries);
}

export function getArticleHref(entry: NewsEntry): string {
  return `/news/${entry.slug}/`;
}

export function getDailyHref(entry: DailyEntry): string {
  return `/daily/${entry.id.replace(/\.md$/, "")}/`;
}

export function categoryFromParam(param: string): ArticleCategory | null {
  const normalized = param.toLowerCase();
  return (
    ARTICLE_CATEGORIES.find(
      (category) => category.toLowerCase().replace(/\s+/g, "-") === normalized
    ) ?? null
  );
}
