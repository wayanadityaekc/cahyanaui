# Phase 1 — Architecture Plan
## Cahyana Ubud Experience: vanilla HTML/CSS/JS → Next.js + React + Tailwind

Author: Architect
Status: **Plan complete. Decisions Q1–Q4 answered by Wayan. Awaiting explicit go-ahead before any build work.**
Source brief: `MIGRATION_BRIEF.md`

---

## Decisions locked by Wayan

| # | Decision | Effect on this plan |
|---|---|---|
| **Q1** | **Stay on Hostinger** → Next.js **static export** (`output: 'export'`) | Drives §2, §6, §9, §12. No SSR, no ISR, no rewrites, no middleware, no route handlers. Adds a build step (§3) |
| **Q2** | **No TypeScript** → plain JavaScript (`.jsx`) | No `tsconfig`, no type build. JSDoc on `lib/api.js` only |
| **Q3** | **Reviews stay login-only** | Port the existing gate exactly. No guest-typed booking-reference path. Closes the brief's parked item |
| **Q4** | **Payment waits on Xendit approval** | This migration ports the booking-**request** flow as it is today. Xendit is a separate project once registration is accepted. §11 records the hook point so it drops in later without rework |

Still open, does not block the build: content file format (§1) and the deploy pipeline choice (§3).

---

## 0. What I inspected first

Everything below is derived from reading the actual repos, not assumed.

**Frontend (`CUE/`)**
- 117 HTML files: 39 at root, 51 in `attractions/`, 16 in `guide/` (incl. `_template.html`), 10 partials, 1 favicon head snippet. Of the root files, 20 are bookable programme pages and 1 (`south-bali-tour.html`) is a meta-refresh redirect stub.
- `script.js` — 6,088 lines, 303 KB, ~120 functions, one `initPage()` calling 55 init functions.
- `data.js` — 488 lines: `prices`, `CHARTER`, `transport`, `TICKETS`, `TOUR_TICKETS`, `tourExclusive`, `EXCLUSIVE_FEE`, `SURCHARGE_FACTOR`, `TRANSFER_ZONE`, `ITEM_ZONE`, `CURRENCIES`, `CUR_RATE`, `CUR_SYMBOL`, `REFERRAL`, `PROMO`.
- `style.css` — 9,919 lines, 256 KB, ~1,371 rules, 802 distinct class names, 74 media queries, 7 keyframe sets, a full design-token layer in `:root`.
- Assets: 232 images (31 MB — 129 webp, 100 jpg), 1 self-hosted font (`inter-latin.woff2`, 48 KB), ~250 country flag SVGs.
- 455 `<img>` tags, 90 inline `style="…url(…)"` backgrounds, 10 CSS `background-image` rules.
- 67 pages carry `<base href="/">`; every internal link ends in `.html`.
- `.htaccess` holds 5 existing 301s, gzip config, and cache lifetimes.
- `sitemap.xml` — 100 URLs, hand-maintained.
- Build tooling: `tools/sync-prices.js`, `tools/sync-schema.js`, `tools/audit.js`. No npm, no build step, no CI. Deploy = push to GitHub, Hostinger serves it.

**Backend (`cahyana-api/`)**
- ⚠️ **The local checkout is 33 commits behind `origin/main`.** The `server.js` on disk (216 lines) is not what is deployed. `origin/main:server.js` is 1,271 lines. I verified against the live API: `GET /api/test` returns `"Cahyana API is running!"` (origin/main) not `"API Cahyana jalan!"` (local disk).
- Real deployed surface: `/api/inquiry`, `/api/account`, `/api/account/login`, `/api/account/session`, `PATCH /api/account`, `/api/bookings/mine`, `/api/reviews` (GET/POST), `/api/reviews/verify`, `/api/reviews/summary`, `/api/reviews/pending`, `/api/reviews/:id/approve`, `/api/accounts/count`, `/api/migrate`, plus admin-only endpoints behind `requireAuth`, plus a `node-cron` post-trip review email.
- DB (Postgres/Railway): `inquiries`, `accounts`, `account_sessions`, `reviews`, sequence `booking_ref_seq`.
- Live probe results: `/api/test` 200, `/api/reviews` 200 `[]`, `/api/accounts/count` 200 `{"count":4}`, `/api/account/session` 401, `/api/bookings/mine` 401, `/api/inquiries` 401. Auth and rate limiting are working.

---

## 1. Folder structure

Next.js App Router, static export. Single frontend repo; the backend stays its own repo.

