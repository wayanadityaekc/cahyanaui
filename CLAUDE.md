# CLAUDE.md — Cahyana monorepo

## Cahyana standards (repo consistency, all repos)

Shared across CUE, cahyanaui, ubud-private-villas and salia-makeup (Sep 2026).
Where an older note below conflicts with these, THESE win - above all: never push to
`main` without Wayan explicitly saying so. Repo-specific notes below that do not
conflict still apply. Source of truth for style is CUE.

### Working rules

- [ ] Audit first, then fix. Never fix during an audit.
- [ ] Report format: rule, hits/files, where most of it is, likely false positives or keep-as-is.
- [ ] Delete nothing (files, endpoints, components) without Wayan's OK.
- [ ] Push work-order commits to the feature branch `claude/work-tree-validation-vqexsf` as you go (standing approval, that branch is not live). Never push to `main` until Wayan explicitly says so.
- [ ] When a rule cannot be applied cleanly (for example a loop with `return`/`break`), list it separately and do it in its own work order.
- [ ] When a new feature or new site is built, walk Wayan through the QA checklist (QA checklist below) step by step and remind him of small items he may forget.

### Syntax rules (from the finished CUE audit)

- [ ] Standalone named helper functions: plain `function name() {}`. Not `const name = () => {}`.
- [ ] Arrow functions stay for inline callbacks (`.map`, `.forEach`, `.filter`) and short inline event handlers (`onClick={() => {...}}`).
- [ ] Components: `export default function ComponentName()`.
- [ ] Strings: template literals. No `+` concatenation (skip false positives like a phone prefix or a CSS class string).
- [ ] Loops: `forEach` and array methods (`filter`, `find`, `some`, `reduce`, `map`). Exception: `for...of` only when each item must `await` in sequence (for example stop on the first failed submission).
- [ ] Destructure props and multi-property pulls in function parameters by default: `function Card({ title, price })`. Plain dot access is fine for a single simple value or an awkward deeply nested case.
- [ ] Spread operator is the default for copying arrays and objects.
- [ ] Async: `async`/`await`. No `.then()` chains. Exception: fire-and-forget calls that must not be awaited (for example the Resend email send); wrap those in an un-awaited async helper.
- [ ] Conditions: `if`/`else`. No `switch`.
- [ ] Try/catch: every `try` has a `catch`, and the error variable is always named `e`.
- [ ] Naming: camelCase. Descriptive names. No cryptic single letters (`el`, `dt`, `mm`, `q`, `r`, `c`, `t`). Exception: `a`/`b` inside `.sort()` comparators.
- [ ] Comments: one line maximum, placed directly above the tricky line, saying simply what it does. No paragraph or block comments.
- [ ] Components with several props get default values (for example `included = []`) plus a friendly fallback message when data is missing ("Sorry, we could not load this information. Please try again.").
- [ ] Files over about 300 lines: flag for splitting. Pure data files are exempt.

### Stack

Frontend:
- [ ] React, Next.js, Tailwind
- [ ] Zod (validation)
- [ ] Framer Motion (animation)
- [ ] Lucide React (icons)
- [ ] clsx (conditional classes)
- [ ] jspdf (Salia receipts)
- [ ] Forms: hand-rolled validation. Do NOT add React Hook Form (tried and declined).
- [ ] Do NOT install shadcn/ui. Study its structure only. Build Cahyana's own components.

Backend (plain Express, kept simple on purpose):
- [ ] Node, Express, PostgreSQL
- [ ] Helmet, Morgan, Zod, cors

Before adding any library not listed here: ask Wayan first.

### Typography

- [ ] Inter only, for headings and body. No second typeface.
- [ ] Default for every repo and every future site. Follow CUE. Change only when Wayan explicitly asks.

### Animation

- [ ] Framer Motion is the only animation library. Popups, modals, dropdowns, page and section transitions must animate smoothly, not appear abruptly.
- [ ] On every new feature with an interaction, check whether Framer Motion applies. If it does, ask Wayan once: "Should this use Framer Motion?" If yes, add it.
- [ ] Audit `ubud-private-villas` and `salia-makeup` to confirm they consume Framer Motion consistently.
- [ ] Known issue in CUE: some interactions (for example a popup on click) appear abruptly. Flag to Wayan; he will double-check CUE later.
- [ ] Every popup locks background scroll.

### Mobile inputs and popups (standing rules, Oct 2026, brief #16)

