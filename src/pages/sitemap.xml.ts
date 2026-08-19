import type { APIRoute } from "astro";
import { ARTICLE_CATEGORIES } from "../types/article";
import {
  getArticleHref,
  getDailyHref,
  getPublishedDailyDigests,
  getPublishedNews
} from "../utils/content";

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site ?? new URL("https://tantechnews.com");
  const articles = await getPublishedNews();
  const digests = await getPublishedDailyDigests();
  const now = new Date().toISOString().slice(0, 10);
  const staticPaths = ["", "daily/", "archive/", "category/", "search/", "about/", "rss.xml"];
  // Build entries with lastmod and priority for better crawl efficiency.
  const staticEntries = staticPaths.map((p) => ({ path: p, priority: "1.0", lastmod: now }));
  const categoryEntries = ARTICLE_CATEGORIES.map((category) => ({
    path: `category/${category.toLowerCase().replace(/\s+/g, "-")}/`,
    priority: "0.7",
    lastmod: now
  }));
  const dailyEntries = digests.map((digest) => ({
    path: getDailyHref(digest).slice(1),
    priority: "0.8",
    lastmod: now
  }));
  const articleEntries = articles.map((article) => ({
    path: getArticleHref(article).slice(1),
    priority: "0.9",
    lastmod: article.data.publishedAt.toISOString().slice(0, 10)
  }));
  const entries = [...staticEntries, ...categoryEntries, ...dailyEntries, ...articleEntries];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    ({ path, priority, lastmod }) =>
      `  <url><loc>${new URL(path, baseUrl).href}</loc><lastmod>${lastmod}</lastmod><priority>${priority}</priority></url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(body, {
    headers: {
      "content-type": "application/xml; charset=utf-8"
    }
  });
};
