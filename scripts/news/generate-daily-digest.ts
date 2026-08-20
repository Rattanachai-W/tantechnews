import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";
import { getBangkokDateParts } from "../shared/date";

function getThaiTitleDate(date: Date): string {
  const titleFormatter = new Intl.DateTimeFormat("th-TH", {
    dateStyle: "long",
    timeZone: "Asia/Bangkok"
  });

  return titleFormatter.format(date);
}

export async function generateDailyDigest(slugs: string[], date = new Date()): Promise<string | null> {
  const { isoDate } = getBangkokDateParts(date);
  const filePath = join("src", "content", "daily", `${isoDate}.md`);

  let existingSlugs: string[] = [];
  try {
    const rawContent = await readFile(filePath, "utf8");
    const parsed = matter(rawContent);
    if (Array.isArray(parsed.data?.articleSlugs)) {
      existingSlugs = parsed.data.articleSlugs.filter((s): s is string => typeof s === "string");
    }
  } catch {
    // File does not exist yet; will create a new one below
  }

  const combinedSlugs = [...new Set([...existingSlugs, ...slugs])];
  if (combinedSlugs.length === 0) return null;

  const titleDate = getThaiTitleDate(date);
  const body = `---
title: "สรุปข่าวเทคประจำวันที่ ${titleDate}"
date: "${isoDate}"
articleSlugs:
${combinedSlugs.map((slug) => `  - "${slug}"`).join("\n")}
draft: false
---
`;

  await mkdir(join("src", "content", "daily"), { recursive: true });
  await writeFile(filePath, body, "utf8");
  return filePath;
}

