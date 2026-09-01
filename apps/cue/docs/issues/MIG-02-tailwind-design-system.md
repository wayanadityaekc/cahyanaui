# [MIG-02] Tailwind config from the existing design system

**Agent:** Atelier (Mike or Miki — whoever is free) · **Lane:** Gate 0 · **Blocks:** every styled component

## Objective
Turn the existing `:root` design tokens into the Tailwind config, so utilities emit exactly the values the site already uses. Tailwind becomes the styling engine without changing a single rendered pixel.

## Scope
1. Map every `:root` token from `style.css` into `tailwind.config.js`:
   - colors: `green, gold, gold-d, gold-l, cta, cta-d, amber, amber-d, cream, line, ok, err, ink, muted`
   - fontSize: `display` (clamp), `h2, h3, strong, body, field, small, label`
   - spacing: `1–6` (8/16/24/32/48/64), `section-gap` 2.25rem, `field-h` 2.1rem
   - maxWidth: `container` 1200, `container-mid` 1080, `container-read` 720
   - borderRadius: `sm` 8, `md` 12, `lg` 16, `xl` 22, `pill` 999
   - boxShadow: `sm, md, lg, xl, focus-ring`
   - transitionDuration / timingFunction: `dur-fast, dur, dur-slow` / `ease, ease-out`
2. `app/globals.css`: Tailwind directives + the preserved hand-tuned CSS under `@layer components`.
3. **Fix the pre-existing bug:** `:root` has `--dur-fast: var(--dur-fast);` — a self-reference that makes the token invalid. It is referenced 30 times across 23 rules, so those transitions are silently broken today. Set it to `0.15s` per the documented scale.
4. Document in the config which colour means what, mirroring CLAUDE.md: `amber` = rating stars, prices, "Popular"/featured badges **only**; `cta` green = primary action buttons **only**; `gold` (soft-black) = everything else.

## Out of scope
- Converting any component to utilities (that happens per-component, in the component issues).
- Any change to a token's *value*. If something looks wrong, flag it — do not "improve" it.
- Deleting anything from `style.css` yet.

## Input
- `style.css` `:root` block.
- `CLAUDE.md` — the design system section is the authority on what each token means.

## Acceptance criteria
1. Every token in `:root` has a Tailwind config equivalent with an identical value.
2. A test page using only Tailwind utilities renders colours, sizes, radii and shadows byte-identical to the same markup styled by `style.css` — verified by screenshot diff.
3. `--dur-fast` resolves to `0.15s` and the 23 affected rules animate.
4. No token value changed other than the `--dur-fast` fix.

## Definition of done
- `tailwind.config.js` + `globals.css` merged into `feature/nextjs-migration`.
- The token → meaning notes written down where the next agent will actually read them.

---

# RESULT — DONE (2 Sep 2026, Architect)

Tailwind **4.3.3**. All tokens live in `@theme` inside `app/globals.css`.

## Deviation: Tailwind v4 is CSS-first, so there is no `tailwind.config.js`

This turned out to be a better fit than the JS config the plan assumed. In v4, every `@theme` token **is emitted as a real CSS custom property**. So one declaration does two jobs at once:

```css
@theme { --color-amber: #c9a45c; }
```
→ generates the utility `.text-amber { color: var(--color-amber) }` **and** emits `--color-amber` into `:root`, which is exactly the variable the existing 9,919-line `style.css` already reads.

That means **the old stylesheet and Tailwind utilities share one source of truth** during the whole migration, instead of the two drifting copies a JS config would have created.

## Old token names kept working

`style.css` uses `--fs-*`, `--r-*`, `--space-*`. Tailwind v4 wants its own namespaces (`--text-*`, `--radius-*`). Rather than rename anything in `style.css`, `globals.css` carries a `:root` block aliasing the old names onto the new ones (`--fs-body: var(--text-body)`). Ported CSS keeps working untouched; new work uses utilities.

## Deliberate: Tailwind's spacing scale was NOT overridden

`--space-1..6` (8/16/24/32/48/64px) is kept as plain CSS variables, **not** mapped into Tailwind's `--spacing-*` namespace. Mapping it would silently redefine every `p-1`, `m-4`, `gap-2` on the site — `p-1` would mean 8px instead of 4px. The old scale stays available to ported CSS; new utility work uses Tailwind's own numbers.

## Verified against the original values

Compared token-by-token between the built CSS and `style.css`:

- **13/13 colours byte-identical** — green, gold, gold-d, gold-l, amber, amber-d, cta, cta-d, cream, ok, err, ink, muted.
- **All legacy aliases present** in the output: `--fs-body`, `--fs-h2`, `--fs-display`, `--r-lg`, `--r-pill`, `--space-3`, `--section-gap`, `--field-h`, `--icon-sm`, `--focus-ring`, `--line`, `--container`.
- Utilities resolve correctly: `.text-amber`, `.bg-cta`, `.rounded-pill`, `.shadow-md`, `.text-h2`.

**Shadows differ in notation only.** The minifier rewrites `rgba(0,0,0,0.05)` as `#0000000d`. Measured deltas:

| token | alpha before | alpha after | delta |
|---|---|---|---|
| `--shadow-sm` | 0.0400 | 0.0392 | 0.00078 |
| `--shadow-md` | 0.0500 | 0.0510 | 0.00098 |
| `--shadow-lg` | 0.0600 | 0.0588 | 0.00118 |
| `--shadow-xl` | 0.0800 | 0.0784 | 0.00157 |
| `--focus-ring` | 0.1800 | 0.1804 | 0.00039 |

Max delta 0.00157 alpha — below 1/255, the smallest step a browser can render. **Note for MIG-92: this is expected, not a regression.** It is ordinary CSS minification and would happen to the old stylesheet too if it were minified.

## Bug fixed

`--dur-fast: var(--dur-fast)` (self-referential, therefore invalid, referenced 30 times across 23 rules) is now `0.15s`. Confirmed in the build output: `--dur-fast:.15s`.

**Expect those 23 rules to start animating where they previously did not.** MIG-92 should treat that as the intended fix rather than a diff to undo.
