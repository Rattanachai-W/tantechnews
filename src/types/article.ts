export const ARTICLE_CATEGORIES = [
  "AI",
  "Programming",
  "Cloud",
  "Cybersecurity",
  "Startup",
  "Business",
  "Open Source",
  "Data",
  "Hardware",
  "Mobile",
  "Science"
] as const;

export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number];

export interface RawArticle {
  id: string;
  title: string;
  url: string;
  sourceName: string;
  sourceType: "rss" | "api" | "manual";
  sourceTier?: 1 | 2 | 3;
  publishedAt: string;
  description?: string;
  author?: string;
  imageUrl?: string;
}

export interface ArticleScore {
  importance: number;
  relevance: number;
  novelty: number;
  credibility: number;
  totalScore: number;
  category: ArticleCategory;
  reason: string;
}

export interface ScoredArticle extends RawArticle {
  score: ArticleScore;
}

export interface ArticleImpact {
  group:
    | "developers"
    | "businesses"
    | "startups"
    | "investors"
    | "consumers"
    | "society"
    | "other";
  title: string;
  description: string;
}

export interface ArticleSummary {
  titleTh: string;
  excerpt: string;
  whatHappened: string;
  whyItMatters: string;
  impacts: ArticleImpact[];
  tantechView: string;
  oneSentenceSummary: string;
  categories: ArticleCategory[];
  tags: string[];
}

export interface ProcessedArticle extends RawArticle {
  slug: string;
  summary: ArticleSummary;
  score: ArticleScore;
  readingTimeMinutes: number;
  generatedAt: string;
  status: "draft" | "review" | "published" | "rejected";
}
