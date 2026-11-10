# Partner Card Teal Wash Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle partner article cards to Teal Wash: same layout as normal cards, brand teal border/body/badge, no solid orange header band.

**Architecture:** All partner presentation lives in `src/components/news/article-card.astro`. Swap `accent` partner classes for `brand` / `brand-light`, remove the partner-only solid header block, and always render the title under the image like non-partner cards. Partner detection stays in `isPartnerArticle`.

**Tech Stack:** Astro, Tailwind tokens (`brand`, `brand-light`, `brand-dark`), existing `article-card.astro`.

## Global Constraints

- Distinctiveness: strong (still obvious as partner)
- Color: brand teal only for partner chrome (`brand` / `brand-light`), not `accent`
- Layout: image on top, title below; remove solid partner header band
- Approach: Teal Wash (tinted body + teal border + filled partner badge)
- Change `src/components/news/article-card.astro` only
- Keep `isPartnerArticle` logic unchanged
- Do not remove `accent` tokens from `tailwind.config.mjs` unless unused elsewhere after this change
- No one-sided colored border accent bars
- No emoji in UI or commits

## File map

| File | Responsibility |
|------|----------------|
| `src/components/news/article-card.astro` | Partner vs normal card markup and Tailwind classes |
| `docs/superpowers/specs/2026-11-10-partner-card-teal-wash-design.md` | Approved design (read-only reference) |

---

### Task 1: Apply Teal Wash to partner cards

**Files:**
- Modify: `src/components/news/article-card.astro`
- Test: visual check on homepage/feed with a partner article; source grep for leftover partner `accent` classes

**Interfaces:**
- Consumes: `isPartnerArticle(article)` (unchanged), existing props `article`, `prominent`, `compact`
- Produces: partner cards with `data-partner="true"`, Teal Wash classes, title under image for both partner and non-partner

- [ ] **Step 1: Confirm current partner markers (baseline)**

Run from repo root:

```bash
rg -n "bg-accent|border-accent|text-accent|accent-light|shadow-accent" src/components/news/article-card.astro
```

Expected: matches on partner branches (header `bg-accent`, shell `border-accent bg-accent-light`, badge, category, footer).

- [ ] **Step 2: Replace partner shell and remove solid header**

In `src/components/news/article-card.astro`, update the `<article>` class list so partner uses brand teal:

```astro
<article
  class:list={[
    "flex flex-col overflow-hidden rounded-lg border shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
    isPartner
      ? "border-brand bg-brand-light shadow-brand/20"
      : "border-line bg-white",
    compact && "h-full"
  ]}
  itemscope
  itemtype="https://schema.org/NewsArticle"
  data-partner={isPartner ? "true" : undefined}
>
```

Delete the entire partner-only solid header block (the `isPartner ? (<a ... bg-accent ...>...<h2>...</h2></a>) : null` section). Do not leave an empty fragment.

- [ ] **Step 3: Soften image divider and body wash**

Image link border:

```astro
isPartner ? "border-b border-brand/30" : "border-b border-line"
```

Body wrapper:

```astro
isPartner && "bg-brand-light"
```

- [ ] **Step 4: Restyle partner badge, category, and always show title**

Partner badge:

```astro
<span class="rounded-md bg-brand px-2.5 py-1 text-white">พันธมิตร</span>
```

Category chip when partner:

```astro
isPartner
  ? "border border-brand/30 bg-white text-brand hover:bg-brand hover:text-white"
  : "bg-brand-light text-brand-dark hover:bg-brand hover:text-white"
```

Replace the `!isPartner && (<h2>...</h2>)` gate so the title always renders for partner and non-partner:

```astro
<h2
  class:list={[
    "mt-3 break-words font-bold leading-snug text-ink",
    compact ? "line-clamp-2 text-base" : prominent ? "mt-4 text-2xl sm:text-3xl" : "mt-4 text-xl"
  ]}
  itemprop="headline"
>
  <a href={getArticleHref(article)} itemprop="url">{article.data.title}</a>
</h2>
```

- [ ] **Step 5: Restyle partner footer**

```astro
isPartner ? "border-brand/30 text-brand" : "border-line text-muted"
```

Keep footer copy: `พันธมิตร · ${article.data.sourceName}` when partner.

- [ ] **Step 6: Verify no partner accent classes remain in the card**

```bash
rg -n "accent" src/components/news/article-card.astro
```

Expected: no matches (or only unrelated comments; there should be none).

Also confirm title is not gated:

```bash
rg -n "!isPartner" src/components/news/article-card.astro
```

Expected: no matches.

- [ ] **Step 7: Visual check in the running dev server**

Open a feed page that shows a partner article (homepage or category). Confirm:

1. No solid colored header band above the image
2. Title sits under the image in ink color
3. Card body has soft teal wash; border is teal
4. Badge “พันธมิตร” is filled brand teal
5. Footer source line is brand teal
6. Non-partner cards still look unchanged (white body, `border-line`)

- [ ] **Step 8: Commit**

```bash
git add src/components/news/article-card.astro
git commit -m "style: restyle partner cards with brand teal wash"
```

---

## Self-review

1. Spec coverage: Teal Wash, remove header band, title under image, brand tokens, single-file scope, keep `isPartnerArticle`, no one-sided border — all covered in Task 1.
2. Placeholder scan: none.
3. Consistency: classes use `brand` / `brand-light` / `brand-dark` throughout partner chrome.
