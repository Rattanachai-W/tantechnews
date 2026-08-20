import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import matter from "gray-matter";
import { z } from "zod";
import { ARTICLE_CATEGORIES } from "../../src/types/article";
import { logger } from "../shared/logger";

const newsSchema = z.object({
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().min(1),
  publishedAt: z.coerce.date(),
  sourcePublishedAt: z.coerce.date(),
  sourceName: z.string().min(1),
  sourceUrl: z.string().url(),
  imageUrl: z.string().url().optional(),
  categories: z.array(z.enum(ARTICLE_CATEGORIES)).min(1).max(3),
  readingTimeMinutes: z.number().int().positive(),
  draft: z.boolean(),
  aiGenerated: z.boolean()
});

const dailySchema = z.object({
  title: z.string().min(1),
  date: z.coerce.date(),
  articleSlugs: z.array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)),
  draft: z.boolean()
});

const baseSourceSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().min(1),
  url: z.string().url(),
  enabled: z.boolean(),
  tier: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  categories: z.array(z.enum(ARTICLE_CATEGORIES)).min(1).max(3),
  language: z.string().min(2)
});

const sourceSchema = z.discriminatedUnion("type", [
  baseSourceSchema.extend({
    type: z.literal("rss")
  }),
  baseSourceSchema.extend({
    type: z.literal("api"),
    method: z.literal("GET").optional(),
    headers: z.record(z.string()).optional(),
    mapping: z.object({
      itemsPath: z.string().optional(),
      title: z.string().min(1),
      url: z.string().min(1),
      publishedAt: z.string().min(1),
      description: z.string().min(1).optional(),
      author: z.string().min(1).optional(),
      imageUrl: z.string().min(1).optional()
    })
  })
]);

const sourceConfigSchema = z.object({
  sources: z.array(sourceSchema).min(1)
});

const blockedDomainsSchema = z.object({
  domains: z.array(z.string().trim().min(1).regex(/^[a-z0-9.-]+$/i))
});

const processedArticlesSchema = z.object({
  articles: z.array(
    z.object({
      id: z.string().regex(/^[a-f0-9]{64}$/),
      url: z.string().url(),
      slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
      sourceName: z.string().min(1),
      processedAt: z.coerce.date()
    })
  )
});

const forbiddenPatterns = [
  /utm_source=chatgpt\.com/i,
  /```json/i,
  /system prompt/i,
  /structured output/i,
  /รอการสรุป/i,
  /รอการตรวจทาน/i,
  /placeholder/i
];

const REQUIRED_NEWS_HEADINGS = [
  "เกิดอะไรขึ้น",
  "ทำไมเรื่องนี้สำคัญ",
  "ผลกระทบที่น่าจับตา",
  "มุมมองของทันเทค",
  "สรุปในประโยคเดียว",
  "แหล่งข่าว"
];

async function listMarkdownFiles(dir: string): Promise<string[]> {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
      entries.map((entry) => {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) return listMarkdownFiles(path);
        return Promise.resolve(entry.isFile() && entry.name.endsWith(".md") ? [path] : []);
      })
    );
    return files.flat();
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

function getMarkdownHeadings(content: string): Array<{ depth: number; text: string; index: number }> {
  return [...content.matchAll(/^(#{2,3})\s+(.+?)\s*$/gm)].map((match) => ({
    depth: match[1]?.length ?? 0,
    text: match[2]?.trim() ?? "",
    index: match.index ?? 0
  }));
}

export function validateNewsMarkdownStructure(content: string, sourceUrl: string): string[] {
  const errors: string[] = [];
  const headings = getMarkdownHeadings(content);
  const headingTexts = new Set(headings.map((heading) => heading.text));

  for (const heading of REQUIRED_NEWS_HEADINGS) {
    if (!headingTexts.has(heading)) {
      errors.push(`missing required heading: ${heading}`);
    }
  }

  for (const heading of headings.filter((item) => item.depth === 2)) {
    const nextHeading = headings.find((candidate) => candidate.index > heading.index && candidate.depth === 2);
    const section = content.slice(
      heading.index + `## ${heading.text}`.length,
      nextHeading?.index ?? content.length
    );

    if (!section.replace(/^#+\s+.+$/gm, "").trim()) {
      errors.push(`heading has no body content: ${heading.text}`);
    }
  }

  if (!content.includes(`[อ่านต้นฉบับ](${sourceUrl})`)) {
    errors.push("source link does not match frontmatter sourceUrl");
  }

  return errors;
}

