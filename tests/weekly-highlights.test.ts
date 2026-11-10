import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { NewsEntry } from "../src/utils/content";
import {
  getIsoWeekSeed,
  getWeeklyHighlightArticles,
  seededShuffle
} from "../src/utils/weekly-highlights";

function makeArticle(id: string, publishedAt: string): NewsEntry {
  return {
    id: `${id}.md`,
    slug: id,
    collection: "news",
    body: "",
    data: {
      title: id,
      excerpt: id,
      publishedAt: new Date(publishedAt),
      sourcePublishedAt: new Date(publishedAt),
      sourceUrl: `https://example.com/${id}`,
      sourceName: "Example",
      categories: ["AI"],
      tags: [],
      readingTimeMinutes: 2,
      draft: false,
      references: []
    }
  } as unknown as NewsEntry;
}

describe("weekly highlights", () => {
  it("keeps seeded shuffle stable for the same seed", () => {
    const items = [1, 2, 3, 4, 5, 6];
    assert.deepEqual(seededShuffle(items, "2026-W46"), seededShuffle(items, "2026-W46"));
    assert.notDeepEqual(seededShuffle(items, "2026-W46"), seededShuffle(items, "2026-W47"));
  });

  it("picks week-stable highlights from the last 7 days", () => {
    const now = new Date("2026-11-10T12:00:00Z");
    const articles = [
      makeArticle("a", "2026-11-10T01:00:00Z"),
      makeArticle("b", "2026-11-09T01:00:00Z"),
      makeArticle("c", "2026-11-08T01:00:00Z"),
      makeArticle("d", "2026-11-07T01:00:00Z"),
      makeArticle("e", "2026-11-06T01:00:00Z"),
      makeArticle("old", "2026-10-01T01:00:00Z")
    ];

    const first = getWeeklyHighlightArticles(articles, 5, now);
    const second = getWeeklyHighlightArticles(articles, 5, now);

    assert.equal(first.length, 5);
    assert.deepEqual(
      first.map((article) => article.slug),
      second.map((article) => article.slug)
    );
    const cutoff = now.getTime() - 7 * 24 * 60 * 60 * 1000;
    assert.ok(first.every((article) => article.data.publishedAt.getTime() >= cutoff));
    assert.match(getIsoWeekSeed(now), /^2026-W\d{2}$/);
  });
});
