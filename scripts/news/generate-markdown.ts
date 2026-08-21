import { access, mkdir, readdir, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { getBangkokDateParts } from "../shared/date";
import { calculateReadingTime } from "../content/calculate-reading-time";
import { slugify } from "../../src/utils/slug";
import type { ArticleSummary, ScoredArticle } from "../../src/types/article";

function escapeYaml(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, " ")
    .replace(/"/g, '\\"');
}

function renderImpactHeading(group: ArticleSummary["impacts"][number]["group"]): string {
  const labels = {
    developers: "สำหรับนักพัฒนา",
    businesses: "สำหรับธุรกิจ",
    startups: "สำหรับสตาร์ทอัพ",
    investors: "สำหรับนักลงทุน",
    consumers: "สำหรับผู้ใช้งาน",
    society: "สำหรับสังคม",
    other: "สำหรับผู้อ่าน"
  };

  return labels[group];
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function isSlugTaken(slug: string): Promise<boolean> {
  const newsRoot = join("src", "content", "news");
  try {
    const years = await readdir(newsRoot);
    for (const year of years) {
      const yearDir = join(newsRoot, year);
      const yearStat = await stat(yearDir).catch(() => null);
      if (!yearStat?.isDirectory()) continue;

      const months = await readdir(yearDir);
      for (const month of months) {
        const filePath = join(yearDir, month, `${slug}.md`);
        if (await fileExists(filePath)) return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}

async function createUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let suffix = 2;

  while (await isSlugTaken(slug)) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

export async function generateMarkdown(
  article: ScoredArticle,
  summary: ArticleSummary,
  targetDate?: Date,
  options?: { isDraft?: boolean }
): Promise<{
  filePath: string;
  slug: string;
}> {
  const isThaiTitle = /[\u0E00-\u0E7F]/.test(summary.titleTh);
  const isDraft = options?.isDraft ?? !isThaiTitle;
  const baseSlug = (slugify(summary.titleTh || article.title).slice(0, 60).replace(/-+$/, "")) || article.id.slice(0, 12);
  const articleDate = targetDate ?? new Date();
  const { year, month } = getBangkokDateParts(isNaN(articleDate.getTime()) ? new Date() : articleDate);
  const directory = join("src", "content", "news", year, month);
  const slug = await createUniqueSlug(baseSlug);
  const filePath = join(directory, `${slug}.md`);
  const articleBody = `## เกิดอะไรขึ้น

${summary.whatHappened}

## ทำไมเรื่องนี้สำคัญ

${summary.whyItMatters}

## ผลกระทบที่น่าจับตา

${summary.impacts
  .map(
    (impact) => `- **${renderImpactHeading(impact.group)}:** ${impact.description.startsWith(impact.title) ? impact.description : `${impact.title}: ${impact.description}`}`
  )
  .join("\n\n")}

## มุมมองของทันเทค

${summary.tantechView}

## สรุปในประโยคเดียว

> ${summary.oneSentenceSummary}

## แหล่งข่าว

[อ่านต้นฉบับ](${article.url})
`;

  const publishedIso = new Date(articleDate.getTime() + 7 * 60 * 60 * 1000).toISOString().replace("Z", "+07:00");
  const body = `---
title: "${escapeYaml(summary.titleTh)}"
slug: "${slug}"
excerpt: "${escapeYaml(summary.excerpt)}"
publishedAt: "${publishedIso}"
sourcePublishedAt: "${article.publishedAt}"
sourceName: "${escapeYaml(article.sourceName)}"
sourceUrl: "${article.url}"
${article.imageUrl ? `imageUrl: "${article.imageUrl}"` : ""}
author: "TanTech AI Desk"
categories:
${summary.categories.map((category) => `  - ${category}`).join("\n")}
${summary.tags.length > 0 ? `tags:\n${summary.tags.map((tag) => `  - "${escapeYaml(tag)}"`).join("\n")}` : "tags: []"}
readingTimeMinutes: ${calculateReadingTime(articleBody)}
featured: false
draft: ${isDraft}
aiGenerated: true
reviewedBy: "TanTech Editorial Desk"
---

${articleBody}`;

  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, body, "utf8");
  return { filePath, slug };
}
