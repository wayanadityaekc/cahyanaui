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
src/blocks/       Layer 3  Hero, Navbar shell, Footer shell, Card shell  (Phase 2)
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

### Layer 3 - blocks (Phase 2)

Composed from primitives. Shells that take content through props. Where a block
genuinely differs between the sites, **both variants live here** and each site
picks one - the variants do not get scattered back into the apps.

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
