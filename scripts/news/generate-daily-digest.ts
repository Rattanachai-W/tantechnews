import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { getBangkokDateParts } from "../shared/date";

function getThaiTitleDate(date: Date): string {
  const titleFormatter = new Intl.DateTimeFormat("th-TH", {
    dateStyle: "long",
    timeZone: "Asia/Bangkok"
  });

  return titleFormatter.format(date);
}

export async function generateDailyDigest(slugs: string[], date = new Date()): Promise<string | null> {
  const uniqueSlugs = [...new Set(slugs)];
  if (uniqueSlugs.length === 0) return null;

  const { isoDate } = getBangkokDateParts(date);
  const titleDate = getThaiTitleDate(date);
  const filePath = join("src", "content", "daily", `${isoDate}.md`);
  const body = `---
title: "สรุปข่าวเทคประจำวันที่ ${titleDate}"
date: "${isoDate}"
articleSlugs:
${uniqueSlugs.map((slug) => `  - "${slug}"`).join("\n")}
draft: true
---
`;

  await mkdir(join("src", "content", "daily"), { recursive: true });
  await writeFile(filePath, body, "utf8");
  return filePath;
}
