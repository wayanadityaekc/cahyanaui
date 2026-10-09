# cahyanaui — Project Rules (monorepo and shared library)

Project-specific. Universal rules live in `CLAUDE-global.md` (this repo holds the **master**; the other repos hold copies, so change it here first, then copy it to each repo).
Last brought up to date: 9 Oct 2026. The old file, which also held a copy of the shared rules, is kept at `docs/archive/CLAUDE.old.md`.

@CLAUDE-global.md

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

**`apps/cue` is a stale snapshot** (last changed 30 Sep 2026, 385 entries differ from the live `CUE` repo, nothing builds or imports from it). `apps/villas` is the only app that uses `@cahyana/ui` and also differs from the live villa repo (134 entries). Whether to delete or refresh them is Wayan's decision, not made yet.

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
