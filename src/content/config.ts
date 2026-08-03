import { defineCollection, z } from "astro:content";
import { ARTICLE_CATEGORIES } from "../types/article";

const categorySchema = z.enum(ARTICLE_CATEGORIES);

const news = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string().min(1),
    excerpt: z.string().min(1),
    publishedAt: z.coerce.date(),
    sourcePublishedAt: z.coerce.date(),
    sourceName: z.string().min(1),
    sourceUrl: z.string().url(),
    author: z.string().optional(),
    categories: z.array(categorySchema).min(1).max(3),
    tags: z.array(z.string()).default([]),
    readingTimeMinutes: z.number().int().positive(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(true),
    aiGenerated: z.boolean(),
    reviewedBy: z.string().nullable().optional()
  })
});

const daily = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string().min(1),
    date: z.coerce.date(),
    articleSlugs: z.array(z.string()).default([]),
    draft: z.boolean().default(true)
  })
});

export const collections = {
  news,
  daily
};
