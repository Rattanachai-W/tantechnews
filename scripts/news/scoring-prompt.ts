import { ARTICLE_CATEGORIES, type RawArticle } from "../../src/types/article";

const OUTPUT_SCHEMA_DESCRIPTION = `{
  "articles": [
    {
      "id": "string",
      "score": {
        "importance": 1-10,
        "relevance": 1-10,
        "novelty": 1-10,
        "credibility": 1-10,
        "totalScore": 1-10,
        "category": "${ARTICLE_CATEGORIES.join('" | "')}",
        "reason": "string"
      }
    }
  ]
}`;

export interface ScoringPromptPayload {
  system: string;
  user: string;
}

export function buildScoringPrompt(articles: RawArticle[]): ScoringPromptPayload {
  const metadata = articles.map((article) => ({
    id: article.id,
    title: article.title,
    url: article.url,
    sourceName: article.sourceName,
    sourceType: article.sourceType,
    sourceTier: article.sourceTier ?? null,
    publishedAt: article.publishedAt,
    description: article.description ?? null
  }));

  return {
    system: `คุณเป็นบรรณาธิการข่าวเทคโนโลยีของเว็บไซต์ทันเทค

หน้าที่ของคุณคือให้คะแนนข่าวจาก metadata เท่านั้น ห้ามใช้ข้อมูลที่ไม่มีใน input

กฎสำคัญ:
1. ให้คะแนนแต่ละด้านเป็นจำนวนเต็ม 1-10
2. totalScore ต้องคำนวณจาก Importance × 0.40 + Relevance × 0.30 + Novelty × 0.20 + Credibility × 0.10
3. เลือก category จากรายการที่กำหนดเท่านั้น
4. อย่าเพิ่มข้อเท็จจริงใหม่จากความจำ — ใช้เฉพาะ metadata ที่ให้มา
5. ถ้า metadata ไม่พอ ให้ลด novelty หรือ credibility และอธิบายใน reason
6. ให้ credibility สูงสำหรับ sourceTier 1 (Official), ปานกลางสำหรับ tier 2 (Trusted Publication), ต่ำสำหรับ tier 3 (Discovery)
7. ให้ importance สูงสำหรับข่าวที่มีผลกระทบเป็นวงกว้าง (เช่น การเปลี่ยนแปลงราคา, policy, security breach, การเปิดตัวผลิตภัณฑ์ใหม่)
8. ให้ novelty สูงสำหรับข่าวที่ไม่ใช่ข่าวซ้ำหรือข่าวเก่ามาเล่าใหม่
9. reason ต้องอธิบายสั้น ๆ ว่าทำไมให้คะแนนระดับนั้น โดยอ้างอิง metadata จริง
10. ส่งผลลัพธ์เป็น JSON ตาม schema เท่านั้น`,
    user: `งาน: ให้คะแนนข่าวเทคโนโลยีจาก metadata ก่อนดึงบทความเต็ม

คะแนนอ้างอิง:
- Source Tier 1 (Official Blog/Company): credibility 8-10
- Source Tier 2 (Trusted Publication): credibility 6-7
- Source Tier 3 (Discovery/Community): credibility 3-5

Allowed categories:
${ARTICLE_CATEGORIES.map((category) => `- ${category}`).join("\n")}

Output JSON schema:
${OUTPUT_SCHEMA_DESCRIPTION}

Article metadata:
${JSON.stringify(metadata, null, 2)}`
  };
}
