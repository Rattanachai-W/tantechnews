import { readFile } from "node:fs/promises";
import { hoursAgo, isWithinWindow } from "../shared/date";
import type { RawArticle } from "../../src/types/article";

const BLOCKED_TITLE_PATTERNS = [
  /sponsored/i,
  /advertorial/i,
  /deal of the day/i,
  // Non-tech content filters
  /\bmusic\b.*\b(review|album|song|band|festival)\b/i,
  /\b(game|gaming)\b.*\b(review|trailer|release)\b/i,
  /\b(movie|film|tv|television)\b.*\b(review|trailer)\b/i,
  /\b(recipe|cooking|food)\b.*\b(review|best)\b/i,
  /\bsports?\b.*\b(team|player|game|match)\b/i,
  /\b(opinion|editorial|column)\b/i,
  /\b(interview|q&a|qa)\b.*\b(with|:)\b/i,
];

interface BlockedDomainsConfig {
  domains: string[];
}

export async function loadBlockedDomains(path = "data/blocked-domains.json"): Promise<Set<string>> {
  try {
    const raw = await readFile(path, "utf8");
    const parsed = JSON.parse(raw) as Partial<BlockedDomainsConfig>;
    return new Set((parsed.domains ?? []).map((domain) => domain.toLowerCase()));
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return new Set();
    }

    throw error;
  }
}

function getHostname(url: string): string | null {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}

function isBlockedHost(hostname: string, blockedDomains: Set<string>): boolean {
  return [...blockedDomains].some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
}

export function filterArticles(
  articles: RawArticle[],
  windowHours = 48,
  blockedDomains: Set<string> = new Set()
): RawArticle[] {
  const since = hoursAgo(windowHours);

  return articles.filter((article) => {
    if (!article.url || !article.title) return false;
    const hostname = getHostname(article.url);
    if (!hostname || isBlockedHost(hostname, blockedDomains)) return false;
    if (!isWithinWindow(article.publishedAt, since)) return false;
    return !BLOCKED_TITLE_PATTERNS.some((pattern) => pattern.test(article.title));
  });
}
