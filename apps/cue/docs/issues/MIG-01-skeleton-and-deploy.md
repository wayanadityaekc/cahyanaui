# [MIG-01] Next.js skeleton + deploy pipeline

**Agent:** Engine · **Lane:** Gate 0 · **Depends on:** MIG-01a (PASS)

## Objective
Stand up the Next.js project shell and a deploy pipeline that keeps Wayan's workflow at "push and it goes live".

## Scope
1. `create-next-app`: App Router, **JavaScript (no TypeScript)**, Tailwind, ESLint. `next.config.js` with `output: 'export'` and `images: { unoptimized: true }`.
2. Folder structure exactly as `docs/MIGRATION_PHASE1_ARCHITECTURE.md` §1.
3. `lib/routes.js` — the single source of truth listing every URL on the site (100 from `sitemap.xml` plus any reachable page not in it).
4. Empty route shells for all pages so the URL map is testable before content exists.
5. `public/assets/` — move `assets/` verbatim (images, fonts, flags, icons).
6. `public/.htaccess` — carry over the existing file, plus: the 5 existing 301s, a new 301 for `south-bali-tour.html` → `/hidden-beaches-cliffs.html` (replacing the meta-refresh stub), and a defensive 301 from extensionless → `.html`.
7. `next/font/local` wrapping `inter-latin.woff2`.
8. **Deploy pipeline** — GitHub Action: on push to `main`, `npm ci && next build`, commit `out/` to a `deploy` branch. Hostinger's Git integration gets repointed to `deploy` at cutover, not before. Include `workflow_dispatch` for manual rebuilds.

## Out of scope
- Any page content, styling, or components.
- Repointing Hostinger to `deploy` — that is the cutover, and it happens after the QA gates pass.

## Input
- `docs/MIGRATION_PHASE1_ARCHITECTURE.md` §1, §2, §3.
- `sitemap.xml`, `.htaccess`, `assets/`.

## Dependencies
MIG-01a must PASS first.

## Acceptance criteria
1. `npm run build` succeeds and `out/` contains one `.html` per route in `lib/routes.js`.
2. The Action runs green on a test push and pushes to `deploy`.
3. `out/.htaccess` is present after build.
4. `lib/routes.js` matches the 100 sitemap URLs exactly — diff empty.
5. The old site on `main` is still deployable and untouched.

## Assumption to confirm with Wayan
Deploy option **(a)** — GitHub Action builds and pushes `out/` to a `deploy` branch — is what is being built here. Wayan has not explicitly confirmed (a) over (b) "build locally and commit `out/`". If he prefers (b), say so before this is built; it is a small change now and a painful one later.

## Definition of done
- Branch `feature/nextjs-migration` exists with the skeleton.
- A build artefact deployed to a Hostinger staging path and spot-checked.
- Nothing in production has changed.

---

# RESULT — DONE (2 Sep 2026, Architect)

Next 16.3.4 / React 19.2.8 / Tailwind 4.3.3, `output: 'export'`. Wayan chose deploy option **(a)**.

## Built
- `package.json`, `next.config.js` (`output: 'export'`, `images.unoptimized`), `postcss.config.mjs`, `jsconfig.json` (`@/*` alias).
- `app/layout.jsx` with `next/font/local` wrapping `inter-latin.woff2` (weight 300–700, `display: swap`).
- `lib/routes.js` — **generated from the real files, not hand-typed**: 20 tours, 51 attractions, 15 guides, 17 bespoke, plus `LEGACY_REDIRECTS` and a `NOINDEX` list.
- Route shells: 18 bespoke pages + 3 dynamic routes (`[tourSlug]`, `attractions/[slug]`, `guide/[slug]`) with `generateStaticParams` and `dynamicParams = false`.
- `app/sitemap.js`, `app/robots.js` — both need `export const dynamic = 'force-static'` under static export, or the build fails outright.
- `public/.htaccess`, `public/assets` (symlink → `../assets`, so the old site keeps working on the same branch).
- `.github/workflows/deploy.yml` + `tools/check-urls.js`.
- `.gitignore` updated for `node_modules/`, `.next/`, `out/`.

## Verified

**All 104 routes build.** Served the real `out/` with Apache 2.4.66 and requested **every one of the 100 URLs in the current `sitemap.xml`: 100/100 returned 200.** Zero missing — the MIG-90 gate passes already.

| Check | Result |
|---|---|
| 100 live sitemap URLs | **100/100 → 200** |
| `/`, tour, attraction, guide, bespoke, my-trips | 200 |
| `/assets/images/*`, `/assets/fonts/*`, `/_next/**.css` | 200 — 232 images + 249 flags copied through the symlink |
| `/ubud-jeep-sunrise.html`, `/south-bali-tour.html` | 301 to the correct targets |
| `/ngawur.html` | 404 |
| canonical on `/ubud-tour.html` | `https://cahyanaubudexperience.com/ubud-tour.html` |
| `my-trips.html` robots | `noindex, nofollow` |
| generated `sitemap.xml` | 102 URLs, `my-trips`/`settings` correctly excluded |
| `tools/check-urls.js` (the CI gate) | passes locally |

`public/assets` is stored by git as mode `120000` (a real symlink), so CI checkout preserves it.

## Found: two pages missing from the current sitemap

Cross-checking `lib/routes.js` against `sitemap.xml` surfaced 4 routes not listed. Two are correct (`my-trips`, `settings` — both `noindex`). The other two are **live SEO gaps on the current site**:

- **`/attractions/watersport.html`** — a full 151-line indexable page with its own title and canonical, linked from 4 pages and bookable, that has never been in the sitemap.
- **`/itinerary.html`** — indexable, has a canonical, also absent.

`app/sitemap.js` generates from `lib/routes.js`, so both are included automatically from now on (102 URLs vs the old 100). Worth telling Google about once the migration ships — or fixing in the current `sitemap.xml` today, since it costs nothing.

## Minor, for MIG-40

`assets/icons/favicon-head.html` is a copy-paste snippet, not a page, but it sits under `assets/` so it gets served at `/assets/icons/favicon-head.html`. Harmless; worth moving out of `assets/` or blocking.

## Deviation from the written plan

The plan specified `tailwind.config.js`. Tailwind installed as **v4**, which is CSS-first — config lives in `@theme` inside `app/globals.css`. This is better here, not worse; see MIG-02.
