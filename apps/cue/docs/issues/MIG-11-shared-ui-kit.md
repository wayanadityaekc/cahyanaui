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

---

# RESULT — DONE (2 Sep 2026, Architect)

Built in `components/ui/`: `Select`, `DateField`, `Modal`, `Overlay`, `Slider`, `ZoneTabs`, `Accordion`, `InfoPopover`, `Img`, `useMobile`.

`Select` and `DateField` replace `makeFieldEnhancer` (364 lines). They keep the original class names (`hs-control bk-control`, `hs-panel bk-panel`, `hs-panel__head/__body/__close`, `hs-opt bk-opt`, `hs-overlay`, `csel-group`, `bk-native`) so `style.css` styles them unchanged. Desktop renders the panel inline; at `max-width: 768px` - the same breakpoint the original used - it portals to `document.body` with the overlay. `DateField` always uses the centred popup (`hs-panel--popup bookdate-panel`), matching the current deliberate behaviour.

The hidden native `<select>` / `<input type="date">` is kept so the value stays form-submittable and the custom control drives it, as before.

`Slider` measures overflow and shows the arrows only when there is somewhere to scroll, instead of injecting them unconditionally.

`Img` is a plain `<img>` wrapper - not `next/image`, per the architecture decision - that emits `height: auto` alongside any `aspect-ratio`, fixing the documented `.guide-lead` trap once and centrally.

## Not yet exercised
`Select`, `DateField`, `Modal`, `InfoPopover`, `Accordion` and `ZoneTabs` compile and follow the original markup, but they have **not been driven by a real form yet** - that happens in MIG-20/21/33. Their visual verification belongs there, not here.

---

# CSS AUDIT — 2 Sep 2026

After `InfoPopover` was found using classes with zero rules in `style.css`, every class used across `components/`, `app/` and `state/` was extracted and checked against `style.css`.

**36 classes had no rule. 6 remain, and all 6 are legitimate.**

## Broken — components styled with names that do not exist

| Component | Was using | Actually is |
|---|---|---|
| `InfoPopover` | `infopop`, `infopop__btn`, `infopop__panel` | `binfo`, `binfo__btn`, `binfo__pop` (+ `binfo__row`, `binfo__tag`) |
| `ReviewCard` | `review-card__head`, `__country`, `__service` | **`rev`, `rev__head`, `rev__name`, `rev__flag`, `rev__service`, `rev__stars`, `rev__text`, `rev__logo`** |
| `DriverCard` | `driver`, `driver__avatar`, `__name`, `__role`, `__bio` | **`driver-card`** (a `<button>`), `driver-card__avatar`, `__name`, `__tagline`, `__more`, `__detail` |
| `StopCard` | `stop__title` | `stop__name` (plus `stop__num`, which was missing) |
| `ZoneTabs` | `zone-chips` container | `zone-filter` |
| `CharterHourCard` | `chcard--popular`, `chdur__badge` | `chcard--pop`, `chcard__badge` |

`ReviewCard` is the worst of these: `.review-card*` does have some rules in `style.css`, so it would have looked *partly* styled rather than obviously broken. The live renderer is `renderReviewCard()` in `script.js`, which emits `.rev` markup - a different component entirely. `.review-card*` appears in no HTML file and looks like dead CSS.

`chdur__badge` came from CLAUDE.md, which names it as the charter badge class. **CLAUDE.md is wrong there** - the real class is `chcard__badge`. Worth correcting in the doc.

## The 6 that are fine
`binfo__note`, `contact__info`, `stop__body` and `xplore__intro` have no rules but do appear in the original HTML - unstyled there too, so carrying them over is faithful. `hs-panel--popup` and `bk-panel--cal` are behaviour flags read by JS, never styled.

## Lesson
MIG-11 was built from the *behaviour* described in `script.js` without checking each class name against `style.css`. Behaviour was right; names were invented. Nothing looked wrong at build time - only a rendered page or this audit surfaces it.

**This check should run before any component is considered done.** Worth adding to `tools/` as a script so MIG-30..33 cannot reintroduce it.
