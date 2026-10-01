# CLAUDE.md: Cahyana Dev standards

Applies to every repo and every future website. Owner: Wayan (Product Owner).
Style of this file: checklist, dry. Follow it literally. Ask when something is not covered.

## 1. Order of work (do not reorder)

- [x] Phase 1, audit (read-only): audit `ubud-private-villas` and `salia-makeup` against the CUE rules in section 3. Report only. Change nothing. Wait for approval.
- [ ] Phase 2, fix: bring both repos in line with CUE. One rule at a time, one work order per rule. Run tests and check endpoints/pages after each. Commit, then push to the feature branch (see section 2).
- [ ] Phase 3, library: only after CUE, `ubud-private-villas` and `salia-makeup` are all consistent, move the shared components, blocks and layouts into the Cahyana UI repo (name: Cahyana UI, no dash; local folder `cahyanaui`).
- [ ] Phase 4, dashboards: `cahyana-dashboard` and Salia's dashboard get the same treatment, but only after Phases 1-3 are done. When Phase 3 is finished, stop and ask Wayan: "Do you want to proceed with the dashboards?" Do not continue automatically.
- [ ] Separate later task: chase the gap between `ubud-private-villas` and Cahyana Ubud Experience (CUE). Do this after style consistency is finished, not before.
- [ ] `cahyana-api` (backend) audit is parked. Do not start it until Wayan says so.

Source of truth: CUE (`CUE-main`). Its syntax audit is finished. If another repo differs from CUE, the other repo changes, not CUE.

## 2. Working rules

- [ ] Audit first, then fix. Never fix during an audit.
- [ ] Report format: rule, hits/files, where most of it is, likely false positives or keep-as-is.
- [ ] Delete nothing (files, endpoints, components) without Wayan's OK.
- [ ] Push work-order commits to the feature branch `claude/work-tree-validation-vqexsf` as you go (standing approval, that branch is not live). Never push to `main` until Wayan explicitly says so.
- [ ] When a rule cannot be applied cleanly (for example a loop with `return`/`break`), list it separately and do it in its own work order.
- [ ] When a new feature or new site is built, walk Wayan through the QA checklist (section 7) step by step and remind him of small items he may forget.

## 3. Syntax rules (from the finished CUE audit)

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

## 4. Stack

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

## 5. Typography

- [ ] Inter only, for headings and body. No second typeface.
- [ ] Default for every repo and every future site. Follow CUE. Change only when Wayan explicitly asks.

## 6. Animation

- [ ] Framer Motion is the only animation library. Popups, modals, dropdowns, page and section transitions must animate smoothly, not appear abruptly.
- [ ] On every new feature with an interaction, check whether Framer Motion applies. If it does, ask Wayan once: "Should this use Framer Motion?" If yes, add it.
- [ ] Audit `ubud-private-villas` and `salia-makeup` to confirm they consume Framer Motion consistently.
- [ ] Known issue in CUE: some interactions (for example a popup on click) appear abruptly. Flag to Wayan; he will double-check CUE later.
- [ ] Every popup locks background scroll.

### Mobile inputs and popups (standing rules, Oct 2026, brief #16)

- [ ] No iOS zoom when a field is tapped. Every page mounts the iOS-only viewport clamp (`IosZoomFix`: adds `maximum-scale=1` on iPhone and iPad only; Android keeps pinch-zoom; never `user-scalable=no`). Fields under 16px are allowed only while that clamp is mounted in the root layout.
- [ ] Every popup, dialog, modal, drawer, bottom sheet, chat panel and full-screen overlay locks background scroll while open and releases it when closed (`useBodyLock`: a class on both html and body). A popup opened on top of another must not release the lock of the one underneath.
- [ ] New popup = verify in a browser: open it, scroll over it, the page behind must not move; close it, the page scrolls again. Check the iOS clamp on a real iPhone (headless browsers cannot reproduce iOS focus zoom).

## 7. QA checklist (draft: extend it from CUE, then ask Wayan to approve)

Claude Code: read CUE, propose the full checklist, mark each item Must-have or Nice-to-have, and wait for approval. Starting list:

Must-have
- [ ] Payment flow works end to end and matches CUE
- [ ] Favicon and browser tab icon present and correct
- [ ] Font, colors and animation match CUE (sections 5 and 6)
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

## 8. Library-first (Cahyana UI)

- [ ] Every new piece of UI goes into Cahyana UI first, then the site consumes it.
- [ ] Three layers: templates, blocks, components. Same shape as shadcn/Flowbite/Preline, but Cahyana's own build.
- [ ] Library holds the presentational shell; each site passes its own fields, handlers and validation.
- [ ] Do not build a component inside a site that belongs in the library.
