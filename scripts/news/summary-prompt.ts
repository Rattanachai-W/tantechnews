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
  "categories": ["${ARTICLE_CATEGORIES.join('" | "')}" ],
  "tags": ["string"]
}`;

export interface SummaryPromptPayload {
  system: string;
  user: string;
}

function trimArticleContent(content: string): string {
  return content.replace(/\s+/g, " ").trim().slice(0, 3500);
}

export function buildSummaryPrompt(article: ScoredArticle, content: string): SummaryPromptPayload {
  return {
    system: `You are a Thai technology news editor writing in authentic, sharp tech blog style (like Blognone / Techsauce). Output only valid JSON.
IMPORTANT: Do not think or output internal reasoning. Return the completed JSON response immediately.

กฎการเขียนเนื้อหาภาษาไทย:
1. เขียนทุกฟิลด์เป็นภาษาไทยที่สละสลวย กระชับ ได้ใจความ สไตล์สำนักข่าวเทคโนโลยีมืออาชีพ (ยกเว้นชื่อเฉพาะ/ศัพท์เทคนิค เช่น OpenAI, Google, ChatGPT, Docker)
2. Strict Fact Verification: อิงเฉพาะข้อมูลในบทความต้นฉบับ ห้ามคาดเดา แต่งเติม หรือเปลี่ยนแปลงตัวเลข สถิติ ราคา วันที่ หรือชื่อเฉพาะโดยเด็ดขาด
3. ฟิลด์ tantechView ต้องขึ้นต้นด้วย "บทวิเคราะห์:"
4. ส่งผลลัพธ์เป็น JSON ตาม Schema ที่กำหนดเท่านั้น`,
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

คำอธิบายการส่งออก:
- titleTh: ชื่อข่าวภาษาไทย สั้น กระชับ สะกดถูกต้อง — ต้องเป็นภาษาไทย ไม่ใช่ภาษาอังกฤษ
- excerpt: สรุปประเด็นหลักภาษาไทย ไม่เกิน 280 ตัวอักษร
- whatHappened: สรุปเหตุการณ์หลักจากบทความเป็นภาษาไทย — เฉพาะข้อเท็จจริงในต้นฉบับ ห้ามใช้คำว่า "อาจ" "น่าจะ" "คาดว่า"
- whyItMatters: อธิบายความสำคัญสำหรับผู้อ่านเทคเป็นภาษาไทย — อ้างอิงข้อมูลจริงจากบทความ
- impacts: สรุปผลกระทบภาพรวม 2-3 ประเด็นหลัก สั้น กระชับ ตรงประเด็น ห้ามเขียนซ้ำซ้อนกัน โดยเลือกเฉพาะกลุ่มที่เกี่ยวข้องหลักที่สุด (developers, businesses, startups, investors, consumers, society, other)
- tantechView: มุมมองทันเทค ขึ้นต้นด้วย "บทวิเคราะห์:" แยกจากข้อเท็จจริง
- oneSentenceSummary: สรุปข่าวภาษาไทยประโยคเดียว ไม่เกิน 220 ตัวอักษร
- categories: หมวดหมู่จากรายการที่กำหนด
- tags: คำค้นภาษาไทย หรือชื่อบริษัท/ผลิตภัณฑ์

Original article content:
${trimArticleContent(content)}`
  };
}