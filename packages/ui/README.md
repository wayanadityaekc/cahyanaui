# @cahyana/ui

The shared component library. Both sites are thin consumers of it.

## Why it is built this way

It borrows **shadcn/ui's structure** and nothing else. Two ideas are worth
stealing from shadcn:

1. **Three layers, bottom-up.** Tokens, then primitives, then blocks. A layer
   never imports from the layer above it. That is what stops a "Button" from
   quietly depending on a "VillaCard".
2. **You own the code.** shadcn is not an npm dependency you upgrade - you copy
   components in and they become yours. Same here: this is source in the repo,
   not a published package. Nothing can change under you.

What is **not** taken: shadcn's code, its dependencies, Radix, or
tailwind-merge. Cahyana's components are written from CUE's own patterns.

## The three layers

```
src/tokens/       Layer 1  colour, type, spacing, radius, shadow, motion
src/primitives/   Layer 2  Button, Badge, Field, Input, Select, DateField...
src/blocks/       Layer 3  Hero, Section, Card, Navbar/Footer shells, booking
```

### Layer 1 - tokens

One CSS file. The only place a raw value is allowed to appear.

Two sites, **one palette and one typeface**. They are told apart by their
**surface**:

| | surface | cards |
|---|---|---|
| CUE (default) | white | white |
| Villas (`data-brand="villas"`) | light grey `#f8f8f8` | white |

A site sets `data-brand` on `<html>` and changes nothing else. Components use
`bg-surface` / `bg-surface-raised` and never learn which site they are in.

Note the two naming systems, both deliberate: Tailwind generates utilities from
the **long** names (`--color-line` → `border-line`), and components read the
**short** aliases inside arbitrary values (`var(--line)`). Both are declared.

### Layer 2 - primitives

Small, presentational, no opinions about data. `CurrencyPicker` takes `value`,
`onChange` and `options`; it does not know where the currency is kept. The
moment a primitive reaches into a site's React context, the other site can no
longer use it.

### Layer 3 - blocks

Composed from primitives. Shells that take content through props. Where a block
genuinely differs between the sites, **both variants live here** and each site
picks one - the variants do not get scattered back into the apps.

| | what it is | variants |
|---|---|---|
| `Container` / `Section` | the page's side edges and its vertical rhythm | 3 widths, 4 tones |
| `SectionHeading` | eyebrow / heading / lede | light, dark |
| `Hero` | photo band with words on it | page, band, sub, compact |
| `Card` / `MediaCard` | a card's surface; photo-on-top card | framed, inset |
| `VillaCard` | a villa, as a card | - |
| `Collapse` | an inline menu that pushes content down | - |
| `NavbarShell` | the header, drawer and hamburger | content-driven |
| `FooterShell` | five columns, one hairline | content-driven |
| `StickyBar` | the one thing at the bottom of a phone screen | **flush** (CUE), **floating** (villas) |
| `BookingPanel` | the sticky panel beside a stay | - |
| `SearchBar` | dates + guests + the button | hero, panel, stack |
| `PriceBlock` | "From Rp… / night" | amber, gold |

Class strings ship beside the components (`gridClasses`, `cardClasses`,
`navbarClasses`, `footerClasses`, `layoutClasses`). A row of cards is a div with
one className - wrapping that in a component buys nothing. Components earn
their keep where there is behaviour or a shape to hold together.

**No animation library.** `Collapse` animates `grid-template-rows` from `0fr` to
`1fr`, which reaches the child's natural height in pure CSS. Framer Motion earns
its place where an element must animate OUT before unmounting (modals); a menu
is not that, and the navbar is on every page.

### What is NOT a string

One rule ships as CSS, in tokens.css: `.prose-copy`. It sets the size and
colour of every <p> inside running copy and it has to LOSE to a paragraph that
states its own - a gold review quote, an eyebrow at label size. A rule in
`@layer components` loses to every utility whatever its specificity, which is
exactly that behaviour; a `[&_p]:` string does the opposite. Ported as a
string first and measured: a gold quote turned muted and nine eyebrows jumped
from 10.24px to 12.8px.

Everything else in here is a string, because everything else wants to win.

## Using it

```js
// app/globals.css
@import "tailwindcss";
@import "@cahyana/ui/tokens.css";
@source "../../../packages/ui/src";   // REQUIRED - see below

// anywhere
import { Button, Field, Select } from '@cahyana/ui';
```

Two things a consuming site must do:

- **`@source`** pointing at the library. Tailwind v4 only emits utilities it can
  find in files it scans. Miss this and every class used *inside* a library
  component is purged - the component renders with no styling at all, with no
  error anywhere.
- **`transpilePackages: ['@cahyana/ui']`** in `next.config.js`. The library
  ships as JSX source, not a built bundle, so Next has to compile it like app
  code.

The site also needs `.hs-locked { overflow: hidden !important }` if it uses
`useBodyLock`. The library does not ship it: a library should not reach out and
restyle the host document's `<html>`.

## Rules

- Anything used by a site lives here first. That includes one-off blocks - a
  future villa site should be able to drop its content into the same slots.
- Presentational only. No fetching, no validation, no booking logic. Sites pass
  fields, handlers and content in.
- No raw values outside `tokens.css`.
- A layer never imports upwards.

## Two decisions that are easy to undo by accident

**One button size, and the villa site's is not CUE's.** Every action button is
`BTN_SM`: `--btn-h` tall, `--text-strong`, `px-5`, `rounded-sm`. The villa site
sets `--btn-h: 2.6rem` (41.6px); CUE sits at `2.1rem` (33.6px). That divergence
is deliberate (Sep 2026, Wayan: *"buttonya kayaknya masih kecil bnget"*) and
41.6px is not a new number - it is what the villa card's CTA had been since the
mock, which is the one button on that site he had looked at and not called
small. `--field-h` stayed at 2.1rem: form fields did not grow with the buttons,
which is exactly why the two tokens are separate.

Never re-type BTN_SM's numbers into a component. `PhotoMosaic` did, and the copy
went stale the moment the size changed - its "Show all N photos" button was left
at 12.8px/16px while every other button on the site had moved on. Import it.
And when you convert an old button, DELETE its `h-`/`px-`/`text-`/`rounded-`
classes: adding `BTN_SM` beside them overrides nothing, because the winner is
the compiled stylesheet's order, not the order the classes were written in.

**Cards and pictures have square corners; controls do not.** Sep 2026, Wayan:
*"card atau image hilangin border radiusnya"*. So `CARD_FRAMED`, `CARD_INSET`,
`CARD_MEDIA_INSET`, `SplitFeature`'s photo and `VillaCard` draw no radius, and
neither do the apps' own card surfaces. Buttons, fields, dropdown panels, the
sticky bar and the sheets keep theirs - a sheet is not a card. The test that
separates them is shape, not name: a control that floats is `position: fixed`,
a card is in the flow.

The gate for both is `verify-round4.mjs`. Two things it learned the hard way:
"every button matches `--btn-h`" is a **tautology** - it holds at any value, so
it passed with the old height put back - which is why there is also an absolute
40px floor; and a rounded-corner sweep that looks for a border or a shadow
misses `VillaCard` entirely, because that card is a flat tint with an absolutely
positioned photo clipped by its own overflow. It now counts any surface that
contains an `<img>` as a picture.
