import type { ArticleCategory, ScoredArticle } from "../../src/types/article";

export interface SelectTopArticlesOptions {
  maxArticles: number;
  maxPerCategory: number;
}

function sortByScore(articles: ScoredArticle[]): ScoredArticle[] {
  return [...articles].sort((a, b) => b.score.totalScore - a.score.totalScore);
}

export function selectTopArticles(
  articles: ScoredArticle[],
  options: SelectTopArticlesOptions
): ScoredArticle[] {
  const sorted = sortByScore(articles);
  const selected: ScoredArticle[] = [];
  const selectedIds = new Set<string>();
  const categoryCounts = new Map<ArticleCategory, number>();

  for (const article of sorted) {
    if (selected.length >= options.maxArticles) break;

    const category = article.score.category;
    const currentCount = categoryCounts.get(category) ?? 0;
    if (currentCount >= options.maxPerCategory) continue;

    selected.push(article);
    selectedIds.add(article.id);
    categoryCounts.set(category, currentCount + 1);
  }

  for (const article of sorted) {
    if (selected.length >= options.maxArticles) break;
    if (selectedIds.has(article.id)) continue;

    selected.push(article);
    selectedIds.add(article.id);
  }

  return selected;
}
