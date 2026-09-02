# [MIG-31] Content extraction: 51 attraction / destination pages

**Agent:** Voice + Engine · **Depends on:** MIG-12 · **Phase 2 repetitive work — Sonnet**

## Objective
Extract the 51 pages under `attractions/` into `content/attractions/` behind one `AttractionPage` template.

## Scope
- One content file per page, slug matching the current filename.
- Per page: H1, intro, fact chips (ticket price, opening hours, location — ticket values come from the server `TICKETS` table, not hardcoded), content sections with photos and alt text, breadcrumb, meta.
- `app/attractions/[slug]/page.jsx` with `generateStaticParams`, `dynamicParams = false`.
- JSON-LD: `BreadcrumbList` + `TouristAttraction`, plus `Event` for the two Kecak pages (Ubud: Tuesday & Sunday 19:00; Uluwatu: daily at sunset, **startTime deliberately unset** — do not invent one).
- `?from=<tour>` context: when present, the page shows the tour context banner (`applyTourContext`).
- Bookable attraction pages keep their booking modal and their entry in `PAGE_ITEM`.

## Out of scope
- Rewriting copy.
- Inventing opening hours, ticket prices, or facts not already on the page.
- Adding FAQ blocks — FAQ is centralised on `faq.html` only.

## Input
- The 51 files in `attractions/`.
- `tools/sync-schema.js` — the current schema generation is the reference for what each page's JSON-LD should contain.
- `data.js` `TICKETS` (moving server-side via MIG-00).

## Acceptance criteria
1. All 51 URLs resolve at their exact current paths.
2. Copy diff empty apart from markup.
3. `TouristAttraction` schema present on the non-programme pages, matching current output.
4. Both Kecak `Event` blocks preserved, Uluwatu still without a fabricated `startTime`.
5. `?from=` banner behaves as today.
6. Screenshot diff clean at 390 / 768 / 1440 for all 51.

## Definition of done
- All 51 merged and diffed.

---

# RESULT — 51 attraction pages done (2 Sep 2026)

All 51 share one structure (`tour-hero | stops | info`), so they render through one `AttractionPage` fed by `content/attractions/index.js`. 153 stops extracted. **All 51 diff clean.**

The diff caught a breadcrumb (`<nav class="crumb">` with two `crumb__sep`) present on every one of the 51 pages and missed by the first extraction pass - 102 differences across the set, from one omission.