interface NewsValidationResult {
  errors: string[];
  slug: string | null;
  draft: boolean | null;
}

async function validateNewsFile(path: string, seenSlugs: Set<string>): Promise<NewsValidationResult> {
  const errors: string[] = [];
  const raw = await readFile(path, "utf8");
  const parsed = matter(raw);
  const result = newsSchema.safeParse(parsed.data);

  if (!result.success) {
    errors.push(`${path}: invalid frontmatter ${result.error.message}`);
    return { errors, slug: null, draft: null };
  }

  const { draft, slug, sourceUrl } = result.data;
  if (seenSlugs.has(slug)) {
    errors.push(`${path}: duplicate slug ${slug}`);
  }
  seenSlugs.add(slug);

  if (sourceUrl.includes("utm_")) {
    errors.push(`${path}: sourceUrl contains tracking parameters`);
  }

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(raw)) {
      errors.push(`${path}: forbidden placeholder or prompt artifact matched ${pattern}`);
    }
  }

  if (/^#+\s*$/m.test(parsed.content)) {
    errors.push(`${path}: contains an empty heading`);
  }

  for (const error of validateNewsMarkdownStructure(parsed.content, sourceUrl)) {
    errors.push(`${path}: ${error}`);
  }

  return { errors, slug, draft };
}

export function validateDailyReferences(
  articleSlugs: string[],
  isDraft: boolean,
  newsDraftBySlug: Map<string, boolean>
): string[] {
  const errors: string[] = [];
  const duplicateSlugs = articleSlugs.filter(
    (slug, index, slugs) => slugs.indexOf(slug) !== index
  );

  for (const slug of [...new Set(duplicateSlugs)]) {
    errors.push(`duplicate article slug ${slug}`);
  }

  for (const slug of articleSlugs) {
    const articleIsDraft = newsDraftBySlug.get(slug);

    if (articleIsDraft === undefined) {
      errors.push(`referenced article slug does not exist: ${slug}`);
      continue;
    }

    if (!isDraft && articleIsDraft) {
      errors.push(`published digest references draft article slug: ${slug}`);
    }
  }

  return errors;
}

async function validateDailyFile(path: string, newsDraftBySlug: Map<string, boolean>): Promise<string[]> {
  const errors: string[] = [];
  const raw = await readFile(path, "utf8");
  const parsed = matter(raw);
  const result = dailySchema.safeParse(parsed.data);

  if (!result.success) {
    errors.push(`${path}: invalid frontmatter ${result.error.message}`);
    return errors;
  }

  const expectedDate = path.match(/(\d{4}-\d{2}-\d{2})\.md$/)?.[1];
  const actualDate = result.data.date.toISOString().slice(0, 10);
  if (expectedDate && expectedDate !== actualDate) {
    errors.push(`${path}: filename date ${expectedDate} does not match frontmatter date ${actualDate}`);
  }

  errors.push(
    ...validateDailyReferences(result.data.articleSlugs, result.data.draft, newsDraftBySlug).map(
      (error) => `${path}: ${error}`
    )
  );

  return errors;
}

async function validateSources(path = join("data", "sources.json")): Promise<string[]> {
  const errors: string[] = [];
  const raw = await readFile(path, "utf8");
  const result = sourceConfigSchema.safeParse(JSON.parse(raw));

  if (!result.success) {
    return [`${path}: invalid source config ${result.error.message}`];
  }

  const seenIds = new Set<string>();
  const seenUrls = new Set<string>();
  for (const source of result.data.sources) {
    if (seenIds.has(source.id)) {
      errors.push(`${path}: duplicate source id ${source.id}`);
    }
    seenIds.add(source.id);

    if (seenUrls.has(source.url)) {
      errors.push(`${path}: duplicate source url ${source.url}`);
    }
    seenUrls.add(source.url);
  }

  return errors;
}

