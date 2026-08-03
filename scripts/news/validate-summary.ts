import { z } from "zod";
import { ARTICLE_CATEGORIES } from "../../src/types/article";

const nonEmptyTrimmed = z.string().trim().min(1);

export const articleSummarySchema = z.object({
  titleTh: nonEmptyTrimmed.max(200).refine(
    (val) => !/^[\s\S]*(?:according to|sources say|it is known)/i.test(val),
    { message: "titleTh should not contain meta-commentary" }
  ),
  excerpt: nonEmptyTrimmed.max(280),
  whatHappened: nonEmptyTrimmed.refine(
    (val) => !/(?:อาจ|น่าจะ|คาดว่า|เป็นไปได้ว่า|probably|likely|might)/i.test(val),
    { message: "whatHappened must contain only facts, no speculative language" }
  ),
  whyItMatters: nonEmptyTrimmed,
  impacts: z
    .array(
      z.object({
        group: z.enum([
          "developers",
          "businesses",
          "startups",
          "investors",
          "consumers",
          "society",
          "other",
        ]),
        title: nonEmptyTrimmed,
        description: nonEmptyTrimmed.min(30, {
          message: "Impact description must be substantive (>=30 chars), not generic",
        }),
      })
    )
    .min(1),
  tantechView: nonEmptyTrimmed.refine(
    (val) => val.startsWith("บทวิเคราะห์") || val.startsWith("มุมมอง"),
    { message: "tantechView must start with 'บทวิเคราะห์' or 'มุมมอง' to separate analysis from facts" }
  ),
  oneSentenceSummary: nonEmptyTrimmed.max(220),
  categories: z.array(z.enum(ARTICLE_CATEGORIES)).min(1).max(3),
  tags: z.array(nonEmptyTrimmed).max(10),
});
