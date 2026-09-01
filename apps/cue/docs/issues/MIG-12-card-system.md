# [MIG-12] Card system — one ExperienceCard, used everywhere

**Agent:** Engine (structure) → Atelier (styling) · **Depends on:** MIG-02, MIG-11

## Objective
Build the card components. `ExperienceCard` is the most repeated component on the site — it must be one implementation with zero visual variants.

## Scope
- `ExperienceCard` — photo, title, meta (duration/location/pax), price, optional rating, optional "Popular" badge, optional tour-type toggle. Used on homepage, listing pages, related grids, cart upsell, itinerary builder.
- `GuideCard`, `DriverCard`, `ReviewCard`, `CharterHourCard` (`.chcard`), `StopCard`.
- Card click-through: photo and body navigate to the detail page. **The tour-type toggle and the heart button inside a card must not trigger navigation** (`stopPropagation` today).
- The "Popular"/featured badge sits in the card's **inner** corner, not negative-top — otherwise slider `overflow` clips it.

## Out of scope
- Creating a second card variant for any reason. If a placement seems to need different spacing, flag it to Architect — per the Atelier rule, a repeated component is identical everywhere, and a restyle applies to all usages at once.
- Price calculation (comes from the API via MIG-00).

## Input
- `style.css` `.experience__card` and friends, `script.js` `initCardTitleOverlay`, `initItineraryButtons`, `RELATED_ITEMS` / `ITEM_CARD` in `script.js`.
- `CLAUDE.md` — design system, amber (stars/prices/badges) vs gold (everything else).

## Acceptance criteria
1. Exactly one `ExperienceCard` implementation. A grep for card-specific CSS finds no per-page variants.
2. Prices render in `amber`, section titles/nav in `gold`, primary CTAs in `cta` green — no colour role bleed.
3. Toggle and heart clicks do not navigate; photo and body do.
4. Screenshot diff clean at 390 / 768 / 1440 in **every** context the card appears in — homepage, all three listing pages, related grid, cart upsell.

## Definition of done
- PR merged, with the diff run in all card contexts, not just one.
