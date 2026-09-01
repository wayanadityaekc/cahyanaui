# [MIG-11] Shared UI kit — Select, DateField, Modal, BottomSheet, Slider, ZoneTabs, Accordion, Img

**Agent:** Engine (structure) → Atelier (styling) · **Depends on:** MIG-01, MIG-02

## Objective
Build the reusable primitives every other component depends on. The centrepiece is replacing `makeFieldEnhancer` (364 lines) with two components — the largest single simplification in the migration.

## Scope
1. **`Select`** — replaces the custom dropdown half of `makeFieldEnhancer`. Desktop: floating dropdown anchored to the field. Mobile: bottom sheet with header + overlay. No native `<select>` visible anywhere on the site.
2. **`DateField`** — replaces the date half. **Centred popup on desktop too** (not anchored to the field) — this is deliberate, matching today's `hs-panel--popup` / `bookdate-panel` behaviour.
3. **`Modal`** and **`BottomSheet`** — shared shells for booking, review, trip-details, confirm dialogs.
4. **`Slider`** — from `initTourSlider`. Desktop arrows on hover, scrollbar hidden, `touch-action: pan-x pan-y` (**not** `pan-x` alone — that breaks vertical scroll on mobile). Must support both behaviours per context: slides in `.related` / cart upsell / Guides, grid-wraps in `.xplore` (desktop) and `.catsec` (all breakpoints). Grid uses `auto-fill`, **not** `auto-fit`.
5. **`ZoneTabs`** — from `initZoneAnchors`. Anchors + scrollspy, no filtering. Keep the fix: position from `getBoundingClientRect().top + scrollY`, not `offsetTop`, and start with no active tab until a section is actually reached.
6. **`Accordion`** — FAQ items.
7. **`InfoPopover`** — from `initInfoPopovers`.
8. **`Img`** — plain `<img>` wrapper (see architecture §13). Sets `loading="lazy"` and width/height, **always emits `height: auto` alongside any `aspect-ratio`**, supports `priority` (emits a preload link instead of lazy). **Do not use `next/image`** — under static export it delivers identical bytes while injecting inline styles that override the stylesheet.

## Out of scope
- Wiring these into pages (that is the feature issues).
- Changing any interaction behaviour. Port it, do not improve it.

## Input
- `script.js`: `makeFieldEnhancer` (~5041–5405), `initTourSlider`, `initZoneAnchors`, `initModals`, `initModalUX`, `initInfoPopovers`.
- `CLAUDE.md` — Sliders, Key mechanics, and the `aspect-ratio` gotcha.

## Acceptance criteria
1. Every form control site-wide can be driven by `Select` / `DateField` with no native control visible.
2. Programmatic value changes update the visible label (the old `cselRefreshAll()` problem — native `.value =` does not fire `change`).
3. Sub-panels opened from inside a bottom sheet still layer correctly above it.
4. Mobile: horizontal swipe moves slider cards, vertical swipe still scrolls the page.
5. Keyboard accessible: focus states, Escape closes, focus returns to the trigger.
6. Screenshot diff clean at 390 / 768 / 1440 against the current controls.

## Definition of done
- Components merged with a demo route exercising every variant.
- Engine states explicitly whether styling is complete or needs Mike/Miki.
