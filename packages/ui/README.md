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

Two sites, **one palette and one typeface**: CUE's, on both (Wayan, 30 Sep
2026 - the villa site dropped its own cream, charcoal and 41.6px buttons).
`data-brand` stays on `<html>` as the hook if a brand ever needs its own value;
today it overrides nothing. Components use `bg-surface` / `bg-surface-raised`
and never learn which site they are in.

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
| `NavbarShell` | the header: burger + left drawer on phones, links in the bar on desktop (CUE WO1) | content-driven |
| `NavDesktop` | the bar's page links; dropdowns are disclosures (hover + click, Escape returns focus) | - |
| `AccountMenu` | the navbar's account slot: Log in / initials menu; site passes account, handlers, fields | optional rows (CUE: Settings) |
| `FooterShell` | five columns, one hairline | content-driven |
| `StickyBar` | the one thing at the bottom of a phone screen | **flush** (both sites), floating (unused) |
| `Breadcrumb` | CUE's trail: nav + ol, last item is the current page | - |
| `JsonLd` | one structured-data script, `<` escaped | - |
| `BookingPanel` | the sticky panel beside a stay | - |
| `SearchBar` | dates + guests + the button | hero, panel, stack |
| `PriceBlock` | "From Rp… / night" | amber, gold |
| `Slider` | a card row that scrolls sideways, arrows on desktop | track class is a prop |
| `ReviewCard` / `ReviewDetail` | one review as a fixed-size card; its full text in a dialog | - |
| `ReviewList` | reviews as cards + the detail dialog | **slider** (a review section), **grid** (the full list) |
| `RailLayout` | sticky side menu + content column; on phones the menu is the first screen | default, card (phones keep the frame), scrollContent |
| `ChatLauncher` | the navbar's chat icon, a button that opens the panel in place | optional label (app bar) |
| `ChatPanel` | inside of CUE's live chat: head, conversation, email ask, input, a way out (WhatsApp) | - |
| `ChatMessages` | the conversation: guest right, bot left with rows/link/chips, owner replies named | - |

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

### Ported from CUE, 29 Sep 2026

`Separator` + `separatorClasses`, `LoadFallback`, `groupReviews`, `Slider`, the review
blocks and `RailLayout` came over from CUE (`apps/cue`) once they were settled there.
CUE still renders its own copies; these are the shared versions for the next site
that needs them. What changed on the way in, on purpose:

- **Nothing fetches.** CUE's `ReviewsStrip` calls its API; `ReviewList` takes
  `reviews` (null while loading renders nothing, so the empty state never flashes).
- **`group`** merges one review posted for several trips into one card
  ("Ubud Tour + 2 more"; the dialog lists every trip). On for lists that mix
  trips, off on one trip's own page, which shows its own copy.
- **`RailLayout` stores nothing.** CUE remembers the collapsed rail in
  localStorage; here `collapsed` + `onCollapsedChange` hand that to the site.
  Links go through `linkAs`, the breadcrumb is a node, and the content column
  is a `div` unless `contentAs="main"` - the site's layout usually owns `<main>`,
  and a second one inside it is a duplicate landmark.
- **Square frames.** The rail frame and the review card follow this library's
  card rule (no radius); the active rail row and the dialog keep theirs.
- **Slider arrows are rendered only when they can move.** CUE hides them with
  the `hidden` attribute, which loses to the arrow's own `flex` class on desktop.
