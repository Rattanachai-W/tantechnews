import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";
import { logger } from "../shared/logger";
import { mapWithConcurrency } from "../shared/concurrency";
import { extractCoverImage } from "./extract-article";

const NEWS_ROOT = "src/content/news";
const CONCURRENCY = 3;

async function listMarkdownFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listMarkdownFiles(fullPath)));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

function insertImageUrl(raw: string, imageUrl: string): string {
  if (/^imageUrl:/m.test(raw)) {
    return raw.replace(/^imageUrl:.*$/m, `imageUrl: "${imageUrl}"`);
  }

  if (/^sourceUrl:.*$/m.test(raw)) {
    return raw.replace(/^(sourceUrl:.*)$/m, `$1\nimageUrl: "${imageUrl}"`);
  }

  return raw.replace(/^---\n/, `---\nimageUrl: "${imageUrl}"\n`);
}

async function main(): Promise<void> {
  const files = await listMarkdownFiles(NEWS_ROOT);
  const missing: Array<{ path: string; sourceUrl: string }> = [];

  for (const filePath of files) {
    const raw = await readFile(filePath, "utf8");
    const parsed = matter(raw);
    const imageUrl = parsed.data.imageUrl;
    const sourceUrl = parsed.data.sourceUrl;

    if ((!imageUrl || typeof imageUrl !== "string") && typeof sourceUrl === "string" && sourceUrl.startsWith("http")) {
      missing.push({ path: filePath, sourceUrl });
    }
  }

  logger.info("Articles missing imageUrl", { count: missing.length });

  let repaired = 0;
  let failed = 0;

  await mapWithConcurrency(missing, CONCURRENCY, async (item) => {
    const imageUrl = await extractCoverImage(item.sourceUrl);
    if (!imageUrl) {
      failed += 1;
      logger.warn("No cover image found", { filePath: item.path, sourceUrl: item.sourceUrl });
      return;
    }

    const raw = await readFile(item.path, "utf8");
    await writeFile(item.path, insertImageUrl(raw, imageUrl), "utf8");
    repaired += 1;
    logger.info("Repaired imageUrl", { filePath: item.path, imageUrl });
  });

  logger.info("Image repair completed", { repaired, failed, scanned: missing.length });
}

main().catch((error) => {
  logger.error("Image repair failed", {
    error: error instanceof Error ? error.message : String(error)
  });
  process.exitCode = 1;
});
