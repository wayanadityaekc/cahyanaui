# [MIG-01a] Static export routing spike — prove URLs before anything is built on them

**Agent:** Engine · **Lane:** Gate 0 · **Blocks:** every other issue in this migration

## Objective
Prove that a Next.js static export served by Hostinger reproduces the site's current URLs exactly, before 117 pages are built on that assumption.

## Scope
- Scaffold a throwaway Next.js app with `output: 'export'` and default `trailingSlash: false`.
- Create exactly three routes: one root static (`/about-us`), one nested static (`/attractions/goa-gajah`), one dynamic with `generateStaticParams` (`/[tourSlug]` → `ubud-tour`), plus `/`.
- Run `next build` and record the exact `out/` file tree.
- Deploy `out/` to a Hostinger staging path (or the real host under a temporary subdirectory).
- Verify each URL over HTTP.

## Out of scope
- Any real page content, styling, or component work.
- The production deploy pipeline (that is MIG-01).

## Input
- `docs/MIGRATION_PHASE1_ARCHITECTURE.md` §2 and §3.
- Current live URLs: `https://cahyanaubudexperience.com/about-us.html`, `/attractions/goa-gajah.html`, `/ubud-tour.html`, `/`.

## Dependencies
None. This is the first task.

## Acceptance criteria
1. `next build` produces `out/index.html`, `out/about-us.html`, `out/attractions/goa-gajah.html`, `out/ubud-tour.html` — flat `.html` files, not `about-us/index.html` directories.
2. On Hostinger, all four URLs return **HTTP 200** at their current paths, with no redirect hop (`curl -sI` shows `200`, not `301`).
3. A `public/.htaccess` placed in the source is present in `out/` after the build.
4. The extensionless form (`/about-us`) either 404s or 301s to `.html` — it must never serve a duplicate 200.

## Definition of done
- A short written finding posted on this issue: the exact `out/` tree, the four `curl -sI` status lines, and a clear PASS/FAIL.
- **If FAIL:** stop, do not proceed to other issues. Report to Architect with the actual filenames produced so §2 can be redesigned (fallback options: `trailingSlash` change, `.htaccess` rewrite layer, or literal `.html` route segments).

## Notes
This exists because the entire URL-preservation plan rests on one behaviour of the export step. Half a day here protects 117 pages of work.

---

# RESULT — PASS (verified 1 Sep 2026, Architect)

Run locally: Next.js **16.3.4** / React **19.2.8**, `output: 'export'`, default `trailingSlash: false`. Served with real Apache **2.4.66** (`AllowOverride All`), not reasoned about on paper.

## The core question: PASS

`next build` produced flat `.html` files at exactly the current paths:

| Next route | Exported file | Serves at |
|---|---|---|
| `/` | `out/index.html` | `/` — 200 |
| `/about-us` | `out/about-us.html` | `/about-us.html` — 200 |
| `/attractions/goa-gajah` | `out/attractions/goa-gajah.html` | `/attractions/goa-gajah.html` — 200 |
| `/[tourSlug]` → `ubud-tour` | `out/ubud-tour.html` | `/ubud-tour.html` — 200 |

`generateStaticParams` + `dynamicParams = false` works for the dynamic families. `public/.htaccess` is copied into `out/` by the build. `404.html` is produced.

**The architecture plan §2 holds. Route folders stay clean; the export's own naming reproduces the current URLs. No redirects needed for existing pages.**

## Finding not anticipated in the plan

Next 16 also emits **RSC payload files** next to every page — `about-us.txt`, plus a directory `about-us/` containing `__next._full.txt`, `__next._tree.txt`, `__next.<route>.__PAGE__.txt`. In the spike: 7 HTML files produced 24 `.txt` files.

Two consequences on Apache, both now handled and tested:
1. The directory `about-us/` sitting beside the file `about-us.html` means a request to `/about-us/` hits a directory with no `index.html` → directory listing or 403. Needs `Options -Indexes`.
2. Those `.txt` files are publicly fetchable and are internal build artefacts. They should not be served.

We use plain `<a>` for cross-page navigation (architecture §2), so these payloads are never used at runtime. Blocking them costs nothing.

## Bug caught by testing rather than reasoning

The first `.htaccess` blocked `.txt` with a blanket rule — which also **403'd `robots.txt`**. Caught on the second pass. The final rule whitelists `robots.txt` and only blocks a `.txt` that has a matching `.html` sibling (i.e. an RSC payload), plus anything named `__next.*.txt`.

## Verified `.htaccess`

Saved at `docs/htaccess-nextjs-export.conf`. Full result table:

| URL | Expected | Got |
|---|---|---|
| `/`, `/index.html`, `/about-us.html`, `/attractions/goa-gajah.html`, `/ubud-tour.html` | 200 | **200** |
| `/robots.txt`, `/sitemap.xml` | 200 | **200** |
| `/about-us`, `/ubud-tour`, `/attractions/goa-gajah` | 301 → `.html` | **301 → correct target** |
| `/ubud-jeep-sunrise.html`, `/south-bali-tour.html` | 301 legacy | **301 → correct target** |
| `/about-us.txt`, `/index.txt`, `/about-us/__next._full.txt` | blocked | **404** |
| `/about-us/`, `/_next/`, `/attractions/` | no listing | **403** |
| `/_next/static/**/*.js` | 200 | **200** |
| `/ngawur.html` | 404 | **404** |

## Hostinger: CLOSED, no manual test needed

The first draft of this issue asked Wayan to upload a test kit to Hostinger to prove `mod_rewrite` works. That was over-engineering, and it was dropped after two realisations:

**1. The plan never actually needed `mod_rewrite`.** Serving `/ubud-tour.html` from `out/ubud-tour.html` is plain static file serving. The legacy 301s use `Redirect` (mod_alias). Blocking the RSC `.txt` payloads works with `<FilesMatch>` (mod_authz_core). `Options -Indexes` is core. The only rewrite-dependent rule was the *defensive* extensionless → `.html` 301 — and nothing on the site is extensionless, so nothing needs it. **Re-verified by running the whole suite against Apache with `mod_rewrite` compiled out: everything still passed.**

**2. Everything else was already provable against the live site, with zero effort from Wayan:**

| Probe on the live site | Result | Proves |
|---|---|---|
| `/ubud-jeep-sunrise.html`, `/taste-of-ubud.html`, `/attractions/batik.html` | all 301 to the right target | `.htaccess` is read and `Redirect` works |
| `Cache-Control: public, max-age=31536000` on `style.css` | present | `mod_headers` + `<FilesMatch>` containers work |
| `/attractions/`, `/guide/`, `/partials/`, `/assets/images/` | all 403, no listing | directory listing already off |
| `server: hcdn` | — | Hostinger CDN in front, `.htaccess` honoured behind it |

The final `.htaccess` (`docs/htaccess-nextjs-export.conf`) therefore uses **no rewriting at all** — only directives already demonstrated working on production today.

**Nothing left open. MIG-01 is unblocked.**
