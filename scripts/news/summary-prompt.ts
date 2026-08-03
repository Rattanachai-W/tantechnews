import { ARTICLE_CATEGORIES, type ScoredArticle } from "../../src/types/article";

const OUTPUT_SCHEMA_DESCRIPTION = `{
  "titleTh": "string",
  "excerpt": "string",
  "whatHappened": "string",
  "whyItMatters": "string",
  "impacts": [
    {
      "group": "developers | businesses | startups | investors | consumers | society | other",
      "title": "string",
      "description": "string"
    }
  ],
  "tantechView": "string",
  "oneSentenceSummary": "string",
  "categories": ["${ARTICLE_CATEGORIES.join('" | "')}"],
  "tags": ["string"]
}`;

export interface SummaryPromptPayload {
  system: string;
  user: string;
}

function trimArticleContent(content: string): string {
  return content.replace(/\s+/g, " ").trim().slice(0, 16000);
}

export function buildSummaryPrompt(article: ScoredArticle, content: string): SummaryPromptPayload {
  return {
    system: `คุณเป็นบรรณาธิการข่าวเทคโนโลยีของเว็บไซต์ทันเทค

หน้าที่ของคุณคือสรุปบทความต้นฉบับเป็นภาษาไทยที่ถูกต้อง กระชับ และเข้าใจง่าย

กฎสำคัญ:
1. ใช้เฉพาะข้อมูลที่อยู่ในต้นฉบับ
2. ห้ามสร้างตัวเลข ชื่อบุคคล วันที่ หรือคำกล่าวอ้างเพิ่มเติม
3. แยกข้อเท็จจริงออกจากบทวิเคราะห์
4. ห้ามเขียนภาษาประชาสัมพันธ์หรือกล่าวเกินจริง
5. หากข้อมูลไม่เพียงพอ ให้ระบุอย่างตรงไปตรงมา
6. ห้ามคัดลอกข้อความจากต้นฉบับเป็นประโยคยาว
7. ต้องรักษาชื่อบริษัท ชื่อผลิตภัณฑ์ และศัพท์เทคนิคให้ถูกต้อง
8. ส่งผลลัพธ์เป็น JSON ตาม Schema ที่กำหนดเท่านั้น`,
    user: `งาน: สรุปข่าวเทคโนโลยีจากบทความต้นฉบับเป็นภาษาไทย

Metadata:
- Title: ${article.title}
- URL: ${article.url}
- Source: ${article.sourceName}
- Published at: ${article.publishedAt}
- Suggested category: ${article.score.category}
- Score reason: ${article.score.reason}

Allowed categories:
${ARTICLE_CATEGORIES.map((category) => `- ${category}`).join("\n")}

Output JSON schema:
${OUTPUT_SCHEMA_DESCRIPTION}

Original article content:
${trimArticleContent(content)}`
  };
}
