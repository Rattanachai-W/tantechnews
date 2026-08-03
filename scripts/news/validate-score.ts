import { z } from "zod";
import { ARTICLE_CATEGORIES } from "../../src/types/article";

const scoreValueSchema = z.number().int().min(1).max(10);

export const articleScoreSchema = z.object({
  importance: scoreValueSchema,
  relevance: scoreValueSchema,
  novelty: scoreValueSchema,
  credibility: scoreValueSchema,
  totalScore: z.number().min(1).max(10),
  category: z.enum(ARTICLE_CATEGORIES),
  reason: z.string().trim().min(1).max(500)
});

export const aiScoredArticleSchema = z.object({
  id: z.string().min(1),
  score: articleScoreSchema
});

export const aiScoringResponseSchema = z.object({
  articles: z.array(aiScoredArticleSchema)
});
