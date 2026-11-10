# Related news on article detail

Date: 2026-11-10

## Goal

Recommend up to 6 related articles on news detail pages to keep readers browsing.

## Placement

After article body, before “ที่มาและเอกสารอ้างอิง”.

## Selection (priority order)

1. Shared tags (more overlap first, then newer)
2. Shared categories (if still short)
3. Latest site-wide articles (fill remaining)

Exclude the current article. Show fewer than 6 if the corpus is small.

## UI

- Heading: ข่าวแนะนำ
- Horizontal scroll of existing `ArticleCard` components with snap
- Mobile and desktop use the same carousel pattern