```
CUE/
├── app/
│   ├── layout.jsx                    root html/body, fonts, providers, Navbar/TripBar/Footer
│   ├── page.jsx                      /                    → out/index.html
│   ├── globals.css                   Tailwind directives + preserved design-system layer
│   ├── sitemap.js                    → out/sitemap.xml
│   ├── robots.js                     → out/robots.txt
│   ├── not-found.jsx                 → out/404.html
│   │
│   ├── (marketing)/                  route group, no URL effect
│   │   ├── about-us/page.jsx         → out/about-us.html
│   │   ├── contact/page.jsx
│   │   ├── faq/page.jsx
│   │   ├── bali-guide/page.jsx
│   │   └── all-reviews/page.jsx
│   ├── (listing)/
│   │   ├── tour/page.jsx
│   │   ├── activities/page.jsx
│   │   ├── destinations/page.jsx
│   │   ├── transfer/page.jsx
│   │   ├── charter/page.jsx
│   │   └── airport-transfer/page.jsx
│   ├── (account)/
│   │   ├── my-trips/page.jsx
│   │   ├── itinerary/page.jsx
│   │   └── settings/page.jsx
│   ├── (legal)/
│   │   ├── terms-conditions/page.jsx
│   │   ├── privacy-policy/page.jsx
│   │   └── cancellation-policy/page.jsx
│   │
│   ├── [tourSlug]/page.jsx           20 tour programme pages, generateStaticParams
│   ├── attractions/[slug]/page.jsx   51 attraction + destination pages
│   └── guide/[slug]/page.jsx         15 guide articles
│
├── components/
│   ├── layout/      Navbar, Footer, TripBar, AccountPanel, MobileMenu
│   ├── cards/       ExperienceCard, GuideCard, DriverCard, ReviewCard, CharterHourCard, StopCard
│   ├── booking/     BookSidebar, BookingForm, BookConfirmModal, BookBar, DatePopup, TourTypeToggle
│   ├── trip/        ItineraryBuilder, MyTripsCart, SuggestedPlan, TripDetailsModal
│   ├── reviews/     ReviewsStrip, ReviewModal, RatingStars
│   ├── search/      HeroSearch, HeroPlanSheet, GuestPicker, StayPicker, CurrencyPicker
│   ├── ui/          Select, DateField, Modal, BottomSheet, Slider, ZoneTabs, Accordion, InfoPopover, Img
│   └── sections/    Hero, SubHero, Section, InfoList, StopList, GuideLayout, RelatedGrid
│
├── content/
│   ├── tours/       one file per tour programme (20)
│   ├── attractions/ one file per attraction/destination (51)
│   ├── guides/      one file per guide article (15)
│   └── shared/      drivers, faq, promo, navigation, related-map, zones
│
├── lib/
│   ├── api.js       fetch wrappers for cahyana-api (JSDoc-typed)
│   ├── pricing.js   display formatting ONLY — no price maths
│   ├── schema.js    JSON-LD builders per page type
│   ├── routes.js    single source of truth for every URL in the site
│   └── storage.js   localStorage helpers, SSR-safe
│
├── state/           TripPrefsProvider, ItineraryProvider, AccountProvider, ReferralProvider
├── public/
│   ├── assets/      images, fonts, flags, icons — moved verbatim
│   └── .htaccess    all redirects + cache rules, copied into out/ on build
├── tailwind.config.js
├── next.config.js
└── package.json
```

**Why `content/` exists.** 86 of the 117 files are the same template with different content. Hand-writing 117 page components would produce 117 places to fix a bug. Extracting content into data files and rendering it through 3 templates is the point of the migration — and it is exactly the "repetitive page-building work" Phase 2 is scoped for.

**Still open — content file format.** MDX (prose stays readable, Voice can edit it directly) vs plain JS objects (structured, validatable). Recommendation: **MDX for `guide/` articles** (long prose), **JS objects for tours and attractions** (they are structured: stops, included/excluded lists, meta, facts). Does not block MIG-00/01/02, so the build can start before this is settled.

---

## 2. Routing plan

**Rule: every current URL keeps its exact path, `.html` extension included. Zero redirects for existing pages.**

The static export does this for free. With `output: 'export'` and `trailingSlash: false` (the default), Next writes one flat `.html` file per route:

| Next route | Exported file | Live URL — unchanged |
|---|---|---|
| `/` | `out/index.html` | `/` |
| `/ubud-tour` | `out/ubud-tour.html` | `/ubud-tour.html` |
| `/about-us` | `out/about-us.html` | `/about-us.html` |
| `/attractions/goa-gajah` | `out/attractions/goa-gajah.html` | `/attractions/goa-gajah.html` |
| `/guide/ubud` | `out/guide/ubud.html` | `/guide/ubud.html` |

So the route folders stay clean (`app/about-us/`), and the export's own file naming reproduces the current URL structure exactly. Nothing to configure, nothing to redirect.

✅ **Verified, not assumed** — `[MIG-01a]` was run on 1 Sep 2026: Next 16.3.4 / React 19.2.8, built with `output: 'export'`, served with real Apache 2.4.66. All four URL shapes returned 200 at their current paths. Full result table in `issues/MIG-01a-static-export-routing-spike.md`. **Nothing left open:** the `.htaccess` was rewritten to use no `mod_rewrite` at all and re-verified with that module disabled, and every directive it does use was probed working on the live site.

