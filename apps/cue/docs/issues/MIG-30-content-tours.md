# [MIG-30] Content extraction: 20 tour programme pages

**Agent:** Voice (copy fidelity) + Engine (extraction) · **Depends on:** MIG-12, MIG-20 · **Phase 2 repetitive work — Sonnet**

## Objective
Extract the 20 bookable programme pages into `content/tours/` and render them through one `TourPage` template.

## Scope
- One content file per programme, keyed by the slug that produces the current URL (`ubud-tour` → `/ubud-tour.html`).
- Per page: H1, hero intro, meta (duration/zone), stops (title, description, photo, alt, link to the attraction page), Included/Excluded lists, the price item name matching `prices` exactly, `og:image`, meta title/description, breadcrumb trail.
- `app/[tourSlug]/page.jsx` with `generateStaticParams` over the 20 slugs and `dynamicParams = false`.
- `generateMetadata()` per page from the content file.
- JSON-LD: `BreadcrumbList` + `Product`/`Offer`/`Brand`, built by `lib/schema.js`.

## Out of scope
- **Rewriting any copy.** This is extraction, not editing. Text moves across character-for-character.
- Changing prices or item names — the name is the join key to `prices` and to review tagging; a typo silently breaks both.
- New photos.

## Input
- The 20 root programme HTML files.
- `script.js` `PAGE_ITEM`, `ITEM_CARD`, `RELATED_ITEMS`.
- `CLAUDE.md`: first section label on a tour page is **"What You'll Do"**; long SEO tour names keep their full name in H1 (the 40-char rule does not apply to them); no em-dashes in copy; no glorify words.

## Acceptance criteria
1. All 20 URLs resolve at their exact current paths.
2. Copy diff vs the current pages is empty apart from markup.
3. Meta title ≤65 chars, description 110–170 chars, unique per page, matching today's values.
4. `og:image` is the page's own card/hero, not `preview.jpg`, wherever one exists today.
5. Stop links carry `?from=<tour name>`.
6. JSON-LD validates and matches the current output for the same page.
7. Screenshot diff clean at 390 / 768 / 1440 for all 20.

## Definition of done
- All 20 pages merged and diffed. A page is not done until its screenshot diff is clean.

---

# RESULT — 20 tour pages done (2 Sep 2026)

Extracted by script into `content/tours/index.js` and rendered through one `TourPage`. **All 20 diff clean against their originals.**

Three things the diff caught that a visual pass would not have:
1. **`data-item` was missing on 11 of 20 pages.** The `book-modal-placeholder` is written across multiple lines, so a regex anchored on `<div id="..."` matched only the 9 single-line ones. Without it those tours could not be booked.
2. **`best-of-bali-3-day-package` has day sub-headings** (`<h3 class="section__title--sub">Day 1 · Ubud`) interleaved between stops. They are `<h3>`, not `<h2>`, which is why the first fix for them silently found zero.
3. **One stop uses a gradient placeholder instead of a photo** (Banjar Hot Spring on `lovina-dolphin-sekumpul`) - a `<div class="stop__image" style="background-image: linear-gradient(...)">`. An `<img>`-only extractor dropped it.
