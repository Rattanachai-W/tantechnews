import type { ArticleSummary, ScoredArticle } from "../../src/types/article";
import { logger } from "../shared/logger";
import { loadAiSummaryConfig } from "./ai-config";
import { requestAiSummary } from "./ai-summary-client";
import { buildSummaryPrompt } from "./summary-prompt";
import { verifySummary } from "./verify-summary";

function compactText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function sentenceSlice(value: string, maxLength: number): string {
  const text = compactText(value);
  if (text.length <= maxLength) return text;

  const boundary = text.slice(0, maxLength).lastIndexOf(".");
  if (boundary > 160) return text.slice(0, boundary + 1);

  return `${text.slice(0, maxLength).replace(/\s+\S*$/, "")}...`;
}

/**
 * Extract the first meaningful paragraph from the article content.
 * Skips boilerplate like navigation, copyright notices, etc.
 */
function extractFirstParagraph(text: string): string {
  const paragraphs = text.split(/\n\s*\n/);
  for (const para of paragraphs) {
    const cleaned = para.trim();
    // Skip very short paragraphs, copyright, navigation, etc.
    if (cleaned.length < 60) continue;
    if (/all rights reserved|copyright|subscribe|sign up|newsletter/i.test(cleaned)) continue;
    return cleaned;
  }
  return text.slice(0, 300);
}

/**
 * Extract key named entities (companies, people, products) from the text.
 */
function extractEntities(text: string, maxCount = 5): string[] {
  // Match capitalized words that look like proper nouns
  const matches = text.match(/\b[A-Z][a-zA-Z]{2,}(?:\s[A-Z][a-zA-Z]{2,}){0,2}\b/g) ?? [];
  const unique = [...new Set(matches)];
  return unique.slice(0, maxCount);
}

/**
 * Extract likely numbers from the text (prices, percentages, dates).
 */
function extractKeyNumbers(text: string): string[] {
  const matches = text.match(/\$?\d+(?:[.,]\d+)?\s*(?:million|billion|%|percent|dollars?|euros?|บาท)?/gi) ?? [];
  return [...new Set(matches)].slice(0, 5);
}

function getImpactGroup(category: string): ArticleSummary["impacts"][number]["group"] {
  if (category === "Startup") return "startups";
  if (category === "Business") return "businesses";
  if (category === "Programming" || category === "Open Source" || category === "Cloud") return "developers";
  if (category === "Hardware" || category === "Mobile") return "consumers";
  return "other";
}

function summarizeWithoutAi(article: ScoredArticle, content: string): ArticleSummary {
  const sourceExcerpt = sentenceSlice(content, 600);
  const category = article.score.category;
  const titleTh = article.title;
  const description = article.description
    ? sentenceSlice(compactText(article.description), 200)
    : sentenceSlice(sourceExcerpt, 200);

  // Extract key info from the content
  const firstPara = extractFirstParagraph(content);
  const entities = extractEntities(firstPara || content);
  const numbers = extractKeyNumbers(firstPara || content);

  // Build a more useful fallback summary
  const entityStr = entities.length > 0 ? entities.join(", ") : "";
  const numberStr = numbers.length > 0 ? ` (${numbers.join(", ")})` : "";

  const whatHappened = `จากรายงานของ ${article.sourceName}${entityStr ? ` เกี่ยวกับ ${entityStr}` : ""}${numberStr}: ${firstPara || sourceExcerpt}`;

  return {
    titleTh,
    excerpt: description,
    whatHappened,
    whyItMatters: `ข่าวนี้เกี่ยวข้องกับ${entityStr ? ` ${entityStr} และ` : ""} หมวด${category} ซึ่งเป็นประเด็นที่กลุ่มผู้อ่านทันเทคติดตาม`,
    impacts: [
      {
        group: getImpactGroup(category),
        title: `ผลกระทบต่อ${entityStr || `กลุ่ม ${category}`}`,
        description: `รายงานจาก ${article.sourceName}${entityStr ? ` เกี่ยวกับ ${entityStr}` : ` ในหมวด ${category}`} อาจมีนัยสำคัญต่อการวางแผนและการตัดสินใจในวงการเทคโนโลยี`
      }
    ],
    tantechView:
      `บทวิเคราะห์: ข่าวจาก ${article.sourceName}${entityStr ? ` เกี่ยวกับ ${entityStr}` : ""} ${numbers.length > 0 ? `ที่มีรายละเอียดตัวเลข${numberStr} ` : ""}ชี้ให้เห็นประเด็นที่ควรติดตามในหมวด${category} โดยเฉพาะในบริบทของผู้อ่านทันเทคที่ต้องการเข้าใจแนวโน้มเทคโนโลยี`,
    oneSentenceSummary: `${entityStr ? `ความเคลื่อนไหวของ ${entityStr} ` : ""}ในหมวด${category}${numberStr} จาก ${article.sourceName}`,
    categories: [category],
    tags: [category, ...entities.slice(0, 3)]
  };
}

export async function summarizeArticle(article: ScoredArticle, content: string): Promise<ArticleSummary> {
  const aiConfig = loadAiSummaryConfig();

  if (!aiConfig) {
    logger.warn("AI summary config missing, falling back to non-AI summary", {
      sourceUrl: article.url,
      model: process.env.AI_SUMMARY_MODEL ?? process.env.OPENROUTER_MODEL
    });
    return summarizeWithoutAi(article, content);
  }

  const aiSummary = await requestAiSummary(aiConfig, buildSummaryPrompt(article, content));
  if (aiSummary) {
    // Verify the AI summary for hallucination and quality issues
    const verification = verifySummary(aiSummary, content);

    if (!verification.valid) {
      logger.warn("AI summary failed verification, falling back to non-AI summary", {
        sourceUrl: article.url,
        warnings: verification.warnings
      });
      return summarizeWithoutAi(article, content);
    }

    if (verification.warnings.length > 0) {
      logger.info("AI summary passed with warnings", {
        sourceUrl: article.url,
        warningCount: verification.warnings.length
      });
    } else {
      logger.info("Used AI summary for article", { sourceUrl: article.url });
    }

    return aiSummary;
  }

  logger.warn("Falling back to non-AI summary after AI summary failure", {
    sourceUrl: article.url
  });
  return summarizeWithoutAi(article, content);
}