⚠️ **What the spike turned up that this plan had not anticipated.** Next 16 emits **RSC payload files** beside every page: `about-us.txt`, plus a directory `about-us/` holding `__next._full.txt`, `__next._tree.txt`, `__next.<route>.__PAGE__.txt`. Seven pages produced 24 `.txt` files. Since cross-page navigation uses plain `<a>`, these are never used at runtime — but they are publicly fetchable build artefacts, and the `about-us/` directory sitting beside `about-us.html` makes `/about-us/` resolve to a directory with no index. Both are handled by the verified `.htaccess` (`docs/htaccess-nextjs-export.conf`): `Options -Indexes`, and a rule that blocks a `.txt` only when it has a matching `.html` sibling — **with `robots.txt` whitelisted**, because the first attempt blocked it and the test caught it.

**Internal links use plain `<a href="/ubud-tour.html">`, not `<Link>`.**
The deployed files are `.html`; a `<Link href="/ubud-tour">` would point at a path that does not exist on Apache. Using `<a>` means full page loads between pages — which is exactly what the site does today, so it is not a regression. The big speed win of this migration is killing the `loadPartials()` fetch waterfall, not soft navigation. `<Link>` is still used inside the app where both ends are guaranteed (none currently).

**`.htaccess` (verified, `docs/htaccess-nextjs-export.conf`)** does four jobs: 301s extensionless → `.html` so no duplicate URL is ever indexed; keeps the legacy redirects; blocks the RSC `.txt` artefacts while whitelisting `robots.txt`; and turns off directory listings. Tested against real Apache — see MIG-01a.

**Carried over unchanged:**
- The 5 existing 301s in `.htaccess` (`/ubud-jeep-sunrise.html`, `/taste-of-ubud.html`, `/ubud-cooking-market.html`, `/attractions/celuk-silver.html`, `/attractions/batik.html`). Static export has no `redirects()`, so `.htaccess` remains their home — it lives in `public/` and is copied into `out/` by the build.
- `south-bali-tour.html` — currently a `<meta http-equiv="refresh">` stub → `/hidden-beaches-cliffs.html`, `noindex, follow`, canonical set, deliberately kept out of the sitemap. The only such stub in the repo. Convert it to a proper 301 in `.htaccess`; the URL must keep responding.
- `?from=<tour name>` on attraction links (`initStopContext` → `applyTourContext`) — read client-side via `useSearchParams` in a client component. The page stays static; only the reading component is client-side.
- `#anchor` navigation (`#cat-*`, `#gcat-*`, `#booking`, `#flag-*`).
- `?token=` magic-link capture on `my-trips.html` (`captureMagicToken`). **The sign-in and booking emails sent by the live API hardcode this URL**, so `my-trips.html` must not move.
- `og:url` and `canonical` values, which already hardcode `.html`, and the `item` URLs inside every BreadcrumbList.
- `/guide/_template.html` must **not** become a route. Its `Disallow` line in robots can then be dropped, since the URL will 404 rather than exist.

---

## 3. Deploy pipeline

⚠️ **This is the one workflow change Wayan will feel every day, and it follows directly from Q1.**

Today: edit a file → push to GitHub → Hostinger serves it. Live in seconds, no build.
With Next.js there is now a **build step**. `app/`, `components/`, `content/` are source — they are not servable. Only `out/` is.

Two ways to keep "push and it goes live":

- **(a) GitHub Action, recommended.** Push to `main` → the Action runs `npm ci && next build` → commits `out/` to a `deploy` branch → Hostinger's Git integration is pointed at `deploy` instead of `main`. Wayan's workflow stays "push and wait ~2 minutes". Nothing to install locally.
- **(b) Build locally, commit `out/`.** Needs Node on Wayan's machine and the discipline to never forget the build. More ways to ship a stale site.

Recommendation: **(a)**. It also gives a free place to hang the automated release gates (§14 MIG-90/91/92) so a broken URL map can never reach production.

**Two things that get simpler:**
- `PARTIALS_VERSION` and the `?v=430` ritual on every page **disappear**. Next fingerprints its own asset filenames, so cache-busting becomes automatic. The existing `.htaccess` cache rules (1 year for CSS/JS, no-cache for HTML) stay correct and become correct *by construction*.
- `tools/sync-prices.js` and `tools/sync-schema.js` are retired (§8, §9).

**Price freshness (consequence of static export):** a price change on the API does not reach the site until the next build. Two mitigations, both in the plan: prices are also fetched client-side at runtime (§9), so visitors always see current numbers; and the Action gets a `workflow_dispatch` button plus an optional nightly rebuild so the crawler-visible HTML stays fresh too.

---

## 4. Component breakdown

**Shared components** (used on 2+ pages — these are the ones that must be identical everywhere, per the Atelier repeated-component rule):

