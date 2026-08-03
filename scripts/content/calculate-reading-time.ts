const THAI_WORDS_PER_MINUTE = 350;

export function calculateReadingTime(text: string): number {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return 1;

  const thaiCharacterCount = [...normalized].filter((char) => /[ก-๙]/.test(char)).length;
  const latinWordCount = normalized.split(/\s+/).filter((token) => /[A-Za-z0-9]/.test(token)).length;
  const estimatedWords = latinWordCount + thaiCharacterCount / 6;

  return Math.max(1, Math.ceil(estimatedWords / THAI_WORDS_PER_MINUTE));
}
