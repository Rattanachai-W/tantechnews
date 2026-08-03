import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import { logger } from "../shared/logger";
import { withRetry } from "../shared/retry";

export interface ExtractedArticle {
  title: string;
  textContent: string;
}

const MIN_EXTRACTED_TEXT_LENGTH = 300;

export function parseArticleHtml(html: string, url: string): ExtractedArticle | null {
  const dom = new JSDOM(html, { url });
  const parsed = new Readability(dom.window.document).parse();
  const textContent = parsed?.textContent.replace(/\s+/g, " ").trim();

  if (!parsed?.title || !textContent || textContent.length < MIN_EXTRACTED_TEXT_LENGTH) {
    return null;
  }

  return {
    title: parsed.title,
    textContent
  };
}

async function fetchArticleHtml(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "TanTechNewsBot/0.1 (+https://tantechnews.com)"
    },
    signal: AbortSignal.timeout(15000)
  });

  if (!response.ok) {
    throw new Error(`Article fetch returned status ${response.status}`);
  }

  return response.text();
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
