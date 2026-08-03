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
4. อย่าเพิ่มข้อเท็จจริงใหม่จากความจำ
5. ถ้า metadata ไม่พอ ให้ลด novelty หรือ credibility และอธิบายใน reason
6. ส่งผลลัพธ์เป็น JSON ตาม schema เท่านั้น`,
    user: `งาน: ให้คะแนนข่าวเทคโนโลยีจาก metadata ก่อนดึงบทความเต็ม

Allowed categories:
${ARTICLE_CATEGORIES.map((category) => `- ${category}`).join("\n")}

Output JSON schema:
${OUTPUT_SCHEMA_DESCRIPTION}

Article metadata:
${JSON.stringify(metadata, null, 2)}`
  };
}
