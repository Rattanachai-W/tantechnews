import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getArticleHref, getPublishedNews } from "../utils/content";

export async function GET(context: APIContext) {
  const articles = await getPublishedNews();

  return rss({
    title: "TanTech News",
    description: "สรุปข่าวเทคสำคัญ ให้คุณทันทุกวัน",
    site: context.site ?? "https://tantechnews.com",
    items: articles.map((article) => ({
      title: article.data.title,
      description: article.data.excerpt,
      pubDate: article.data.publishedAt,
      link: getArticleHref(article),
      categories: article.data.categories
    }))
  });
}
