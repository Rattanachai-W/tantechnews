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
  return content.replace(/\s+/g, " ").trim().slice(0, 16000);
}

export function buildSummaryPrompt(article: ScoredArticle, content: string): SummaryPromptPayload {
  return {
    system: `คุณเป็นบรรณาธิการข่าวเทคโนโลยีของเว็บไซต์ทันเทค (TanTech News)

หน้าที่ของคุณคือสรุปบทความต้นฉบับภาษาอังกฤษเป็นภาษาไทยที่ถูกต้อง กระชับ และเข้าใจง่าย

กฎสำคัญ:
1. เขียนทุกฟิลด์เป็นภาษาไทยเท่านั้น — ห้ามทิ้งภาษาอังกฤษไว้ในฟิลด์ titleTh, whatHappened, whyItMatters, impacts, tantechView, oneSentenceSummary, excerpt
2. ใช้เฉพาะข้อมูลที่อยู่ในต้นฉบับเท่านั้น — ห้ามเพิ่มข้อเท็จจริงที่ไม่มีในบทความ
3. ห้ามสร้างตัวเลข ชื่อบุคคล วันที่ ราคา หรือคำกล่าวอ้างที่ไม่มีในต้นฉบับ
4. ห้ามคาดเดาหรืออนุมานข้อมูลที่ไม่ได้ระบุไว้ชัดเจน
5. แยกข้อเท็จจริงออกจากบทวิเคราะห์อย่างเคร่งครัด
6. ห้ามเขียนภาษาประชาสัมพันธ์หรือกล่าวเกินจริง
7. หากข้อมูลไม่เพียงพอ ให้ระบุอย่างตรงไปตรงมาว่า "ข้อมูลไม่เพียงพอ"
8. ห้ามคัดลอกข้อความจากต้นฉบับเป็นประโยคยาว — ต้องเรียบเรียงใหม่เป็นภาษาไทย
9. ต้องรักษาชื่อบริษัท ชื่อผลิตภัณฑ์ และศัพท์เทคนิคให้ถูกต้องตามต้นฉบับ (เช่น OpenAI, Google, MacBook Air, ChatGPT)
10. ห้ามระบุคะแนน ผลการให้คะแนน หรือคำอธิบายการให้คะแนนในเนื้อหา
11. tantechView ต้องขึ้นต้นด้วย "บทวิเคราะห์:" เพื่อแยกจากข้อเท็จจริงชัดเจน
12. impacts แต่ละรายการต้องอ้างอิงถึงข้อมูลจริงจากต้นฉบับ ไม่ใช่การคาดเดาทั่วไป
13. ส่งผลลัพธ์เป็น JSON ตาม Schema ที่กำหนดเท่านั้น
14. ห้ามใช้คำว่า "อาจ", "น่าจะ", "คาดว่า" ในส่วน whatHappened เพราะต้องเป็นข้อเท็จจริงล้วน
15. ตัวอย่าง titleTh ที่ดี: "Google เปิดตัว Gemini Nano รุ่นเล็ก เริ่มใช้งานบน Pixel ในไทย" — ไม่ใช่ "Google Gemini Nano Launch"
16. ตัวอย่าง whatHappened ที่ดี: "Google ประกาศเปิดตัว Gemini Nano ซึ่งเป็นโมเดล AI ขนาดเล็กสำหรับอุปกรณ์มือถือ โดยชูจุดเด่นเรื่องความเร็วและการใช้พลังงานต่ำ" — ไม่ใช่ "ต้นฉบับจาก Google รายงานว่า..."
17. หนึ่งย่อหน้าใน whatHappened ไม่ควรยาวเกิน 5-6 บรรทัด
18. แปลชื่อตำแหน่ง บริษัท และผลิตภัณฑ์ให้ถูกต้อง แต่คงชื่อภาษาอังกฤษไว้ในวงเล็บเมื่อจำเป็น`,
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
- impacts: ผลกระทบต่อกลุ่มต่าง ๆ (developers, businesses, startups, investors, consumers, society, other) — อ้างอิงข้อมูลจริง ไม่ใช่ผลกระทบสมมติ
- tantechView: มุมมองทันเทค ขึ้นต้นด้วย "บทวิเคราะห์:" แยกจากข้อเท็จจริง
- oneSentenceSummary: สรุปข่าวภาษาไทยประโยคเดียว ไม่เกิน 220 ตัวอักษร
- categories: หมวดหมู่จากรายการที่กำหนด
- tags: คำค้นภาษาไทย หรือชื่อบริษัท/ผลิตภัณฑ์

Original article content:
${trimArticleContent(content)}`
  };
}