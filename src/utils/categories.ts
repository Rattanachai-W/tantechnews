import { ARTICLE_CATEGORIES, type ArticleCategory } from "../types/article";

export function getCategoryHref(category: ArticleCategory): string {
  return `/category/${category.toLowerCase().replace(/\s+/g, "-")}/`;
}

export function countCategories<T extends { data: { categories: ArticleCategory[] } }>(
  entries: T[]
): Map<ArticleCategory, number> {
  const counts = new Map<ArticleCategory, number>(
    ARTICLE_CATEGORIES.map((category) => [category, 0])
  );

  for (const entry of entries) {
    for (const category of entry.data.categories) {
      counts.set(category, (counts.get(category) ?? 0) + 1);
    }
  }

  return counts;
}
