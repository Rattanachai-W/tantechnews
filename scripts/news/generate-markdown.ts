import { access, mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { bangkokIsoNow, getBangkokDateParts } from "../shared/date";
import { calculateReadingTime } from "../content/calculate-reading-time";
import { slugify } from "../../src/utils/slug";
import type { ArticleSummary, ScoredArticle } from "../../src/types/article";

function escapeYaml(value: string): string {
  return value.replace(/"/g, '\\"');
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

async function createUniqueSlug(baseSlug: string, directory: string): Promise<string> {
  let slug = baseSlug;
  let suffix = 2;

  while (await fileExists(join(directory, `${slug}.md`))) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

export async function generateMarkdown(article: ScoredArticle, summary: ArticleSummary): Promise<{
  filePath: string;
  slug: string;
}> {
  const baseSlug = slugify(summary.titleTh || article.title).slice(0, 80) || article.id.slice(0, 12);
  const { year, month } = getBangkokDateParts();
  const directory = join("src", "content", "news", year, month);
  const slug = await createUniqueSlug(baseSlug, directory);
  const filePath = join(directory, `${slug}.md`);
  const articleBody = `## เกิดอะไรขึ้น

${summary.whatHappened}

## ทำไมเรื่องนี้สำคัญ

${summary.whyItMatters}

## ผลกระทบที่น่าจับตา

${summary.impacts
  .map(
    (impact) => `### ${renderImpactHeading(impact.group)}

${impact.title}: ${impact.description}`
  )
  .join("\n\n")}

## มุมมองของทันเทค

${summary.tantechView}

## สรุปในประโยคเดียว

> ${summary.oneSentenceSummary}

## แหล่งข่าว

[อ่านต้นฉบับ](${article.url})
`;

  const body = `---
title: "${escapeYaml(summary.titleTh)}"
slug: "${slug}"
excerpt: "${escapeYaml(summary.excerpt)}"
publishedAt: "${bangkokIsoNow()}"
sourcePublishedAt: "${article.publishedAt}"
sourceName: "${escapeYaml(article.sourceName)}"
sourceUrl: "${article.url}"
author: "TanTech AI Desk"
categories:
${summary.categories.map((category) => `  - ${category}`).join("\n")}
${summary.tags.length > 0 ? `tags:\n${summary.tags.map((tag) => `  - "${escapeYaml(tag)}"`).join("\n")}` : "tags: []"}
readingTimeMinutes: ${calculateReadingTime(articleBody)}
featured: false
draft: true
aiGenerated: true
reviewedBy: null
---

${articleBody}`;

  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, body, "utf8");
  return { filePath, slug };
}
