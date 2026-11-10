# Partner card Teal Wash

Date: 2026-11-10

## Goal

Modernize partner article cards so they stay clearly distinct from normal news, without the dated solid orange header band and cream body.

## Decisions

- Distinctiveness: strong (still obvious as partner)
- Color: brand teal (`brand` / `brand-light`), not accent orange
- Layout: same as normal cards (image on top, title below); remove solid partner header band
- Visual approach: **Teal Wash** (tinted body + teal border + filled partner badge)

## Visual rules

- Card shell: `border-brand`, body background `brand-light` (or equivalent soft teal wash such as near `#f0fdfa`), soft teal-tinted hover shadow
- Partner badge: filled `brand` with white text
- Category chip on partner cards: white fill, `brand` text/border
- Footer source line: `brand` text; divider uses soft teal
- Title uses normal ink typography under the image (same hierarchy as non-partner cards)
- No one-sided colored border accent bars

## Scope

- Change `src/components/news/article-card.astro` only
- Keep `isPartnerArticle` logic unchanged
- Do not remove `accent` tokens from `tailwind.config.mjs` unless unused elsewhere after this change
- Verify visually on a feed page that includes a partner article

## Out of scope

- Partner detection / source ranking
- Homepage carousel or other surfaces that are not `article-card`
- Redesigning non-partner cards