- **`ReviewDetail` renders nothing until it opens.** Portaling its backdrop on
  the first render broke hydration of a static page (React #418).
- `RAIL_FRAME_SCROLL` subtracts `--footerbar-h` (0 unless the site sets it)
  instead of CUE's hard-coded 60px footer bar.

### Live chat, ported from CUE, 30 Sep 2026

`useChat` (lib) holds CUE's conversation state; `chatSocket` and `chatThread` are its
clients. This is the one place the library talks to a network, on purpose: the
socket rules (catch-up on EVERY connect, 5s polling only while the socket is
down, ping every 25s with a timeout, dedupe by database id, sending stays HTTP)
are what made CUE's chat reliable, and a second copy per site is how they drift.
Everything site-specific comes in as a parameter: `apiBase`, `storageKey`,
`answerFor(question)` (the site's own answers; the only two outcomes are
`answer` and `handoff`, there is no decline), `copy`, `suggestions`,
`page()` (what the owner sees as the source), `account` and `isAround()`.

The panel's frame (`CHAT_FRAME`, `CHAT_SCRIM`) is a class string, not a
component: its open/close motion is Framer Motion, which lives in the site, and
the dialog behaviour comes from `useDialog` on the site's frame.

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

## The villa site is warm paper, and nothing casts a shadow

**Superseded 30 Sep 2026 (G6):** the villa site now uses CUE's white surface and
`--color-cream` is CUE's `#f8f8f8` again (Wayan: match CUE on the shared chrome).
The no-shadow part still holds. Kept below as history.

Sep 2026, Wayan sent an aman.com screenshot: *"coba pakai background gini bro
dan, hilangin semua shadow biar seperti ini"*.

**The colour is sampled, not chosen.** `#f2eee8` is the dominant colour in that
screenshot by a wide margin - a histogram of it, not a guess at what it looked
like.

**One surface, not two.** `[data-brand="villas"]` used to pair a cream page with
white cards on top, so a card lifted off it. With the shadows gone that pairing
had nothing left to say, so `--surface` and `--surface-raised` are now the same
bone: the page is a single sheet, and what separates a block from it is space
and a hairline. Setting `--surface-raised` back to `#ffffff` is the one line
back if flat turns out to be too flat.

That only works because surfaces read the token. Every bare `bg-white` in both
the library and the villa app was pointed at `bg-surface-raised`. Four kept
their white on purpose, and the rule is the same for all four: **white that sits
on a photograph stays white** - the save heart, the "Show all photos" pill, the
`light` button's hover, and the hairline on the villa card's place line. The
page's bone would sink into whatever the photo happens to be doing there.

**Shadows are off at the token.** All four steps are `none`, so every
`var(--shadow-*)` user went flat at once and depth can be turned back on in one
place. The hand-written ones - the navbar, the drawer, the sticky bar, the
currency panel, the info card, article images, the search panel, the inset card
edge, the card hover lift - were swept separately, because a token cannot reach
those. Two things that use `box-shadow` and are NOT depth stayed: `--focus-ring`
(the keyboard focus indicator - removing it takes away the only thing telling a
keyboard user where they are) and the `0 0 0 1px` hairlines on flag images,
which are borders drawn the other way round.

`--color-cream` was warmed from `#f8f8f8` to `#f7f4ee` at the same time. A
neutral grey-white tint on warm paper reads as a mistake; it is still lighter
than the page, so a tinted pill or band still lifts.

Gated by `verify-round4.mjs`: nothing on any page casts a shadow, and `<body>`
is exactly that bone. Both proved by putting the bug back - one shadow token
restored, then the white surface restored - 15 assertions each.

## Black buttons, and the one place they invert

**Superseded 30 Sep 2026 (G6):** the villa buttons are CUE's green again; the
`onDark` inversion is still used on dark bands. Kept below as history.

Sep 2026, Wayan: *"warna button green jadi black bro"*. `--color-cta` /
`--color-cta-d` are overridden **inside `[data-brand="villas"]`**, not at the
token, because that token is CUE's green and CUE is the other half of this
palette. The values are `--color-gold` / `--color-gold-d` - the soft black this
palette already calls its accent - so the site has one dark, not two.

**A colour change turned three buttons invisible, and only measurement caught
it.** The villa card and the `tone="dark"` closing bands ARE `--color-gold`. A
primary button on them came out at a **1:1** contrast against its own backdrop:
the shape vanished completely and left the white label floating. Nothing was
broken, nothing errored, and it reads as "a slightly odd label" rather than as a
bug.

So `Button` has an **`onDark`** variant - bone fill, dark label - used by the
villa card's CTA and by every `Section tone="dark"`. It is an inversion, not a
third colour: bone on dark says exactly what black says on bone. Measured after:
1:1 → **14.07:1**.

`verify-round4.mjs` now checks every action button's fill against the first
opaque ancestor behind it and fails under 1.4:1. Two notes on that check:
it found two MORE 1:1 buttons than the ones spotted by eye (the villa detail
band and the service bands), and its first version reported two false ones -
the frosted search panel and the `light` button - because it parsed `oklab()`
and translucent fills as if they were `rgb()`. It now refuses to compare
anything that is not an opaque `rgb()`, since a translucent fill is a stack
rather than a colour, and both of those are drawn by a border and a blur anyway.

**One rounded surface survives**: the hero's booking form, at `--r-sm` (Wayan:
*"di booking form kasi border radius dikit"*). Everything else is square, so
rounding only the thing the guest is meant to act on is what marks it out now
that no shadow can.
