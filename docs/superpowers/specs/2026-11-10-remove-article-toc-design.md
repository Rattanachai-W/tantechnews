# Remove article table of contents

Date: 2026-11-10

## Goal

Remove the in-article สารบัญ block from every news article page. Short articles feel cluttered when a TOC sits between the hero and the body.

## Rules

- Remove the TOC `<nav>` from `ArticleLayout.astro` for all articles (no length threshold, no alternate UI)
- Remove the TOC click/scroll `<script>` that only serves that nav
- Remove TOC-only frontmatter helpers in the same file (`tocItems`, unused `headings` destructure, `getStableHeadingId` import) when they become unused
- Keep article `h2` headings and body content unchanged
- Do not delete `src/utils/heading-ids.ts` in this change unless nothing else imports it after the cleanup
