import { createArticleId } from "../shared/hash";
import type { RawArticle } from "../../src/types/article";
import type { NewsSource } from "../../src/types/source";

const TRACKING_PARAMS = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "fbclid",
  "gclid",
  "ref",
  "source"
]);

export function normalizeUrl(value: string): string {
  const url = new URL(value);
  url.hash = "";
  for (const param of [...url.searchParams.keys()]) {
    if (TRACKING_PARAMS.has(param.toLowerCase())) {
      url.searchParams.delete(param);
    }
  }
  return url.toString();
}

export function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function normalizeArticle(input: {
  title: string;
  url: string;
  publishedAt: string;
  source: NewsSource;
  description?: string;
  author?: string;
  imageUrl?: string;
}): RawArticle {
  const normalizedUrl = normalizeUrl(input.url);

  return {
    id: createArticleId(normalizedUrl),
    title: normalizeText(input.title),
    url: normalizedUrl,
    sourceName: input.source.name,
    sourceType: input.source.type,
    sourceTier: input.source.tier,
    publishedAt: new Date(input.publishedAt).toISOString(),
    description: input.description ? normalizeText(input.description) : undefined,
    author: input.author ? normalizeText(input.author) : undefined,
    imageUrl: input.imageUrl
  };
}
