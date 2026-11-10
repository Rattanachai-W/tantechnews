# Remove Article TOC Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the in-article สารบัญ block and its supporting script/helpers from every news article page.

**Architecture:** One-file cleanup in `ArticleLayout.astro`. Drop TOC markup, the click/scroll script, and TOC-only locals/imports. Keep rehype heading IDs and `heading-ids.ts` because the markdown pipeline still uses them.

**Tech Stack:** Astro layout, existing Tailwind utility classes, no new dependencies.

## Global Constraints

- Remove TOC for all articles (no length threshold, no alternate UI)
- Keep article `h2` headings and body content unchanged
- Do not delete `src/utils/heading-ids.ts` unless nothing else imports it after cleanup
- Do not create a git commit unless the user explicitly asks

---

### Task 1: Remove TOC from ArticleLayout

**Files:**
- Modify: `src/layouts/ArticleLayout.astro`
- Spec: `docs/superpowers/specs/2026-11-10-remove-article-toc-design.md`

**Interfaces:**
- Consumes: none (deletion only)
- Produces: article pages with header then body, no สารบัญ nav

- [ ] **Step 1: Confirm current TOC wiring**

Open `src/layouts/ArticleLayout.astro` and verify these exist before editing:

1. Import `getStableHeadingId` from `../utils/heading-ids`
2. `const { Content, headings } = await article.render();`
3. `tocItems` built from `headings` depth === 2
4. `<nav ... data-toc-nav>` block gated by `tocItems.length > 1`
5. Bottom `<script>` that listens on `[data-toc-nav]`

- [ ] **Step 2: Remove TOC-only frontmatter helpers**

In the frontmatter of `src/layouts/ArticleLayout.astro`:

1. Delete the `getStableHeadingId` import line
2. Change render destructure to only Content:

```ts
const { Content } = await article.render();
```

3. Delete the entire `tocItems` const block:

```ts
const tocItems = headings
  .filter((heading) => heading.depth === 2)
  .map((heading) => ({
    ...heading,
    slug: getStableHeadingId(heading.text) ?? heading.slug
  }));
```

- [ ] **Step 3: Remove TOC markup**

Delete the whole conditional block that starts with `tocItems.length > 1 && (` and contains the สารบัญ `<nav>`, including its closing `)`.

After removal, `</header>` should be followed directly by:

```astro
    <div class="prose-news" itemprop="articleBody">
      <Content />
    </div>
```

- [ ] **Step 4: Remove TOC script**

Delete the entire trailing `<script>...</script>` block that queries `[data-toc-nav]` and calls `scrollIntoView`. After removal, the file should end at `</BaseLayout>` with no client script.

- [ ] **Step 5: Grep to confirm TOC is gone from layout**

Run:

```bash
rg "tocItems|data-toc-nav|สารบัญ|getStableHeadingId" src/layouts/ArticleLayout.astro
```

Expected: no matches.

Also confirm rehype heading IDs remain wired:

```bash
rg "rehypeStableHeadingIds|heading-ids" astro.config.mjs src/utils
```

Expected: matches still present (keep those files).

- [ ] **Step 6: Visual check on an article page**

If the local dev server is already running, open any news article URL (for example a Control Room article) and confirm:

- No สารบัญ box between hero and first heading
- Article body headings still render
- No console errors from a missing TOC script

If the server is not running, start it with the project package manager (`pnpm dev` or `npm run dev`) and check one article page.

- [ ] **Step 7: Commit only if user asks**

Do not commit by default. If the user later asks to commit, stage:

- `src/layouts/ArticleLayout.astro`
- `docs/superpowers/specs/2026-11-10-remove-article-toc-design.md`
- `docs/superpowers/plans/2026-11-10-remove-article-toc.md`

Suggested message:

```text
Remove in-article table of contents to reduce short-article clutter.
```
