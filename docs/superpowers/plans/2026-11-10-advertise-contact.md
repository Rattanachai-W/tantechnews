# Advertise Contact Implementation Plan

> **For agentic workers:** Implement task-by-task. Steps use checkbox syntax.

**Goal:** Add light advertising contact at `/advertise/` and a short section on `/contact/`.

**Architecture:** Static Astro pages matching existing policy/contact layout. Mailto CTA only. Footer + sitemap discoverability.

**Tech Stack:** Astro, existing BaseLayout, Tailwind tokens already in the project.

## Global Constraints

- No budget field in checklist copy
- Reuse `rattanachai.wp@gmail.com`
- No pricing, no form, no new emoji
- Thai copy, mobile-first, token classes already used on contact/about pages

---

### Task 1: Create `/advertise/`

**Files:**
- Create: `src/pages/advertise.astro`

- [x] Add hero, mailto CTA, checklist (no budget), editorial independence note
- [x] Verify page renders at `/advertise/`

### Task 2: Contact page section

**Files:**
- Modify: `src/pages/contact.astro`

- [x] Add advertising topic + short section linking to `/advertise/` and mailto
- [x] Update meta description to mention advertising

### Task 3: Discoverability

**Files:**
- Modify: `src/components/layout/site-footer.astro`
- Modify: `src/pages/sitemap.xml.ts`

- [x] Footer link to `/advertise/`
- [x] Sitemap entries for `advertise/` and `contact/`
