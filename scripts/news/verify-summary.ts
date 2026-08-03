import type { ArticleSummary } from "../../src/types/article";
import { logger } from "../shared/logger";

interface VerificationResult {
  valid: boolean;
  warnings: string[];
}

/**
 * Hallucination indicators: phrases that suggest the AI invented context
 * rather than reporting what the source actually says.
 */
const HALLUCINATION_PATTERNS = [
  /according to (?:our|my) (?:analysis|research|sources)/i,
  /industry (?:insiders|experts|analysts) (?:say|believe|predict)/i,
  /(?:widely|generally) (?:expected|believed|anticipated)/i,
  /(?:rumored|rumoured) to be/i,
  /sources close to/i,
  /it is (?:well )?known that/i,
];

/**
 * Marketing/promotional language that should not appear in factual summaries.
 */
const MARKETING_PATTERNS = [
  /revolutionary|groundbreaking|game[- ]?chang(?:er|ing)/i,
  /unprecedented|massive|huge|incredible/i,
  /must[- ]?have|can't miss/i,
  /exciting (?:new|news|announcement)/i,
  /เปลี่ยนโลก|ปฏิวัติ|สุดยอด|น่าทึ่ง/,
];

const UNCERTAINTY_IN_FACTS = /(?:อาจ|น่าจะ|คาดว่า|เป็นไปได้ว่า|probably|likely|might)/i;

function hasExcessiveLength(text: string, maxWords: number): boolean {
  return text.split(/\s+/).length > maxWords;
}

export function verifySummary(
  summary: ArticleSummary,
  sourceContent: string
): VerificationResult {
  const warnings: string[] = [];
  const sourceLower = sourceContent.toLowerCase();

  // 1. Check whatHappened for speculative language (should be facts only)
  if (UNCERTAINTY_IN_FACTS.test(summary.whatHappened)) {
    warnings.push(
      "whatHappened contains speculative language (อาจ/น่าจะ/คาดว่า) — this section must be facts only"
    );
  }

  // 2. Check for hallucination indicators in any field
  const allText = [
    summary.whatHappened,
    summary.whyItMatters,
    summary.tantechView,
    summary.excerpt,
    ...summary.impacts.map((i) => i.description),
  ].join(" ");

  for (const pattern of HALLUCINATION_PATTERNS) {
    if (pattern.test(allText)) {
      warnings.push(`Possible hallucination pattern detected: ${pattern.source}`);
    }
  }

  // 3. Check for marketing language
  for (const pattern of MARKETING_PATTERNS) {
    if (pattern.test(allText)) {
      warnings.push(`Marketing/promotional language detected: ${pattern.source}`);
    }
  }

  // 4. Check tantechView starts with analysis marker
  if (
    !summary.tantechView.startsWith("บทวิเคราะห์") &&
    !summary.tantechView.startsWith("มุมมอง")
  ) {
    warnings.push(
      "tantechView should start with 'บทวิเคราะห์' or 'มุมมอง' to clearly separate analysis from facts"
    );
  }

  // 5. Check excerpt length
  if (summary.excerpt.length > 280) {
    warnings.push(`excerpt exceeds 280 characters (${summary.excerpt.length})`);
  }

  // 6. Check oneSentenceSummary length
  if (summary.oneSentenceSummary.length > 220) {
    warnings.push(
      `oneSentenceSummary exceeds 220 characters (${summary.oneSentenceSummary.length})`
    );
  }

  // 7. Check for overly long sections (suggests AI rambling rather than concise summary)
  if (hasExcessiveLength(summary.whatHappened, 150)) {
    warnings.push("whatHappened is excessively long (>150 words) — should be concise");
  }

  // 8. Check impacts have substance (not generic)
  for (const impact of summary.impacts) {
    const genericPhrases = [
      "ผลกระทบต่อ",
      "มีผลกระทบ",
      "น่าจับตา",
      "สำคัญ",
    ];
    const isGeneric =
      genericPhrases.some(
        (phrase) =>
          impact.description.includes(phrase) && impact.description.length < 80
      );
    if (isGeneric) {
      warnings.push(
        `Impact "${impact.group}" appears generic — should reference specific source data`
      );
    }
  }

  // 9. Verify key named entities from summary exist in source
  const namedEntities = summary.titleTh.match(/[A-Z][a-zA-Z]+/g) ?? [];
  for (const entity of namedEntities) {
    if (!sourceContent.includes(entity) && !sourceLower.includes(entity.toLowerCase())) {
      warnings.push(
        `Named entity "${entity}" in title not found in source content`
      );
    }
  }

  if (warnings.length > 0) {
    logger.warn("Summary verification warnings", {
      warnings,
      titleTh: summary.titleTh,
    });
  }

  // Allow up to 3 minor warnings; more than that suggests quality issues
  return {
    valid: warnings.length <= 3,
    warnings,
  };
}