| Component | Replaces | Notes |
|---|---|---|
| `Navbar` | `partials/navbar.html` + `initNavbar` | 105 pages |
| `Footer` | `partials/footer.html` | 105 pages |
| `TripBar` | `initTripBar` | booking pages → guests/pickup; other pages → `PROMO` |
| `ExperienceCard` | `.experience__card` | the most repeated component on the site. One implementation, no variants |
| `CardSlider` | `initTourSlider` + `.slider-holder` | slides vs grid-wraps by context, per CLAUDE.md |
| `BookSidebar` | `initBookSidebar` | the 2-column layout on bookable detail pages |
| `BookingForm` + `BookConfirmModal` | `partials/booking.html`, `book-confirm.html`, `initBooking`, `initBookingConfirm` | |
| `BookBar` | `initBookBar` | mobile sticky price + CTA |
| `Select` / `DateField` | `makeFieldEnhancer` (364 lines) | desktop dropdown, mobile bottom sheet. Highest-value single refactor in the migration |
| `ReviewsStrip` / `ReviewModal` | `initReviews`, `openReviewModal` | |
| `ZoneTabs` | `initZoneAnchors` | scrollspy; keep the `getBoundingClientRect` fix |
| `HeroSearch` / `HeroPlanSheet` | `initHeroSearch`, `initHeroPlanSheet` | |
| `GuideLayout` | guide article template | sidebar + cattabs + "You might also like" |
| `InfoList` | `.info__list--yes/--no` | radio-marker checklist |
| `Img` | plain `<img>` slots | see §12 |

**Page-local content** stays in `content/` and renders through 3 templates: `TourPage`, `AttractionPage`, `GuidePage`. Bespoke pages (home, about-us, contact, faq, itinerary, my-trips, settings, charter, transfer, airport-transfer, the 3 listing pages, 3 legal pages, all-reviews, bali-guide) each get their own component composed from shared parts.

**Server vs client boundary.** Default is a Server Component; `"use client"` goes on the *leaf* that needs interaction, never the page. A tour page is a statically rendered document with a client `BookSidebar`, client `CardSlider`, and client `TourTypeToggle` inside it. This keeps the HTML crawlable and the JS bundle small.

**Fonts:** `next/font/local` wrapping `inter-latin.woff2`. It emits the preload and `font-display` automatically, replacing the hand-written `<link rel="preload">` on every page. Works fine under static export.

---

## 5. State management

Today: module-level `let` globals + localStorage + imperative re-render calls (`renderPrices()`, `cselRefreshAll()`). That maps cleanly onto React Context — no Redux or Zustand needed, and Context stays readable for Wayan.

| Provider | Holds | localStorage keys (unchanged) |
|---|---|---|
| `TripPrefsProvider` | currency, guests, stay area, date range | `cue_currency`, `cue_guests`, `cue_stay`, `cue_date_from`, `cue_date_to` |
| `ItineraryProvider` | the My Trips cart (days / transfers / charters) | `cue_itinerary_v1`, `cue_itn_synced` |
| `AccountProvider` | session token, account, `hasUpcoming` | `cue_token` |
| `ReferralProvider` | applied referral code + percentage | `cue_referral` |

All four mount once in `app/layout.jsx`. Keys stay identical, so **a returning visitor's cart, login, and currency survive the cutover.**

⚠️ **Hydration is the top visual risk.** localStorage cannot be read during render — it does not exist at build time, and reading it in the first client render causes a hydration mismatch. Every provider must:
1. render the statically built default (USD, guests unset, empty cart),
2. read localStorage in `useEffect`,
3. then re-render.

That means one frame of default state on load. The current site behaves the same way (static prices in the HTML, then `renderPrices()` overwrites them), so it is not a regression — but it has to be built deliberately or it becomes flicker and layout shift. The existing anti-CLS `min-height` values (booking 480px, footer 688/487px, search 470px) were measured for exactly this and should be carried over.

**Session persistence stays exactly as-is:** bearer token in localStorage, `Authorization: Bearer`, `/api/account/session` on load, magic-link `?token=` capture. No cookie or NextAuth rework — the brief says migrate as-is, and static export has no server to hold a session anyway.

---

## 6. Tailwind styling approach

The constraint is pixel-identity across 9,919 lines of hand-tuned CSS with 74 media queries. A blind utility rewrite is the single biggest risk in this migration.

**Approach: tokens first, utilities second, preserved CSS third.**

**Step 1 — the design system becomes the Tailwind config.** Every `:root` token maps 1:1 into `tailwind.config.js`, so utilities emit the *same values* that exist today:

```
colors:       green, gold, gold-d, gold-l, cta, cta-d, amber, amber-d,
              cream, line, ok, err, ink, muted
fontSize:     display (clamp), h2, h3, strong, body, field, small, label
spacing:      1–6 (8/16/24/32/48/64) + section-gap (2.25rem) + field-h (2.1rem)
maxWidth:     container 1200, container-mid 1080, container-read 720
borderRadius: sm 8, md 12, lg 16, xl 22, pill 999
boxShadow:    sm, md, lg, xl, focus-ring
transition:   dur-fast/dur/dur-slow + ease/ease-out
```

Everything CLAUDE.md protects (amber = stars/prices/badges only; `--color-cta` green = primary buttons only; gold/soft-black = everything else) carries into the config as named tokens, so the rule is enforced by the vocabulary rather than by memory.

**Step 2 — utilities for layout and new markup.** Flex/grid, spacing, sizing, responsive breakpoints. Mechanical and low-risk.

