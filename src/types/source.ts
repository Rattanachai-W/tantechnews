import type { ArticleCategory } from "./article";

export interface ApiSourceMapping {
  itemsPath?: string;
  title: string;
  url: string;
  publishedAt: string;
  description?: string;
  author?: string;
  imageUrl?: string;
}

export interface BaseNewsSource {
  id: string;
  name: string;
  enabled: boolean;
  tier: 1 | 2 | 3;
  categories: ArticleCategory[];
  language: string;
}

export interface RssNewsSource extends BaseNewsSource {
  url: string;
  type: "rss";
}

export interface ApiNewsSource extends BaseNewsSource {
  url: string;
  type: "api";
  method?: "GET";
  headers?: Record<string, string>;
  mapping: ApiSourceMapping;
}

export type NewsSource = RssNewsSource | ApiNewsSource;

export interface NewsSourceConfig {
  sources: NewsSource[];
}
