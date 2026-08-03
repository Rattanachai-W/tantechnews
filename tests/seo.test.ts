import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getArticleJsonLd, getOrganizationJsonLd, getSiteJsonLd } from "../src/utils/seo";
import { shouldIncludeDraftContent } from "../src/utils/drafts";
import type { NewsEntry } from "../src/utils/content";

const article = {
  slug: "openai-api",
  collection: "news",
  id: "openai-api.md",
  body: "",
  data: {
    title: "OpenAI เปิดตัว API ใหม่",
    excerpt: "สรุปข่าว API ใหม่",
    publishedAt: new Date("2026-08-01T00:00:00Z"),
    sourceUrl: "https://example.com/openai-api",
    categories: ["AI", "Programming"],
    tags: ["OpenAI", "API"],
    author: "TanTech AI Desk"
  }
} as unknown as NewsEntry;

describe("SEO structured data", () => {
  it("builds WebSite JSON-LD with SearchAction", () => {
    const jsonLd = getSiteJsonLd();

    assert.equal(jsonLd["@type"], "WebSite");
    assert.equal(jsonLd.inLanguage, "th-TH");
    assert.equal(jsonLd.potentialAction["@type"], "SearchAction");
  });

  it("builds Organization JSON-LD with logo", () => {
    const jsonLd = getOrganizationJsonLd();

    assert.equal(jsonLd["@type"], "Organization");
    assert.equal(typeof jsonLd.logo, "object");
    assert.match(jsonLd.logo.url, /\/logo\.svg$/);
  });

  it("builds NewsArticle JSON-LD from article metadata", () => {
    const jsonLd = getArticleJsonLd(article, "https://tantechnews.com/news/openai-api/");

    assert.equal(jsonLd["@type"], "NewsArticle");
    assert.equal(jsonLd.headline, "OpenAI เปิดตัว API ใหม่");
    assert.equal(jsonLd.citation, "https://example.com/openai-api");
    assert.deepEqual(jsonLd.articleSection, ["AI", "Programming"]);
    assert.equal(jsonLd.isAccessibleForFree, true);
  });
});

describe("draft preview mode", () => {
  it("is disabled by default", () => {
    assert.equal(shouldIncludeDraftContent({}), false);
  });

  it("is enabled only by the explicit review environment flag", () => {
    assert.equal(shouldIncludeDraftContent({ TANTECH_INCLUDE_DRAFTS: "true" }), true);
    assert.equal(shouldIncludeDraftContent({ TANTECH_INCLUDE_DRAFTS: "1" }), false);
  });
});
