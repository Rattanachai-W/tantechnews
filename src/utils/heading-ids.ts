/** Stable ASCII ids for recurring Thai article section titles. */
export const HEADING_ID_BY_TEXT: Record<string, string> = {
  "เกิดอะไรขึ้น": "what-happened",
  "ทำไมเรื่องนี้สำคัญ": "why-it-matters",
  "ผลกระทบที่น่าจับตา": "key-impacts",
  "มุมมองของทันเทค": "tantech-view",
  "สรุปในประโยคเดียว": "one-sentence-summary",
  "แหล่งข่าว": "sources"
};

export function getStableHeadingId(text: string): string | undefined {
  return HEADING_ID_BY_TEXT[text.trim()];
}