- [ ] No iOS zoom when a field is tapped. Every page mounts the iOS-only viewport clamp (`IosZoomFix`: adds `maximum-scale=1` on iPhone and iPad only; Android keeps pinch-zoom; never `user-scalable=no`). Fields under 16px are allowed only while that clamp is mounted in the root layout.
- [ ] Every popup, dialog, modal, drawer, bottom sheet, chat panel and full-screen overlay locks background scroll while open and releases it when closed (`useBodyLock`: a class on both html and body). A popup opened on top of another must not release the lock of the one underneath.
- [ ] New popup = verify in a browser: open it, scroll over it, the page behind must not move; close it, the page scrolls again. Check the iOS clamp on a real iPhone (headless browsers cannot reproduce iOS focus zoom).

### QA checklist (draft: extend it from CUE, then ask Wayan to approve)

Claude Code: read CUE, propose the full checklist, mark each item Must-have or Nice-to-have, and wait for approval. Starting list:

Must-have
- [ ] Payment flow works end to end and matches CUE
- [ ] Favicon and browser tab icon present and correct
- [ ] Font, colors and animation match CUE (typography and animation above)
- [ ] Syntax matches section 3
- [ ] Forms validated front and back (Zod on the backend)
- [ ] Endpoints check ownership (locked, security-by-default)
- [ ] `sitemap.xml` present and correct
- [ ] `robots.txt` present and correct
- [ ] Alt text on every image
- [ ] Unique page title and meta description per page
- [ ] No placeholder content left live (phone numbers, dummy reviews, wrong brand name)

Nice-to-have
- [ ] Structured data (schema) for search engines and AI systems (GEO)
- [ ] Open Graph / social share preview
- [ ] Image sizes set (width/height) to avoid layout shift; WebP images
- [ ] Lighthouse check, mobile and desktop
- [ ] Google Search Console verified

## What this is

```
apps/cue        cahyanaubudexperience.com   - tours & experiences
apps/villas     ubudprivatevillas.com       - the villas
packages/ui     @cahyana/ui                 - the shared library
```

pnpm workspaces + Turborepo. Node 22, Next 16, React 19, Tailwind v4.

Each app keeps its own `CLAUDE.md` — `apps/cue/CLAUDE.md` is the long one and
still governs CUE.

## The rule that matters

**The library is the product. Sites are thin consumers.**

Anything a site uses lives in `packages/ui` first and is imported. That holds
even for a block only one site uses today — a future villa site should drop its
own content into the same slots and render.

Read `packages/ui/README.md` before adding to the library. Short version:
three layers (tokens → primitives → blocks), a layer never imports upwards,
components are presentational and take content through props. Structure is
borrowed from shadcn/ui; **no shadcn code and no shadcn dependency**.

## CUE is not being migrated

`apps/cue` keeps using its own local components and stays fully working. It
**donates its patterns** to the library — it does not consume it yet. Do not
refactor CUE into the library without being asked.

## Deploys — read this before touching CI

Both sites still deploy from their **own separate repos**, not from here:

| site | repo | how |
|---|---|---|
| CUE | `wayanadityaekc/CUE` | push `main` → Action → force-push `out/` to `deploy` → Hostinger |
| Villas | `wayanadityaekc/ubud-private-villas` | same shape |

This monorepo **deploys nothing**. The two apps' old workflow files sit at
`apps/*/.github/workflows/`, where GitHub does not look — that is deliberate,
not an oversight.

Cutting a site over means pointing Hostinger at this repo, which is a change in
the hosting panel that only Wayan can make. Until then, a change that must go
live still goes through the site's own repo.

## Working here

- `pnpm install` at the root. `.npmrc` sets `node-linker=hoisted` — both apps
  were built and are live under npm's flat layout, and hoisting avoids a class
  of "worked before the monorepo" failures. Worth revisiting once both apps are
  on the library and their dependency lists have been audited.
- A site consuming the library needs two things, and both fail silently:
  `@source "../../../packages/ui/src"` in its CSS (or every class used inside a
  library component is purged and the component renders unstyled), and
  `transpilePackages: ['@cahyana/ui']` in `next.config.js` (the library ships
  as JSX source, not a built bundle).
- Verify styling by measurement, not by eye. playwright-core plus the bundled
  Chromium at `/opt/pw-browsers/`; serve `out/` over plain `node http`.

## History

Both repos were merged in with `git-filter-repo --to-subdirectory-filter`, so
`git log` and `git blame` work normally on a path — 1322 commits of CUE and 32
of the villa site, back to CUE's first commit. A plain `git subtree add` was
tried first and rejected: it keeps the commits but leaves them pointing at the
old paths, so a per-file log stops at the merge showing one commit.
