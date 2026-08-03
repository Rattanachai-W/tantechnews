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
  const staticPaths = ["", "daily/", "archive/", "category/", "search/", "rss.xml"];
  const categoryPaths = ARTICLE_CATEGORIES.map(
    (category) => `category/${category.toLowerCase().replace(/\s+/g, "-")}/`
  );
  const articlePaths = articles.map((article) => getArticleHref(article).slice(1));
  const dailyPaths = digests.map((digest) => getDailyHref(digest).slice(1));
  const paths = [...staticPaths, ...categoryPaths, ...dailyPaths, ...articlePaths];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map((path) => `  <url><loc>${new URL(path, baseUrl).href}</loc></url>`)
  .join("\n")}
</urlset>`;

  return new Response(body, {
    headers: {
      "content-type": "application/xml; charset=utf-8"
    }
  });
};