**Step 3 — the complex, hand-tuned parts stay as CSS**, imported into `globals.css` under `@layer components` and scoped to the component that owns them: the field-enhancer panels, the booking sidebar (`--title-shift`, `--side-offset` and their JS measurement), hero/subhero backgrounds, sliders, the `section + section::before` divider machinery, keyframes, and the media queries that do not map onto Tailwind breakpoints cleanly.

Converting those to utilities buys nothing and risks everything. Tailwind is the styling *engine* and the token source of truth; that does not require zero CSS files.

**Step 4 — verification, not eyeballing.** Before/after screenshot diffing at 390 / 768 / 1440 per page, using the headless Chromium already set up per CLAUDE.md. A page is not done until its diff is clean. This is the acceptance criterion on every Phase 2 page issue.

**Pre-existing CSS bugs found during inspection** (fix during migration):
1. `:root` contains `--dur-fast: var(--dur-fast);` — a self-reference, which makes the token invalid. Referenced **30 times across 23 rules**, so those transitions are silently broken today. Should be `0.15s` per the documented scale.
2. `.catsec`'s nested-padding trap is already documented in CLAUDE.md — carry the note into the new config so it is not rediscovered the hard way.

---

## 7. Rendering decision per page / section

With static export there is exactly one server-side mode: **everything is statically generated at build time.** The real decision per page is therefore *what is baked into the HTML vs what the client fills in* — which matters for SEO, and is where the thinking goes.

| Page / section | Baked at build | Filled in client-side | Reasoning |
|---|---|---|---|
| Home `/` | full page + default prices | search form, sliders, tripbar, currency | Crawlable, interactive parts are leaves |
| 20 tour programme pages | full content + Product/Offer schema + default price | price for chosen currency/guests/mode, booking UI | SEO-critical: the price must be in the HTML |
| 51 attraction/destination pages | full content + TouristAttraction schema | related grid prices, `?from=` context | SEO-critical, content is static |
| 15 guide articles | everything | nothing | Pure content |
| Listing pages (tour/activities/destinations) | card grids + anchors + default prices | prices, zone scrollspy | No personalisation in the HTML |
| bali-guide, faq, about-us, legal, contact | everything | contact form only | Static |
| `all-reviews.html` | page shell | review list (`GET /api/reviews`) | Reviews change on moderation, between builds |
| Per-page "Guest Reviews" strip | nothing | `GET /api/reviews?service=…` | Same as today. Optional upgrade — bake approved reviews in so they are indexable — **changes what Google sees, needs Wayan's OK, not in scope now** |
| `itinerary.html` | page shell | the whole builder | 100% localStorage-driven |
| `my-trips.html` | shell only, `noindex` | everything, token-gated | Personal data |
| `settings.html` | shell only, `noindex` | everything | Personal |
| Navbar / Footer / TripBar | **baked into every page** | account state, cart badge, currency | **Kills the `loadPartials()` fetch waterfall — the single biggest page-speed win of this migration** |

---

## 8. URL preservation

**Position: preserve every URL exactly. No slug changes, so no redirect map is needed for existing pages.** §2 explains the mechanism.

Verification is mechanical and belongs in the Definition of Done:
1. Extract every `<loc>` from the current `sitemap.xml` (100) plus every reachable internal `href` across the 117 files → the canonical URL list.
2. Generate the same list from `lib/routes.js` and from the actual `out/` file tree.
3. The diff must be **empty**. A non-empty diff blocks the cutover.
4. Post-cutover: crawl all 100 URLs on the live host and assert 200 — not 301, not 404.

**Fallback if Wayan later wants clean extensionless URLs:** a separate, post-migration project — 100 × 301, canonical updates, sitemap resubmit, a few weeks of ranking churn. Doing it *during* the migration would make it impossible to tell a migration bug from a redirect bug. Not now.

---

## 9. SEO infrastructure

| Today | After |
|---|---|
| Hand-written `<title>`, description, canonical, OG, Twitter in each of 117 files | `export const metadata` / `generateMetadata()` per route, values from `content/` |
| `tools/sync-schema.js` injecting JSON-LD by regex | `lib/schema.js` builders rendered at build time |
| `tools/sync-prices.js` rewriting `data-price` spans + Product schema | Prices fetched from the API at build; schema built from the same values |
| Hand-maintained `sitemap.xml` (100 URLs) | `app/sitemap.js` generated from `lib/routes.js` — cannot drift |
| `robots.txt` | `app/robots.js` |

Both `sitemap.js` and `robots.js` work under static export — they emit static files into `out/`.

Schema types to preserve exactly (counted from the current HTML): `BreadcrumbList` (100), `TouristAttraction` (40), `Product` + `Offer` + `Brand` (31/33/31), `Organization` (32), `Article` (15), `FAQPage` (1, faq.html only), `Event` (2, Kecak), `WebSite`, `TravelAgency`, `Place`, `PostalAddress`.

**Both sync tools get retired.** They exist to keep generated markup in sync with a source of truth across static files — the build does that now. Retiring them removes a whole class of "forgot to run the script" bugs. Keep `tools/audit.js` if it still earns its place.

