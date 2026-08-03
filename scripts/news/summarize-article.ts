import type { ArticleSummary, ScoredArticle } from "../../src/types/article";
import { logger } from "../shared/logger";
import { loadAiSummaryConfig } from "./ai-config";
import { requestAiSummary } from "./ai-summary-client";
import { buildSummaryPrompt } from "./summary-prompt";

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

function getImpactGroup(category: string): ArticleSummary["impacts"][number]["group"] {
  if (category === "Startup") return "startups";
  if (category === "Business") return "businesses";
  if (category === "Programming" || category === "Open Source" || category === "Cloud") return "developers";
  if (category === "Hardware" || category === "Mobile") return "consumers";
  return "other";
}

function summarizeWithoutAi(article: ScoredArticle, content: string): ArticleSummary {
  const sourceExcerpt = sentenceSlice(content, 620);
  const context = article.description ? compactText(article.description) : sourceExcerpt;
  const category = article.score.category;

  return {
    titleTh: article.title,
    excerpt: sentenceSlice(context, 180),
    whatHappened: `ต้นฉบับจาก ${article.sourceName} รายงานว่า ${sourceExcerpt}`,
    whyItMatters: `ข่าวนี้ถูกจัดอยู่ในหมวด ${category} และได้คะแนนคัดเลือก ${article.score.totalScore.toFixed(
      1
    )}/10 จากเกณฑ์ความสำคัญ ความเกี่ยวข้อง ความใหม่ และความน่าเชื่อถือของทันเทค`,
    impacts: [
      {
        group: getImpactGroup(category),
        title: `ผลต่อกลุ่มผู้อ่านหมวด ${category}`,
        description:
          "ควรติดตามรายละเอียดจากแหล่งข่าวต้นฉบับ โดยเฉพาะผลต่อการตัดสินใจเชิงเทคนิค ผลิตภัณฑ์ หรือธุรกิจที่เกี่ยวข้อง"
      }
    ],
    tantechView:
      "ข้อมูลจากต้นฉบับมีน้ำหนักพอสำหรับเปิดเป็น draft ตรวจข่าว แต่ควรให้บรรณาธิการตรวจความครบถ้วนของบริบท ตัวเลข และคำกล่าวอ้างก่อนเผยแพร่",
    oneSentenceSummary: sentenceSlice(context, 150),
    categories: [category],
    tags: [category]
  };
}

export async function summarizeArticle(article: ScoredArticle, content: string): Promise<ArticleSummary> {
  const aiConfig = loadAiSummaryConfig();

  if (aiConfig) {
    const aiSummary = await requestAiSummary(aiConfig, buildSummaryPrompt(article, content));
    if (aiSummary) {
      return aiSummary;
    }

    logger.warn("Falling back to extractive summary after AI summary failure", {
      sourceUrl: article.url
    });
  }

  return summarizeWithoutAi(article, content);
}
