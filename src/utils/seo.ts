import type { NewsEntry } from "./content";

const SITE_NAME = "TanTech News";
const SITE_URL = "https://tantechnews.com";
const DEFAULT_DESCRIPTION = "สรุปข่าวเทคสำคัญ ให้คุณทันทุกวัน";
const DEFAULT_IMAGE = `${SITE_URL}/og-default.jpg`;

export function getSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: "ทันเทค",
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    inLanguage: "th-TH",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search/?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

export function getOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    alternateName: "ทันเทค",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.svg`,
      width: "512",
      height: "512"
    },
    sameAs: [`${SITE_URL}/rss.xml`]
  };
}

export function getArticleJsonLd(article: NewsEntry, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.data.title,
    description: article.data.excerpt,
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url
    },
    datePublished: article.data.publishedAt.toISOString(),
    dateModified: article.data.publishedAt.toISOString(),
    author: {
      "@type": "Organization",
      name: article.data.author ?? "TanTech AI Desk",
      url: SITE_URL
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.svg`
      }
    },
    image: article.data.imageUrl ?? DEFAULT_IMAGE,
    articleSection: article.data.categories,
    keywords: article.data.tags.join(", "),
    inLanguage: "th-TH",
    isAccessibleForFree: true,
    citation: article.data.sourceUrl,
    about: article.data.categories.map((category: string) => ({
      "@type": "Thing",
      name: category
    })),
    wordCount: article.data.readingTimeMinutes * 250,
    timeRequired: `PT${article.data.readingTimeMinutes}M`
  };
}

export function getBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

export function getCategoryJsonLd(category: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `ข่าวหมวด ${category}`,
    description: `รวมข่าวเทคโนโลยีหมวด ${category} จากแหล่งข่าวที่ตรวจสอบย้อนกลับได้`,
    url,
    inLanguage: "th-TH",
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL
    }
  };
}

export function getArchiveJsonLd(url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "คลังข่าวย้อนหลัง",
    description: "คลังข่าวเทคโนโลยีทั้งหมดของ TanTech News",
    url,
    inLanguage: "th-TH",
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL
    }
  };
}

export function getDailyDigestJsonLd(
  title: string,
  date: string,
  url: string,
  articleCount: number
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    description: `สรุปข่าวเทคประจำวัน ${date}`,
    url,
    numberOfItems: articleCount,
    inLanguage: "th-TH",
    itemListOrder: "https://schema.org/ItemListUnordered"
  };
}

export const seoDefaults = {
  siteName: SITE_NAME,
  defaultDescription: DEFAULT_DESCRIPTION,
  defaultImage: DEFAULT_IMAGE,
  siteUrl: SITE_URL
};