**FAQ stays centralised on `faq.html` only** — a deliberate decision in CLAUDE.md. Phase 2 must not re-add FAQ blocks to other pages.

**Per-page SEO rules from CLAUDE.md carry over unchanged:** title ≤65 chars, meta description 110–170 chars unique per page, `og:image` = that page's own card/hero, canonical + BreadcrumbList on every page.

---

## 10. Pricing / data flow

**Today (the problem).** `data.js` ships to every visitor and contains the full price book, the ticket cost table, `EXCLUSIVE_FEE = 0.10`, `SURCHARGE_FACTOR = 0.6`, and every referral code with its discount percentage. The browser computes every price (`carPrice`, `exclusivePrice`, `charterPrice`, `surchargeFor`, `applyReferral`, `cartDayPrice`). `POST /api/inquiry` then **stores whatever `price_usd` / `price_idr` the client sends** — confirmed in `origin/main:server.js`; there is no server-side recomputation.

Two separate problems: internal margin and discount codes are public, and a booking's price is client-controlled.

**Target: cahyana-api owns pricing. The frontend displays what the API returns.**

New endpoints on cahyana-api:

```
GET  /api/pricing/catalog?currency=USD&guests=2&stay=ubud
     → every sellable item with its server-computed display price
       (standard + exclusive where applicable), charter tiers, transfer
       routes, active flags, currencies, symbols.
       Never returns EXCLUSIVE_FEE, TICKETS, or the referral table.

POST /api/pricing/quote
     { lines:[{type,service,date,guests,mode,pickup}], currency, stay, referral }
     → per-line prices + total, authoritative. Used by the booking modal,
       My Trips totals, and the mobile book bar.

POST /api/referral/validate  { code }
     → { valid, pct } only. The code table never leaves the server.
```

Change to the existing endpoint:

```
POST /api/inquiry
     → recomputes every line server-side from (service, date, guests, mode,
       stay, referral) and IGNORES any client-supplied price. Returns the
       authoritative price. If it differs from what the guest saw, the
       confirmation shows the server number.
```

**Fetch pattern under static export**

- **Build time** — server components call `GET /api/pricing/catalog` with the defaults (USD, 2 guests, Ubud) and bake the result into the HTML. This replaces `sync-prices.js` and keeps crawler-visible prices and `Product`/`Offer` schema correct with no JS.
- **Runtime** — `TripPrefsProvider` fetches the catalog once per page load and again whenever currency / guests / stay change, then updates every price in place. One request per page, not one per card. **This is also what keeps prices current between builds**, which matters because static export has no ISR.
- **Checkout** — `POST /api/pricing/quote` before opening the confirm modal; `POST /api/inquiry` is the final authority.
- **Cache** — catalog responses are cacheable; quote responses never are.

**Migration path for `data.js`:** it becomes the seed for a `pricing.js` module inside cahyana-api, then optionally real DB tables later so Wayan can change prices without a deploy. `data.js` is deleted from the frontend.

⚠️ **Sequencing:** the pricing endpoints must land **before** Phase 2 page-building starts, or every page gets built against `data.js` and has to be redone. This is the only real dependency in the plan.

---

## 11. Logic flows to migrate as-is

| Flow | Today | After | Notes |
|---|---|---|---|
| **Booking form** | `initBooking` + `initBookingConfirm` (~370 lines), `partials/booking.html`, `book-confirm.html`, `POST /api/inquiry` | `BookingForm` + `BookConfirmModal`, same `lines[]` payload, same endpoint | Prices come from `/api/pricing/quote` instead of local maths. Field order, validation messages, WhatsApp fallback, auto-login-after-booking all identical |
| **Search / filter form** | `initHeroSearch` (~290 lines), `partials/search.html`, mobile sheet via `initHeroPlanSheet` | `HeroSearch` + `HeroPlanSheet` | The behaviour is navigation, not filtering: pick a category → `location.href = selectedHref`. Keep exactly that |
| **Review submission + gate** | Modal only opens from a real booking in My Trips; server requires a session token **and** a `booking_ref` owned by that account, trip date passed, not already reviewed, one review per (booking_ref, service) | `ReviewModal`, unchanged calls to `/api/reviews/verify` and `/api/reviews` | **Login-only, per Wayan's Q3.** Do not touch the gate — all checks are server-side and already correct |
| **Payment flow** | No payment integration exists. "Make Payment" opens the contact/booking modal → `POST /api/inquiry` → email. Terms say book-now-pay-later | Same modal, same endpoint, same button label | **Xendit registration is still pending (Q4).** The hook point is the confirm step in `BookConfirmModal`: when Xendit is approved, it gains a payment handoff after `/api/inquiry` returns a `ref`. Webhooks and callbacks land on cahyana-api, which is a Node service — **static export does not block payments later** |
| **Account identity + session** | `upsertAccount` matches on email **OR** phone, never duplicates; every booking links or creates an account; 24-byte hex token in `account_sessions`; magic-link login by email | Unchanged. `AccountProvider` wraps the same calls | Server logic untouched |
| **Pricing calculation** | Client-side, `data.js` + `script.js` | Server-side (§10) | The one flow that deliberately changes *location*. The maths must produce identical numbers — including `Math.ceil` rounding to whole USD / 10k IDR, `guests > 5 → 2 cars`, per-car vs per-person by category, return transfer ×2 −10% |
| **Currency converter** | `setCurrency`, static `CUR_RATE`, rounding, `localStorage cue_currency`, 5 currencies | `TripPrefsProvider` + server-computed catalog | Same currencies, same symbols, same key. Rate table moves server-side |
| **Referral discount** | `REFERRAL` table in `data.js` (public), `saveReferral`, `applyReferral`, strike-through display | `POST /api/referral/validate` + server-applied discount | Display (old price struck through, new price in amber) identical |

