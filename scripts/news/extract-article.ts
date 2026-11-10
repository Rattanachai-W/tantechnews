import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import { logger } from "../shared/logger";
import { withRetry } from "../shared/retry";

export interface ExtractedArticle {
  title: string;
  textContent: string;
  imageUrl?: string;
}

const MIN_EXTRACTED_TEXT_LENGTH = 300;

export function parseArticleHtml(html: string, url: string): ExtractedArticle | null {
  const cleanedHtml = html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, "");

  const dom = new JSDOM(cleanedHtml, { url });
  const doc = dom.window.document;
  const parsed = new Readability(doc).parse();
  const textContent = parsed?.textContent.replace(/\s+/g, " ").trim();

  if (!parsed?.title || !textContent || textContent.length < MIN_EXTRACTED_TEXT_LENGTH) {
    return null;
  }

  // Extract OpenGraph or Twitter cover image meta tags
  const ogImage =
    doc.querySelector('meta[property="og:image"]')?.getAttribute("content") ||
    doc.querySelector('meta[name="twitter:image"]')?.getAttribute("content") ||
    doc.querySelector('meta[property="twitter:image"]')?.getAttribute("content");

  let imageUrl: string | undefined = undefined;
  if (ogImage && /^https?:\/\//i.test(ogImage.trim())) {
    imageUrl = ogImage.trim();
  }

  return {
    title: parsed.title,
    textContent,
    imageUrl
  };
}

async function fetchArticleHtml(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9"
    },
    signal: AbortSignal.timeout(15000)
  });

  if (!response.ok) {
    throw new Error(`Article fetch returned status ${response.status}`);
  }

  return response.text();
}

function parseCoverImageUrl(html: string, url: string): string | undefined {
  const cleanedHtml = html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, "");

  const dom = new JSDOM(cleanedHtml, { url });
  const doc = dom.window.document;
  const ogImage =
    doc.querySelector('meta[property="og:image"]')?.getAttribute("content") ||
    doc.querySelector('meta[name="twitter:image"]')?.getAttribute("content") ||
    doc.querySelector('meta[property="twitter:image"]')?.getAttribute("content");

  if (ogImage && /^https?:\/\//i.test(ogImage.trim())) {
    return ogImage.trim();
  }

  return undefined;
}

export async function extractArticle(url: string): Promise<ExtractedArticle | null> {
  try {
    const html = await withRetry(() => fetchArticleHtml(url), {
      attempts: 3,
      label: `extract:${url}`,
      delayMs: 1000
    });
    const article = parseArticleHtml(html, url);

    if (!article) {
      logger.warn("Extracted article content was too short or unreadable", { url });
      return null;
    }

    return article;
  } catch (error) {
    logger.error("Failed to extract article", {
      url,
      error: error instanceof Error ? error.message : String(error)
    });
    return null;
  }
}

/** Fetch only the cover image from a page (for repairing articles missing imageUrl). */
export async function extractCoverImage(url: string): Promise<string | undefined> {
  try {
    const html = await withRetry(() => fetchArticleHtml(url), {
      attempts: 2,
      label: `cover:${url}`,
      delayMs: 800
    });
    return parseCoverImageUrl(html, url);
  } catch (error) {
    logger.warn("Failed to extract cover image", {
      url,
      error: error instanceof Error ? error.message : String(error)
    });
    return undefined;
  }
}
