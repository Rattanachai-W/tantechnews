import { z } from "zod";
import { ARTICLE_CATEGORIES } from "../../src/types/article";

export const articleSummarySchema = z.object({
  titleTh: z.string().trim().min(1),
  excerpt: z.string().trim().min(1).max(280),
  whatHappened: z.string().trim().min(1),
  whyItMatters: z.string().trim().min(1),
  impacts: z.array(
    z.object({
      group: z.enum(["developers", "businesses", "startups", "investors", "consumers", "society", "other"]),
      title: z.string().trim().min(1),
      description: z.string().trim().min(1)
    })
  ).min(1),
  tantechView: z.string().trim().min(1),
  oneSentenceSummary: z.string().trim().min(1).max(220),
  categories: z.array(z.enum(ARTICLE_CATEGORIES)).min(1).max(3),
  tags: z.array(z.string().trim().min(1)).max(10)
});