Two flows worth naming precisely so Phase 2 does not guess:
- **Itinerary / My Trips cart** (`initItinerary` ~800 lines, `initMyTripsCart` ~285 lines) is the largest single piece of logic in the codebase. Not on the brief's list, but inseparable from booking and pricing — it gets its own work package.
- **Custom select / date enhancer** (`makeFieldEnhancer`, 364 lines) touches every form on the site. Becomes 2 components and gets the largest line-count reduction.

---

## 12. Link / button / card click-through map

With ~500 interactive targets, an enumerated list would be stale before Phase 2 finishes. The plan is a **generated manifest plus an automated diff**, so preservation is proven rather than asserted.

**Method**
1. Script over the 117 current HTML files + `script.js`, extracting every navigation target: `href`, `data-href`, `window.location` assignments, `window.open`, and card-body click handlers → `docs/link-manifest.json` (source page → target → trigger type).
2. Same extraction against `out/`.
3. The diff must be empty. Runs as a release gate alongside the URL check in §8.

**Categories checked explicitly:**

| Trigger | Behaviour to preserve |
|---|---|
| Experience card (photo/body) | navigates to the detail page; **the tour-type toggle and heart inside the card must not trigger navigation** (`stopPropagation` today) |
| "Book Now" / "Book this program" | opens the booking modal on the same page — does not navigate |
| Book Now on a card | `bookNow()` → date popup → adds to cart → toast |
| Stop link on a tour page | attraction page **with `?from=<tour>` appended** (`initStopContext`) |
| Zone chips (listing pages) | anchor + scrollspy, no filtering |
| Guide cattabs / sidebar | anchors into `bali-guide.html`, not in-page scrollspy |
| Hero search "Go" | `location.href = selectedHref` from the chosen category |
| Navbar Program dropdown | Tours / Experiences / Transfer / Charter |
| Navbar cart badge | `my-trips.html` |
| "Leave a review" CTA | `my-trips.html` — never opens the modal directly |
| Heart toggle in My Trips | adds/removes from cart, no navigation |
| WhatsApp links | `wa.me/61401657862` with the prefilled message intact |
| Footer | all links + payment logos |
| "View all …" pills | listing pages |
| Currency / guests / pickup controls | update global state, never navigate |

---

## 13. Image handling

**Current state:** 232 images / 31 MB. 455 `<img loading="lazy">` with width/height attributes, 90 inline background-image styles, 10 CSS background rules. Heroes and subheroes are deliberately CSS backgrounds (CLAUDE.md). 6 images still exceed 300 KB.

**Decision: do not use `next/image`.**

Under static export there is no image optimisation server, so `next/image` requires `images: { unoptimized: true }`. In that mode it delivers **the same bytes as today** — no resizing, no AVIF/WebP conversion — while still injecting inline styles (`color:transparent`, `object-fit`, and for `fill` an absolutely-positioned wrapper) that override stylesheet rules and can shift layout. It would add pixel-drift risk across 455 image slots and return nothing.

So the images stay plain `<img>`, wrapped in one shared `Img` component that:
- sets `loading="lazy"` and `width`/`height` exactly as today (the current anti-CLS approach already works),
- always emits `height: auto` alongside any `aspect-ratio`, fixing the documented `.guide-lead` trap **once**, centrally, instead of per page,
- takes `priority` for above-the-fold images and emits a `<link rel="preload">` instead,
- keeps a single swap point: if Wayan ever moves to a Node host, `Img` becomes `next/image` in one file rather than 455.

**Backgrounds are unchanged.** Heroes, subheroes, highlight banners, the homepage slider and villa cards stay CSS backgrounds — which is the existing rule and is correct.

**What actually improves page speed here** is not the image component, it is removing the `loadPartials()` waterfall (§7) and Next's automatic asset fingerprinting + code splitting.

**Recommendation, separate from this migration:** compress the 6 oversized images and work through the photo backlog in CLAUDE.md as its own task, before or after the port. Mixing asset changes into the port makes visual diffing useless.

---

## 14. Proposed Phase 2 work packages

Drafted, **not created as issues yet.** Parallel lanes are genuinely independent.

