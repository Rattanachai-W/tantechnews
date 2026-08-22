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
  const staticEntries = [
    { path: "", priority: "1.0", lastmod: now },
    { path: "daily/", priority: "0.9", lastmod: now },
    { path: "archive/", priority: "0.8", lastmod: now },
    { path: "category/", priority: "0.8", lastmod: now },
    { path: "search/", priority: "0.7", lastmod: now },
    { path: "about-us/", priority: "0.6", lastmod: now },
    { path: "privacy/", priority: "0.5", lastmod: now },
    { path: "ai-policy/", priority: "0.5", lastmod: now },
    { path: "correction-policy/", priority: "0.5", lastmod: now },
    { path: "selection-criteria/", priority: "0.5", lastmod: now },
    { path: "rss.xml", priority: "0.5", lastmod: now }
  ];
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
