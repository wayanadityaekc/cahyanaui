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
