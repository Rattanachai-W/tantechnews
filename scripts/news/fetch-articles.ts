import Parser from "rss-parser";
import { z } from "zod";
import { readFile } from "node:fs/promises";
import { logger } from "../shared/logger";
import { withRetry } from "../shared/retry";
import { normalizeArticle } from "./normalize-articles";
import { ARTICLE_CATEGORIES, type RawArticle } from "../../src/types/article";
import type { ApiNewsSource, ApiSourceMapping, NewsSource, NewsSourceConfig, RssNewsSource } from "../../src/types/source";

const baseSourceSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string(),
  url: z.string().url(),
  enabled: z.boolean(),
  tier: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  categories: z.array(z.enum(ARTICLE_CATEGORIES)).min(1).max(3),
  language: z.string()
});

const sourceSchema = z.discriminatedUnion("type", [
  baseSourceSchema.extend({
    type: z.literal("rss")
  }),
  baseSourceSchema.extend({
    type: z.literal("api"),
    method: z.literal("GET").optional(),
    headers: z.record(z.string()).optional(),
    mapping: z.object({
      itemsPath: z.string().optional(),
      title: z.string().min(1),
      url: z.string().min(1),
      publishedAt: z.string().min(1),
      description: z.string().min(1).optional(),
      author: z.string().min(1).optional(),
      imageUrl: z.string().min(1).optional()
    })
  })
]);

const sourceConfigSchema = z.object({
  sources: z.array(sourceSchema)
});

const parser = new Parser({
  timeout: 12000,
  headers: {
    "User-Agent": "TanTechNewsBot/0.1 (+https://tantechnews.com)"
  }
});

// Limit how many items we take from a single source to avoid
// processing huge feeds (some feeds return 1000+ items).
const MAX_ITEMS_PER_SOURCE = 100;

export async function loadSources(path = "data/sources.json"): Promise<NewsSource[]> {
  const raw = await readFile(path, "utf8");
  const parsed = sourceConfigSchema.parse(JSON.parse(raw)) as NewsSourceConfig;
  return parsed.sources.filter((source) => source.enabled);
}

async function fetchRssSource(source: RssNewsSource): Promise<RawArticle[]> {
  const feed = await withRetry(() => parser.parseURL(source.url), {
    attempts: 3,
    label: `rss:${source.id}`
  });

  const items = (feed.items ?? [])
    .filter((item) => item.title && item.link && (item.isoDate || item.pubDate))
    .slice(0, MAX_ITEMS_PER_SOURCE);

  return items.map((item) =>
    normalizeArticle({
      title: item.title ?? "",
      url: item.link ?? "",
      publishedAt: item.isoDate ?? item.pubDate ?? new Date().toISOString(),
      source,
      description: item.contentSnippet,
      author: item.creator ?? item.author
    })
  );
}

function getPathValue(value: unknown, path: string | undefined): unknown {
  if (!path) return value;

  return path.split(".").reduce<unknown>((current, segment) => {
    if (current === null || typeof current !== "object") return undefined;

    if (Array.isArray(current) && /^\d+$/.test(segment)) {
      return current[Number(segment)];
    }

    return (current as Record<string, unknown>)[segment];
  }, value);
}

function toOptionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function toRequiredString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

export function normalizeApiItems(
  payload: unknown,
  source: ApiNewsSource,
  mapping: ApiSourceMapping = source.mapping
): RawArticle[] {
  const items = getPathValue(payload, mapping.itemsPath);

  if (!Array.isArray(items)) {
    logger.warn("API source payload did not contain an array at itemsPath", {
      sourceId: source.id,
      itemsPath: mapping.itemsPath ?? "<root>"
    });
    return [];
  }

  return items.flatMap((item, index) => {
    const title = toRequiredString(getPathValue(item, mapping.title));
    const url = toRequiredString(getPathValue(item, mapping.url));
    const publishedAt = toRequiredString(getPathValue(item, mapping.publishedAt));

    if (!title || !url || !publishedAt) {
      logger.warn("Skipping API item with missing required fields", {
        sourceId: source.id,
        index
      });
      return [];
    }

    try {
      return [
        normalizeArticle({
          title,
          url,
          publishedAt,
          source,
          description: toOptionalString(getPathValue(item, mapping.description)),
          author: toOptionalString(getPathValue(item, mapping.author)),
          imageUrl: toOptionalString(getPathValue(item, mapping.imageUrl))
        })
      ];
    } catch (error) {
      logger.warn("Skipping API item that failed normalization", {
        sourceId: source.id,
        index,
        error: error instanceof Error ? error.message : String(error)
      });
      return [];
    }
  });
}

async function fetchApiSource(source: ApiNewsSource): Promise<RawArticle[]> {
  const response = await withRetry(
    () =>
      fetch(source.url, {
        method: source.method ?? "GET",
        signal: AbortSignal.timeout(12000),
        headers: {
          Accept: "application/json",
          "User-Agent": "TanTechNewsBot/0.1 (+https://tantechnews.com)",
          ...source.headers
        }
      }),
    {
      attempts: 3,
      label: `api:${source.id}`
    }
  );

  if (!response.ok) {
    throw new Error(`API source returned ${response.status}`);
  }

  return normalizeApiItems(await response.json(), source);
}

export async function fetchArticles(): Promise<RawArticle[]> {
  const sources = await loadSources();
  const collected: RawArticle[] = [];

  for (const source of sources) {
    try {
      const articles =
        source.type === "rss" ? await fetchRssSource(source) : await fetchApiSource(source);
      collected.push(...articles);
      logger.info("Fetched source", { sourceId: source.id, count: articles.length });
    } catch (error) {
      logger.error("Failed to fetch source", {
        sourceId: source.id,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  return collected;
}