**Gate 0 — must finish before page-building starts**
- `[MIG-01a] Static export routing spike` (Engine) — **first task, blocks everything.** Prove that `next build` under `output: 'export'` produces `out/about-us.html`, `out/attractions/x.html`, `out/index.html`, and that Hostinger serves them at the current URLs. Half a day. If it fails, §2 is redesigned before anything is built on it.
- `[MIG-00] cahyana-api: pricing endpoints` (Engine) — `/api/pricing/catalog`, `/api/pricing/quote`, `/api/referral/validate`; server-side recompute in `/api/inquiry`; port `data.js` into a server pricing module. **Blocks everything that renders a price.**
- `[MIG-01] Next.js skeleton + deploy pipeline` (Engine) — scaffold, routing shells, `lib/routes.js`, `next.config.js` (`output: 'export'`), `public/.htaccess`, and the GitHub Action from §3.
- `[MIG-02] Tailwind config from the design system` (Atelier — Mike or Miki) — tokens into `tailwind.config.js`, `globals.css` layering, the `--dur-fast` fix. **Blocks styled components.**

**Then, in parallel**
- `[MIG-10] Layout shell` (Engine → Atelier) — Navbar, Footer, TripBar, providers. Kills `loadPartials()`.
- `[MIG-11] Shared UI kit` (Engine → Atelier) — Select, DateField, Modal, BottomSheet, Slider, ZoneTabs, Accordion, Img.
- `[MIG-12] Card system` (Engine → Atelier) — one `ExperienceCard`, used everywhere.
- `[MIG-20] Booking flow` (Engine) — form, confirm modal, book bar, sidebar. Depends on MIG-00.
- `[MIG-21] Itinerary + My Trips cart` (Engine) — depends on MIG-00.
- `[MIG-22] Account + session` (Engine) — providers, magic link, settings.
- `[MIG-23] Reviews` (Engine) — strip, modal, gate untouched.
- `[MIG-30] Content extraction: 20 tour programmes` (Voice + Engine) — the repetitive Sonnet work.
- `[MIG-31] Content extraction: 51 attractions` (Voice + Engine).
- `[MIG-32] Content extraction: 15 guides` (Voice + Engine).
- `[MIG-33] Bespoke pages` (Engine + Atelier) — home, about, contact, faq, listings, charter, transfer, legal.
- `[MIG-40] SEO infrastructure` (Voice + Engine) — metadata, schema builders, sitemap, robots; retire both sync tools.

**Release gates (QA)**
- `[MIG-90] URL diff` — §8, must be empty.
- `[MIG-91] Link/click-through diff` — §12, must be empty.
- `[MIG-92] Visual diff` — every page at 390 / 768 / 1440.
- `[MIG-93] Money path` — pricing, currency, referral, booking submit. Per the QA cadence, anything touching money is tested immediately, never batched.

**Rollback.** The current static site stays on `main` and stays deployable throughout; the migration lives on `feature/nextjs-migration`. Cutover is repointing Hostinger's Git integration to the `deploy` branch. Rolling back is repointing it back to `main` — no data migration is involved, since the database and API are untouched and the localStorage keys are unchanged.

---

## 15. Risk register

| Risk | Severity | Mitigation |
|---|---|---|
| ~~Static export filenames do not match the current URLs~~ | ~~High~~ **CLOSED** | `[MIG-01a]` ran 1 Sep 2026, passed against real Apache, and passed again with `mod_rewrite` disabled. Nothing left open |
| Pixel drift across 802 classes | **High** | §6 step 3 (keep hand-tuned CSS), MIG-92 screenshot diffing as the DoD |
| Hydration flicker from localStorage state | **High** | §5 — bake the default, read in `useEffect`, carry over the anti-CLS `min-height` values |
| Pricing rewrite changes a number | **High** | Golden-value test: every item × 5 currencies × guest counts × standard/exclusive, old vs new, must match exactly |
| Building 86 pages against `data.js` before MIG-00 lands | **High** | Gate 0 ordering |
| A stale build ships because someone forgot to build | Medium | §3 option (a) — the Action builds, not a human |
| Prices stale in the HTML between builds | Medium | §10 — client-side catalog fetch on every page load; optional nightly rebuild |
| A URL or click-through silently changes | Medium | §8 + §12 automated diffs as release gates |
| Local `cahyana-api` checkout is 33 commits stale | Medium | `git pull` before Phase 2 — someone will otherwise build against a dead contract |
| Scope creep — redesign sneaking into a port | Medium | Pixel-identity is the acceptance criterion. Improvements get their own issues, after cutover |

---

## 16. Explicitly out of scope

- Any visual redesign. Tailwind is an implementation change.
- Xendit / real payments (Q4 — separate project once registration is approved; §11 records the hook point).
- Clean extensionless URLs (§8).
- Image compression and the photo backlog in CLAUDE.md.
- The Resend broadcast/newsletter feature (parked by Wayan).
- Filling in the `CEK WAYAN` placeholder prices — they move to the server holding whatever values they currently have.
- The contact-form endpoint bug — it should be fixed on the live site now, not held for the migration.

---

**Phase 1 ends here. Nothing gets built until Wayan gives the go-ahead.**
