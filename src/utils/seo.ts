import type { NewsEntry } from "./content";

const SITE_NAME = "TanTech News";
const SITE_URL = "https://tantechnews.com";
const DEFAULT_DESCRIPTION = "สรุปข่าวเทคสำคัญ ให้คุณทันทุกวัน";
const DEFAULT_IMAGE = `${SITE_URL}/og-default.svg`;

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
    logo: `${SITE_URL}/logo.svg`
  };
}

export function getArticleJsonLd(article: NewsEntry, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.data.title,
    description: article.data.excerpt,
    url,
    mainEntityOfPage: url,
    datePublished: article.data.publishedAt.toISOString(),
    dateModified: article.data.publishedAt.toISOString(),
    author: {
      "@type": "Organization",
      name: article.data.author ?? "TanTech AI Desk"
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.svg`
      }
    },
    image: DEFAULT_IMAGE,
    articleSection: article.data.categories,
    keywords: article.data.tags.join(", "),
    inLanguage: "th-TH",
    isAccessibleForFree: true,
    citation: article.data.sourceUrl
  };
}

export const seoDefaults = {
  siteName: SITE_NAME,
  defaultDescription: DEFAULT_DESCRIPTION,
  defaultImage: DEFAULT_IMAGE
};