async function validateBlockedDomains(path = join("data", "blocked-domains.json")): Promise<string[]> {
  const raw = await readFile(path, "utf8");
  const result = blockedDomainsSchema.safeParse(JSON.parse(raw));
  if (!result.success) {
    return [`${path}: invalid blocked domains config ${result.error.message}`];
  }

  const normalized = result.data.domains.map((domain) => domain.toLowerCase());
  const duplicates = normalized.filter((domain, index) => normalized.indexOf(domain) !== index);
  return [...new Set(duplicates)].map((domain) => `${path}: duplicate blocked domain ${domain}`);
}

async function validateProcessedArticles(path = join("data", "processed-articles.json")): Promise<string[]> {
  const raw = await readFile(path, "utf8");
  const result = processedArticlesSchema.safeParse(JSON.parse(raw));
  if (!result.success) {
    return [`${path}: invalid processed articles state ${result.error.message}`];
  }

  const seenIds = new Set<string>();
  const errors: string[] = [];
  for (const article of result.data.articles) {
    if (seenIds.has(article.id)) {
      errors.push(`${path}: duplicate processed article id ${article.id}`);
    }
    seenIds.add(article.id);
  }

  return errors;
}

export function validateProcessedArticleReferences(
  processedSlugs: string[],
  newsSlugs: Set<string>
): string[] {
  return processedSlugs
    .filter((slug) => !newsSlugs.has(slug))
    .map((slug) => `processed article slug does not exist in news content: ${slug}`);
}

async function validateProcessedArticleFileReferences(
  newsSlugs: Set<string>,
  path = join("data", "processed-articles.json")
): Promise<string[]> {
  const raw = await readFile(path, "utf8");
  const result = processedArticlesSchema.safeParse(JSON.parse(raw));
  if (!result.success) {
    return [];
  }

  return validateProcessedArticleReferences(
    result.data.articles.map((article) => article.slug),
    newsSlugs
  ).map((error) => `${path}: ${error}`);
}

async function main(): Promise<void> {
  const files = await listMarkdownFiles(join("src", "content", "news"));
  const dailyFiles = await listMarkdownFiles(join("src", "content", "daily"));
  const seenSlugs = new Set<string>();
  const newsResults = await Promise.all(files.map((file) => validateNewsFile(file, seenSlugs)));
  const newsDraftBySlug = new Map(
    newsResults.flatMap((result) =>
      result.slug && result.draft !== null ? [[result.slug, result.draft] as const] : []
    )
  );
  const newsSlugs = new Set(newsDraftBySlug.keys());
  const dailyErrorGroups = await Promise.all(
    dailyFiles.map((file) => validateDailyFile(file, newsDraftBySlug))
  );
  const sourceErrors = await validateSources();
  const blockedDomainErrors = await validateBlockedDomains();
  const processedArticleErrors = await validateProcessedArticles();
  const processedArticleReferenceErrors = await validateProcessedArticleFileReferences(newsSlugs);
  const errors = [
    ...newsResults.flatMap((result) => result.errors),
    ...dailyErrorGroups.flat(),
    ...sourceErrors,
    ...blockedDomainErrors,
    ...processedArticleErrors,
    ...processedArticleReferenceErrors
  ];

  if (errors.length > 0) {
    for (const error of errors) {
      logger.error("Content validation error", { error });
    }
    process.exitCode = 1;
    return;
  }

  logger.info("Content validation passed", { newsFiles: files.length, dailyFiles: dailyFiles.length });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    logger.error("Content validation failed unexpectedly", {
      error: error instanceof Error ? error.message : String(error)
    });
    process.exitCode = 1;
  });
}
