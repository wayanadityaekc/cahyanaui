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

---

# RESULT — component built; one styling decision needs Wayan (2 Sep 2026, Architect)

## Built
`ExperienceCard`, `GuideCard`, `ReviewCard`, `DriverCard`, `CharterHourCard`, `StopCard`, plus `Price` and a `PricingProvider` that fetches `GET /api/pricing/catalog` and refetches on currency / guests / stay change. Cards take a build-time `priceFallback` and the provider overrides it client-side - the same static-fallback-then-JS pattern the current site uses.

Verified structurally against the real card in `tour.html`: element+class tree, `alt`, `src`, `width`, `height`, `data-zone`, `data-price` and visible text are **all identical**. Rendered screenshot matches the live card.

## FINDING - the card is not one component today, it is three

The Atelier rule says a repeated component must be 100% identical everywhere. The CSS says it currently is not. `.experience__card` and its children are styled by three page-scoped rule sets:

| Rule | `.home` | `.tourprog` | `.related` |
|---|---|---|---|
| `.experience__meta` | present | **byte-identical duplicate** | - |
| `.experience__meta svg` | present | **byte-identical duplicate** | - |
| `.experience__card` link reset | - | `display:block; text-decoration:none; color:inherit` | `text-decoration:none; color:inherit` |
| `.experience__name` | `line-height: 1.25` | **no line-height** | - |

Two of these are pure duplication - harmless DRY debt that unscoping removes for free.

**One is a real visual difference:** the card title has `line-height: 1.25` on the homepage and no line-height override on the tour listing page. Same component, two different title line heights, on a two-line clamped title. This is exactly the drift the Atelier rule exists to prevent.

**It was found because the component was built unscoped.** Dropping the `.home` / `.tourprog` / `.related` prefixes is the correct end state, but it would change the tour listing page's title spacing - a visual change, so it is not being made silently.

**Question for Wayan:** unify on the homepage value (`line-height: 1.25` everywhere, tour listing shifts slightly), unify on the tour-listing value (homepage shifts), or keep both as they are and accept the card is not identical across pages? Recommendation: unify on `1.25`, since it was added deliberately in Sep 2026 for the longer restructured tour names and the tour listing has those same long names.

## Note for MIG-92
`/ui-kit.html` is a development page for rendering components in isolation. It is `noindex`, but **delete it before cutover** - it should not exist on the live site.

## FINDING 2 — the two cards differ structurally, not just in CSS (2 Sep 2026)

Finding 1 above was about page-scoped CSS. Porting the homepage turned up something larger: the homepage card and the listing card are **different markup**.

| | homepage (`index.html`) | listing (`tour.html`) |
|---|---|---|
| outer tag | `<article>` × 14 | `<a>` × 20 |
| `experience__desc` paragraph | 31 | **0** |
| `experience__arrow` link | 16 | **0** |
| `data-program` | 4 | 0 |

The homepage card is a non-link `<article>` carrying a description and an inner arrow link; the listing card is a whole-card `<a>` with no description. `initItineraryButtons()` then rewrites the homepage shape at runtime - it removes the arrow link and makes the whole card clickable, which is how the two end up *behaving* the same.

`ExperienceCard` now supports both via `variant="link" | "article"`, so both render pixel-identically. **That is deliberately not a fix** - unifying them means either the listing pages gain a description or the homepage loses one, which is a visual and content decision.

**Question for Wayan, alongside the `line-height` one:** should the homepage card keep its description paragraph and the listing cards stay without, or should they converge? Recommendation: keep as-is for the migration, and treat unification as its own Atelier issue after cutover, so a port bug can never be confused with a redesign.

## Checked and dismissed - NOT a bug
The homepage card for Uluwatu & Sunset Kecak carries `data-program="South Bali & Sunset Kecak"`, a name that no longer exists in `data.js` after the Sep 2026 tour restructure. It looks like a live bug and is not one: `initItineraryButtons` reads `PAGE_ITEM[href]` first and only falls back to `data-program`, and `PAGE_ITEM["south-coast-sunset-kecak.html"]` correctly returns `"Uluwatu & Sunset Kecak"`. The stale attribute is never read.

It is still a trap - anyone who later removes that detail page, or writes new code keyed on `data-program`, gets a silent failure. The ported card uses the correct name.
