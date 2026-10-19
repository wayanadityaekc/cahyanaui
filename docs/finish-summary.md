# WO-FINISH, combined summary

19 Oct 2026. Four jobs, in order. Every branch pushed, nothing merged, nothing deleted. Per-repo detail: `docs/finish-report.md` on each repo's `docs/claude-md-names` branch.

## Status

| Job | Result |
|---|---|
| Preflight | `fix/security-gaps` merged into `main` in all four repos that had it |
| 1. CLAUDE.md names | Pushed `docs/claude-md-names` in all six repos |
| 2. API block functions | Pushed `refactor/api-block-functions`: 11 moved, 1 left (`resolver`, reassigned on purpose) |
| 3. Coin branches | Not pushed in either repo: the branches are an older coin design that conflicts with the live Coin Rewards on `main` |
| 4. Branch cleanup | Blocked: archive tags cannot be pushed from this session (HTTP 403), so no branch was deleted |

## Job 1: cahyana-api

| File | | Line |
|---|---|---|
| `CLAUDE.md` | removed | \| Transfer \| One-car route price × cars. Return trip = round(one-way × 2 × 0.9). No pickup fee \| `pricing.js` `transferMoney` \| |
| `CLAUDE.md` | added | \| Transfer \| One-car route price × cars. Return trip = round(one-way × 2 × 0.9). No pickup fee \| `pricing.js` `calculateTransferMoney` \| |
| `CLAUDE.md` | removed |   - Earn, credited when the payment clears (`confirm.js` calls `onPaid`), taken back on a refund (`/api/admin/coins/reverse`): 1 per villa night; 2 per CUE booking line; a stay package = its nights + 2 per CUE program in it, airport pickup and drop-off included (`cue` in `villa-packages.js`) + 1 bonus (`coin_package_bonus`); referral: referrer 1, new guest +1 bonus, once per paid booking, no cap.  … |
| `CLAUDE.md` | added |   - Earn, credited when the payment clears (`confirm.js` calls `onPaid`, which is `creditPaidBooking` in `coins.js`), taken back on a refund (`/api/admin/coins/reverse`): 1 per villa night; 2 per CUE booking line; a stay package = its nights + 2 per CUE program in it, airport pickup and drop-off included (`cue` in `villa-packages.js`) + 1 bonus (`coin_package_bonus`); referral: referrer 1, new gue … |
| `CLAUDE.md` | removed | - **Sign-in**: email plus a 6-digit code (10 minutes, 5 attempts). No passwords. Login is handed to a browser only for an account created in that same request (`mayHandOver`). An existing account always goes through its inbox. A phone number is never an identity. |
| `CLAUDE.md` | added | - **Sign-in**: email plus a 6-digit code (5 minutes, `CODE_EXPIRY_MINUTES`; 5 attempts; used once, deleted atomically before the session is issued). No passwords. Login is handed to a browser only for an account created in that same request (`canHandOver`). An existing account always goes through its inbox. A phone number is never an identity. |
| `CLAUDE.md` | removed | - **Guests and the shared cart** (`cart.js`, plan `docs/shared-cart-plan.md`, phase 1 built, no site calls it yet): `accounts.kind` is `member` (default, every older row) or `guest` (no name, email or phone). `accountFromToken` returns **members only**, so a guest token is signed out on every existing route. Only `POST /api/guest`, `GET`/`PUT /api/cart` and `POST /api/account/logout` accept a gues … |
| `CLAUDE.md` | removed | - **Reviews**: publish immediately; the owner hides (never deletes) afterwards; a hidden review also leaves the star average. Who may review = who received the confirmation email: logged in, owns the booking (`account_id`, or an unlinked row whose email equals the account email), status `new` or `paid`, trip date passed, not yet reviewed. The list shown to the guest and the gate read the same help … |
| `CLAUDE.md` | removed | - **Booking codes**: `CUE-nnn` from a sequence (guessable), `UPV-` plus 6 random characters for any booking with a villa stay. Treat refs as identifiers, not secrets. |
| `CLAUDE.md` | added | - **Guests and the shared cart** (`cart.js`, plan `docs/shared-cart-plan.md`, phase 1 built, no site calls it yet): `accounts.kind` is `member` (default, every older row) or `guest` (no name, email or phone). `fetchAccountByToken` (`server.js`) returns **members only**, so a guest token is signed out on every existing route. Only `POST /api/guest`, `GET`/`PUT /api/cart` and `POST /api/account/logo … |
| `CLAUDE.md` | added | - **Reviews**: publish immediately; the owner hides (never deletes) afterwards; a hidden review also leaves the star average. Who may review = who received the confirmation email: logged in, owns the booking (`account_id`, or an unlinked row whose email equals the account email), status `new` or `paid`, trip date passed, not yet reviewed. The list shown to the guest and the gate read the same help … |
| `CLAUDE.md` | added | - **Booking codes**: new bookings get `CU-` plus 6 random characters (`bookingRefs.js`, no 0, O, 1, I or L). Older `CUE-nnn` (sequential) and `UPV-` codes stay valid. Treat refs as identifiers, not secrets. |
| `CLAUDE.md` | removed | \| Ownership \| Guest data routes scope to the token's account. Driver routes scope to `driver_id`. `booking-status` needs token and owner. **Payment start routes** (`/paypal/create-order`, `/doku/create-payment`) need a `pay_key` (returned with the booking, stored hashed in `payment_keys`, 24 hours) or the owner's login. Env `PAY_OWNERSHIP`: unset or `log` allows and logs `pay-start without proof … |
| `CLAUDE.md` | added | \| Ownership \| Guest data routes scope to the token's account. Driver routes scope to `driver_id`. `booking-status` needs token and owner. **Payment start routes** (`/paypal/create-order`, `/doku/create-payment`) need a `pay_key` (returned with the booking, stored hashed in `payment_keys`, 24 hours) or the owner's login. In production (`environment.js`) the proof is always enforced and a failed c … |
| `CLAUDE.md` | removed | \| Payment start \| The proof check exists (`pay_key` or owner login) but runs in `log` mode, so a start without proof is still allowed. Until `PAY_OWNERSHIP=enforce`, anyone with a booking ref can start an order on that booking, and the DOKU call forwards the booking's name, email and phone. `capture-order` has no token either. Waits for Wayan's real DOKU and PayPal tests and a clean log \| High  … |
| `CLAUDE.md` | added | \| Payment start \| Proof is enforced in production since 19 Oct 2026. `capture-order` has no token. Wayan's real DOKU and PayPal test after the change is still to run \| Med \| Wayan to test \| |
| `CLAUDE.md` | added | \| Quotes (Prettier) \| Double quotes (`.prettierrc.json` `singleQuote: false`); the sites use single quotes \| The API was written with double quotes; reformatting every file is churn with no gain. \| |
| `CLAUDE.md` | added | \| Required check on `main` \| `api-tests` and `quality` run on every push but are not required: the repo is private on a free GitHub plan, where branch rules are not enforced \| Wayan, 19 Oct 2026: no paid plan. Check both are green by hand before every merge. \| |

## Job 1: cahyanaui

| File | | Line |
|---|---|---|
| `CLAUDE.md` | added | ## Exceptions to global |
| `CLAUDE.md` | added | \| Global rule \| What this repo does \| Reason \| |
| `CLAUDE.md` | added | \|---\|---\|---\| |
| `CLAUDE.md` | added | \| Tests in `tests/` \| `apps/cue` keeps CUE's 25 root `verify-*.mjs` and `tools/` harnesses; the library's own test is in `packages/ui/tests/`; one check in `tools/` \| `apps/cue` is a stale snapshot (see above), not changed. \| |
| `CLAUDE.md` | added | Anything not listed follows `CLAUDE-global.md`. `apps/cue` and `apps/villas` carry the exceptions of their source repos (`cahyana-ubud-experience/CLAUDE.md` section 12, `ubud-private-villas/CLAUDE.md`). |
| `apps/cue/package.json` | removed |     "lint": "next lint", |
| `apps/cue/package.json` | added |     "lint": "eslint .", |
| `apps/villas/package.json` | removed |     "lint": "next lint", |
| `apps/villas/package.json` | added |     "lint": "eslint .", |

## Job 1: cahyana-dashboard

| File | | Line |
|---|---|---|
| `CLAUDE.md` | removed | - There is no unit-test folder and no lint setup. **UNKNOWN — ask Wayan** whether CI runs anything here. |
| `CLAUDE.md` | added | - `tests/` holds the newer harnesses (`tests/verify-pill-taps.mjs`, `tests/verify-coins-dash.mjs`); the 13 older `verify-*.mjs` stay at the repo root. |
| `CLAUDE.md` | added | - Lint: ESLint 9 with the Cahyana rules in `eslint.config.mjs` (`npm run lint:code`) and Prettier (`npm run format:check`, `.prettierrc.json`). |
| `CLAUDE.md` | added | - CI: `.github/workflows/quality.yml` ("Quality") runs on every push: `npm ci`, ESLint, Prettier, no comments in CSS (`check:comments`), `CLAUDE-global.md` equals the master (`check:global`), then `npm run build`. The browser harnesses are not run in CI. |
| `CLAUDE.md` | removed | Vercel. Whether `main` deploys automatically and whether preview deployments are used is **UNKNOWN — ask Wayan** (no workflow file in the repo). The app shows an update prompt when a new build is live (`components/UpdatePrompt.jsx`, `app/api/build`). |
| `CLAUDE.md` | added | Vercel. Whether `main` deploys automatically and whether preview deployments are used is **UNKNOWN — ask Wayan** (the only workflow, `quality.yml`, checks and builds; it does not deploy). The app shows an update prompt when a new build is live (`components/UpdatePrompt.jsx`, `app/api/build`). |
| `CLAUDE.md` | removed | \| Tests in `tests/` \| `verify-*.mjs` at the repo root \| Left in place, as in CUE. \| |
| `CLAUDE.md` | added | \| Tests in `tests/` \| 13 `verify-*.mjs` at the repo root; new ones in `tests/` \| Left in place, as in CUE. \| |

## Job 1: ubud-private-villas

| File | | Line |
|---|---|---|
| `CLAUDE.md` | removed | - Built on the feature branch (phase 3; plan in `cahyana-my/docs/shared-cart-phase-2-plan.md`). The villa site still builds the stay (`/my-booking`: dates, package, villa services, coin perks, CUE extras), but its Book now no longer opens a checkout here: `checkoutOnMy()` in `components/trip/MyBookingCart.jsx` sends `bookingLines(sendCart)` (each line with `from: 'villas'`, no prices) to `my./add? … |
| `CLAUDE.md` | added | - Built on the feature branch (phase 3; plan in `cahyana-my/docs/shared-cart-phase-2-plan.md`). The villa site still builds the stay (`/my-booking`: dates, package, villa services, coin perks, CUE extras), but its Book now no longer opens a checkout here: `checkoutOnMy()` in `components/trip/MyBookingCart.jsx` sends `buildBookingLines(sendCart)` (each line with `from: 'villas'`, no prices) to `my. … |
| `CLAUDE.md` | removed | - The navbar's account slot (`components/layout/Navbar.jsx`) holds the currency button (desktop only, `CurrencyPicker` variant `bar`; phones keep currency in the drawer) and the **My Cahyana pill** (`components/layout/MyPill.jsx` on the library's `MyCahyanaPill`): person \| bag in one link, the box of CUE's EN button (32px, 12px corners), straight to `my./my-trips` (`myTripsUrl()`), no popup. The  … |
| `CLAUDE.md` | added | - The navbar's account slot (`components/layout/Navbar.jsx`) holds the currency button (desktop only, `CurrencyPicker` variant `bar`; phones keep currency in the drawer) and the **My Cahyana pill** (`components/layout/MyPill.jsx` on the library's `MyCahyanaPill`): person \| bag in one link, the box of CUE's EN button (32px, 12px corners), straight to `my./my-trips` (`buildMyTripsUrl()`), no popup. … |
| `CLAUDE.md` | added | ## Exceptions to global |
| `CLAUDE.md` | added | \| Global rule \| What this repo does \| Reason \| |
| `CLAUDE.md` | added | \|---\|---\|---\| |
| `CLAUDE.md` | added | \| Motion timing from the scale (0.15 / 0.2 / 0.3s) \| The coin shine runs a 1.5s sweep in a 3s cycle \| Wayan, 13 Oct 2026 (see Cahyana Coin Rewards above). Decoration, off under reduced motion. \| |
| `CLAUDE.md` | added | \| Tests in `tests/` \| All harnesses are in `tests/` except `verify-paykey.mjs` at the repo root; `packages/ui/tests/` holds the library copy's test \| Left in place. \| |
| `CLAUDE.md` | added | Anything not listed follows `CLAUDE-global.md`. The full syntax audit of this repo has not been done (see the top of this file), so more gaps may exist. |
| `package.json` | removed |     "lint": "next lint", |
| `package.json` | added |     "lint": "eslint .", |

## Job 1: cahyana-ubud-experience

| File | | Line |
|---|---|---|
| `CLAUDE.md` | removed |   - Hooks: `useCoins`, `useFormCoins`, `useCoinPrice`; helpers `lib/coins.js`, `lib/cart.js` (`setRowCoins`, `coinsInCart`). |
| `CLAUDE.md` | added |   - Hooks: `useCoins`, `useFormCoins`, `useCoinPrice`; helpers `lib/coins.js`, `lib/cart.js` (`setRowCoins`, `countCoinsInCart`). |
| `CLAUDE.md` | removed | One template serves many pages. Change the template, not each page. Titles, descriptions and Open Graph are built by `pageMeta()` in `lib/seo.js` (self-canonical, hreflang, `og:locale`); JSON-LD by `components/JsonLd.jsx` from `content/shared/schema.js`; the visible trail by `components/ui/Breadcrumb.jsx` and `lib/crumbs.js`. |
| `CLAUDE.md` | added | One template serves many pages. Change the template, not each page. Titles, descriptions and Open Graph are built by `buildPageMeta()` in `lib/seo.js` (self-canonical, hreflang, `og:locale`); JSON-LD by `components/JsonLd.jsx` from `content/shared/schema.js`; the visible trail by `components/ui/Breadcrumb.jsx` and `lib/crumbs.js`. |
| `CLAUDE.md` | removed | \| Listing (tour, activities, destinations) \| `ListingPage.jsx` via `ListingRoute.jsx` \| client filter; cards from `content/shared/listings.js` plus `withAttractionCards` (server side) \| `pages.*` \| |
| `CLAUDE.md` | added | \| Listing (tour, activities, destinations) \| `ListingPage.jsx` via `ListingRoute.jsx` \| client filter; cards from `content/shared/listings.js` plus `addAttractionCards` (server side) \| `pages.*` \| |
| `CLAUDE.md` | removed |   - Every new internal link goes through `useLocaleHref()` or `localeHref()`. |
| `CLAUDE.md` | added |   - Every new internal link goes through `useLocaleHref()` or `buildLocaleHref()`. |
| `package.json` | removed |     "lint": "next lint", |
| `package.json` | added |     "lint": "eslint .", |

## Job 1: cahyana-my

| File | | Line |
|---|---|---|
| `CLAUDE.md` | removed | - **Copied as-is** from `cahyana-ubud-experience` (the CUE site) on 16 Oct 2026, from `origin/main` at commit `87b35b8377bf29edcec9bc5b35062d625740123a`. No redesign, no refactor, no `@cahyana/ui`. For how any copied piece works, the CUE project file (`cahyana-ubud-experience/CLAUDE.md`, sections 2, 3, 5, 6, 8) still describes it. |
| `CLAUDE.md` | added | - **Copied as-is** from `cahyana-ubud-experience` (the CUE site) on 16 Oct 2026, from `origin/main` at commit `87b35b8377bf29edcec9bc5b35062d625740123a`. No redesign, no refactor, no `@cahyana/ui`. For how any copied piece works, the CUE project file (`cahyana-ubud-experience/CLAUDE.md`, sections 2, 3, 5, 6, 8) still describes it. Names differ where the naming round renamed them here only: CUE's ` … |
| `CLAUDE.md` | removed | \| `/add`, `/<loc>/add` \| `app/(en)/(account)/add/page.jsx`, `app/<loc>/add/page.jsx` -> `AddRoute` -> `components/trip/AddToCart.jsx`. `?line=<base64url JSON>` or `?lines=<base64url JSON array>` (phase 3 hand-overs from CUE and the villa site), `&next=trips\|back&back=<url>` (`lib/addLink.js`): saves the lines in the server cart (a guest identity is made on the first add), then opens My Trips or … |
| `CLAUDE.md` | added | \| `/add`, `/<loc>/add` \| `app/(en)/(account)/add/page.jsx`, `app/<loc>/add/page.jsx` -> `AddRoute` -> `components/trip/AddToCart.jsx`. `?line=<base64url JSON>` or `?lines=<base64url JSON array>` (phase 3 hand-overs from CUE and the villa site), `&next=trips\|back&back=<url>` (`lib/addLink.js`): saves the lines in the server cart (a guest identity is made on the first add), then opens My Trips or … |
| `CLAUDE.md` | removed | Only `/my-trips`, `/settings` and `/add` live here. Every other internal link goes to the CUE site, locale prefix kept (`/tour` -> `https://cahyanaubudexperience.com/tour`, `/ja/tour` -> `https://cahyanaubudexperience.com/ja/tour`, `/` -> the CUE homepage). One place: `localeHref()` in `lib/i18n.js` (`LOCAL_PATHS`, `CUE_SITE`). Components keep calling `localeHref` / `useLocaleHref` as in CUE. JSON … |
| `CLAUDE.md` | added | Only `/my-trips`, `/settings` and `/add` live here. Every other internal link goes to the CUE site, locale prefix kept (`/tour` -> `https://cahyanaubudexperience.com/tour`, `/ja/tour` -> `https://cahyanaubudexperience.com/ja/tour`, `/` -> the CUE homepage). One place: `buildLocaleHref()` in `lib/i18n.js` (`LOCAL_PATHS`, `CUE_SITE`). Components call `buildLocaleHref` / `useLocaleHref`. JSON-LD uses … |
| `CLAUDE.md` | removed | - Env names, never values: `NEXT_PUBLIC_API_BASE` (defaults to the production API, `lib/constants.js`, `next.config.js`). `NEXT_PUBLIC_GOOGLE_MAPS_KEY` is still read in `lib/googleMaps.js`, but nothing in the kept routes imports it. |
| `CLAUDE.md` | added | - Env names, never values: `NEXT_PUBLIC_API_BASE` (defaults to the production API, `lib/constants.js`, `next.config.js`). `lib/googleMaps.js` is not in this repo, so no Google Maps key is read. |
| `CLAUDE.md` | removed | \| Tests in `tests/` \| `tests/verify-foundation.mjs` only; CUE's `verify-*.mjs` harnesses were not copied \| They target CUE pages and builds \| |
| `CLAUDE.md` | added | \| Tests in `tests/` \| Follows the rule: every harness is in `tests/` (5 files). CUE's root `verify-*.mjs` harnesses were not copied \| They target CUE pages and builds \| |
| `CLAUDE.md` | removed | \| Changed code (follows global) \| `lib/i18n.js` (`localeHref`, `localeHrefOnCue`), `components/JsonLd.jsx` (one call), `next.config.js` (`redirects()`), `app/robots.js`, `package.json` scripts \| Minimum to run standalone \| |
| `CLAUDE.md` | added | \| Changed code (follows global) \| `lib/i18n.js` (`buildLocaleHref`, `buildCueLocaleHref`), `components/JsonLd.jsx` (one call), `next.config.js` (`redirects()`), `app/robots.js`, `package.json` scripts \| Minimum to run standalone \| |

## Job 2: cahyana-api

| # | Function | File | Result | Values passed in | Test used | Result after |
|---|---|---|---|---|---|---|
| 1 | `inScope` | `server.js` (`GET /api/admin/prices`) | Moved to the top level as `function inScope(priceItem, scope)`; the nested ternary became two early returns | `scope` (the `?scope=` query) | `tools/driver-test.js`: villa and cue scopes, plus a new check for no scope (all prices). Proven to fail with the cue branch returning `true` (2 checks fail) | 121/121 assertions; full suite 47/47 |
| 2 | `refKey` | `tools/account-settings-test.js` | Moved | none | The file itself; output identical before and after. Proven to fail with the `booking_ref` part removed | pass; 47/47 |
| 3 | `error` (first) | `tools/doku-flow-test.js` | Moved | none | The file itself; output identical. Proven to fail with the status forced to 500 | pass; 47/47 |
| 4 | `error` (second, identical) | `tools/doku-flow-test.js` | Removed; that block now calls the top-level `error` from #3 | none | Same file; output identical | pass; 47/47 |
| 5 | `villaLine` | `tools/guest-cart-test.js` | Moved as `function villaLine(line, extra)` | `line` (the line builder inside `main`); 6 call sites now pass it | The file itself, 100 checks, identical. Proven to fail with type `tour` (3 checks fail) | 100/100; 47/47 |
| 6 | `row` | `tools/inquiry-flow-test.js` | Moved as `function row(status, past)` | `past` (the date in the block); 4 call sites | The file itself, identical. Proven to fail with status forced to `paid` | pass; 47/47 |
| 7 | `req` | `tools/pay-ownership-pg-test.js` | Moved | none | The file itself, 17 checks, identical. Proven to fail with headers dropped (1 check fails) | 17/17; 47/47 |
| 8 | `modeOf` | `tools/pay-ownership-test.js` | Moved; parameter `v` named `value` | none (`payOwnership`, `makeDb`, `accountFromToken` are already top level) | The file itself, 53 checks, identical. Proven to fail with the setting forced to `log` | 53/53; 47/47 |
| 9 | `tag` | `tools/pay-ownership-test.js` | Moved as `function tag(rail, text)` | `rail` (the loop variable); 22 call sites | The file itself, identical. `tag` only builds check labels, so no check can fail on it; checked by forcing one check to fail and reading the labels (`paypal: ...`, `doku: ...`) | 53/53; 47/47 |
| 10 | `norm` | `tools/pay-ownership-test.js` | Moved | none | The file itself, identical. Proven to fail with `id` kept | 53/53; 47/47 |
| 11 | `notFound` | `tools/paypal-flow-test.js` | Moved | none | The file itself, identical. Proven to fail with a non-404 error (status 500, other name) | pass; 47/47 |
| 12 | `resolver` | `validate.js` | **Left in place** | n/a | n/a | n/a |

`resolver` is already at the top level of `validate.js`. It is a `let`, not a function in a block: `setResolver()` reassigns it so tests can replace the DNS lookup. Turning it into a function declaration would remove that swap (a behaviour change), so it stays.

Nested ternaries inside these functions: only `inScope` had one (fixed). The 11 moves are 11 commits on `refactor/api-block-functions`, each followed by the full suite (47/47). Quality and API tests are green on GitHub for the branch.

## Job 3: cahyana-api

**What `claude/cahyana-coin` adds (3 commits, 12 Oct 2026, 54 commits behind `main`):** an earlier coin design. New `coins.js` (318 lines) with tables `coin_config`, `coin_grant`, `coin_redemption`; earn by villa nights on a direct stay; perks (scooter, breakfast, Kecak); CUE discounts at Rp 300,000 a coin, never below 40% of list; checks in `POST /api/inquiry`, applied in `POST /api/pricing/quote`; coin thresholds in `GET /api/pricing/catalog`; status follows the booking in `confirm.js` and mark-test; admin `GET /api/admin/coins`, `POST /api/admin/coins/config`; the guest-facing name "Cahyana Coupon" in 7 languages; `tools/coins-test.js` (47 assertions).

**Already on `main` (another way):** Cahyana Coin Rewards (13 Oct 2026, the later design Wayan approved): a different `coins.js` with tables `coin_ledger`, `coin_earn_rules`, `coin_cue_redeem`, `coin_villa_menu`, `coin_package_bonus`, `coin_referrals`; 1 coin per villa night; the same three villa perks (as `coin_villa_menu`); % off per coin instead of Rupiah per coin; referral coins; its own `tools/coins-test.js`; routes `/api/account/coins`, `/api/coins/villa-menu`, `/api/admin/coins/*`. Nothing named "coupon" exists on `main`.

**`claude/cahyana-coin-rebased`: not pushed.** Bringing the first commit onto `main` conflicts in `coins.js` (both sides add a whole, different file), `tools/coins-test.js` (same), `confirm.js` and `server.js` (11 conflict blocks). Keeping the branch's behaviour would replace or duplicate `main`'s live coin system, its tables and the routes CUE, my. and the villa site call. That cannot be done safely, so the local attempt was dropped; the original branch is untouched.

## Job 3: ubud-private-villas

**What `claude/cahyana-coin` adds (3 commits, 12 Oct 2026, 55 commits behind `main`):** coins in My Booking (coin card, perks by quantity, coins on a tour or transfer, choice saved with the cart), a coin "guest journey" design (balance card, tabs, Redeem, coin switch), a "Cahyana Coupon" wallet (`CouponTicket`, `CouponMark`, `UseCouponButton`), `lib/coins.js`, `tests/verify-coins.mjs`; it also **removes the stay packages** (homepage, villa hub, villa pages, cart).

**Already on `main` (another way):** Cahyana Coin Rewards teaser and Our Company section, coin perks and coins on the villa form, `lib/coins.js` and `tests/verify-coins.mjs` (different content); since 17 Oct the cart and checkout moved to my., and `MyBookingCart`, `ExtrasSection`, `useExtrasCatalog`, `useCoinQuote`, `CheckoutSheet` were removed with Wayan's OK. Stay packages are still on `main` (`StayPackages`).

**`claude/cahyana-coin-rebased`: not pushed.** The first commit alone conflicts in 22 files: 16 edited on both sides (`app/page.jsx`, `app/villas/page.jsx`, `BookingSheet.jsx`, `CartProvider.jsx`, `VillaDetail.jsx`, `ItemIcon.jsx`, `lib/bookingCart.js`, `lib/bookingPayload.js`, `messages/en/trip.json`, six tests), 4 deleted on `main` but changed on the branch (`MyBookingCart.jsx`, `CheckoutSheet.jsx`, `useExtrasCatalog.js`, `lib/bookingMessage.js`), 2 the other way (`StayPackages.jsx`, `content/packages.js`), and `lib/coins.js` and `tests/verify-coins.mjs` added on both. The branch builds on screens that no longer exist and on the API's older coin design (not on `main`), and would remove the stay packages. Not safe; local attempt dropped.

## Job 4: branch cleanup

| Repo | Would archive and delete | Kept (protected or recent unmerged work) |
|---|---|---|
| cahyana-api | 42 | 6 |
| cahyanaui | 11 | 2 |
| cahyana-dashboard | 18 | 2 |
| ubud-private-villas | 84 | 5 |
| cahyana-ubud-experience | 7 | 3 |
| cahyana-my | 5 | 3 |

No open pull requests in any repo. Kept for recent unmerged work: `cahyana-api` `docs/api-tests-manual` and `test/airport-cars-6-7`, `ubud-private-villas` `map-preview`, `cahyana-my` `claude/wonderful-mendel-wdjfkn`. To be decided before deleting: `cahyana-ubud-experience` `feature/cue-map` is the branch `deploy-staging.yml` deploys from.

Every branch, its tag and why it was not deleted:

| Repo | Branch | Archive tag | Deleted | Reason if kept |
|---|---|---|---|---|
| cahyana-api | `claude/api-chinese` | `archive/claude-api-chinese` | no | archive tag push refused (HTTP 403) |
| cahyana-api | `claude/brief-19-f88ety` | `archive/claude-brief-19-f88ety` | no | archive tag push refused (HTTP 403) |
| cahyana-api | `claude/cahyana-coin` | `archive/claude-cahyana-coin` | no | protected name |
| cahyana-api | `claude/cue-login-account-navbar-x524x8` | `archive/claude-cue-login-account-navbar-x524x8` | no | archive tag push refused (HTTP 403) |
| cahyana-api | `claude/dashboard-brief-12-retro-assign` | `archive/claude-dashboard-brief-12-retro-assign` | no | archive tag push refused (HTTP 403) |
| cahyana-api | `claude/dashboard-mockup-ffaeyv` | `archive/claude-dashboard-mockup-ffaeyv` | no | archive tag push refused (HTTP 403) |
| cahyana-api | `claude/dashboard-push` | `archive/claude-dashboard-push` | no | archive tag push refused (HTTP 403) |
| cahyana-api | `claude/deposit-doku-checkpoint1` | `archive/claude-deposit-doku-checkpoint1` | no | archive tag push refused (HTTP 403) |
| cahyana-api | `claude/determined-bell-hlb0qy` | `archive/claude-determined-bell-hlb0qy` | no | archive tag push refused (HTTP 403) |
| cahyana-api | `claude/driver-dispatch` | `archive/claude-driver-dispatch` | no | archive tag push refused (HTTP 403) |
| cahyana-api | `claude/driver-phone-password` | `archive/claude-driver-phone-password` | no | archive tag push refused (HTTP 403) |
| cahyana-api | `claude/eager-gates-esnmvd` | `archive/claude-eager-gates-esnmvd` | no | archive tag push refused (HTTP 403) |
| cahyana-api | `claude/fix-villa-calendar-test` | `archive/claude-fix-villa-calendar-test` | no | archive tag push refused (HTTP 403) |
| cahyana-api | `claude/focused-shannon-l826rd` | `archive/claude-focused-shannon-l826rd` | no | archive tag push refused (HTTP 403) |
| cahyana-api | `claude/knowledge-base-653nb2` | `archive/claude-knowledge-base-653nb2` | no | archive tag push refused (HTTP 403) |
| cahyana-api | `claude/krw-cny` | `archive/claude-krw-cny` | no | archive tag push refused (HTTP 403) |
| cahyana-api | `claude/library-audit-reusable-components-n5bive` | `archive/claude-library-audit-reusable-components-n5bive` | no | archive tag push refused (HTTP 403) |
| cahyana-api | `claude/loving-gauss-nl5153` | `archive/claude-loving-gauss-nl5153` | no | archive tag push refused (HTTP 403) |
| cahyana-api | `claude/role-definition-7qgdq1` | `archive/claude-role-definition-7qgdq1` | no | archive tag push refused (HTTP 403) |
| cahyana-api | `claude/role-definition-d9kvwl` | `archive/claude-role-definition-d9kvwl` | no | archive tag push refused (HTTP 403) |
| cahyana-api | `claude/role-definition-yhf81x` | `archive/claude-role-definition-yhf81x` | no | archive tag push refused (HTTP 403) |
| cahyana-api | `claude/table-booking-sync-sgjk1n` | `archive/claude-table-booking-sync-sgjk1n` | no | archive tag push refused (HTTP 403) |
| cahyana-api | `claude/upv-random-codes` | `archive/claude-upv-random-codes` | no | archive tag push refused (HTTP 403) |
| cahyana-api | `claude/wonderful-mendel-wdjfkn` | `archive/claude-wonderful-mendel-wdjfkn` | no | archive tag push refused (HTTP 403) |
| cahyana-api | `claude/work-tree-validation-vqexsf` | `archive/claude-work-tree-validation-vqexsf` | no | archive tag push refused (HTTP 403) |
| cahyana-api | `docs/api-tests-manual` | `archive/docs-api-tests-manual` | no | unmerged commits from the last 7 days (1) |
| cahyana-api | `docs/claude-md-names` | `archive/docs-claude-md-names` | no | protected name |
| cahyana-api | `docs/claude-md-swap` | `archive/docs-claude-md-swap` | no | archive tag push refused (HTTP 403) |
| cahyana-api | `docs/global-rules-update` | `archive/docs-global-rules-update` | no | archive tag push refused (HTTP 403) |
| cahyana-api | `feat/charter-surcharge-display` | `archive/feat-charter-surcharge-display` | no | archive tag push refused (HTTP 403) |
| cahyana-api | `feat/idr-core-pricing` | `archive/feat-idr-core-pricing` | no | archive tag push refused (HTTP 403) |
| cahyana-api | `feature/coin-rewards` | `archive/feature-coin-rewards` | no | archive tag push refused (HTTP 403) |
| cahyana-api | `feature/helmet` | `archive/feature-helmet` | no | archive tag push refused (HTTP 403) |
| cahyana-api | `feature/server-side-pricing` | `archive/feature-server-side-pricing` | no | archive tag push refused (HTTP 403) |
| cahyana-api | `fix/charter-second-car` | `archive/fix-charter-second-car` | no | archive tag push refused (HTTP 403) |
| cahyana-api | `fix/payment-ownership` | `archive/fix-payment-ownership` | no | archive tag push refused (HTTP 403) |
| cahyana-api | `fix/place-pricing-multiplier` | `archive/fix-place-pricing-multiplier` | no | archive tag push refused (HTTP 403) |
| cahyana-api | `fix/referral-one-rate` | `archive/fix-referral-one-rate` | no | archive tag push refused (HTTP 403) |
| cahyana-api | `fix/security-gaps` | `archive/fix-security-gaps` | no | archive tag push refused (HTTP 403) |
| cahyana-api | `fix/silent-otp-failure` | `archive/fix-silent-otp-failure` | no | archive tag push refused (HTTP 403) |
| cahyana-api | `fx-pricing-rule` | `archive/fx-pricing-rule` | no | archive tag push refused (HTTP 403) |
| cahyana-api | `main` | `archive/main` | no | protected name |
| cahyana-api | `refactor/api-block-functions` | `archive/refactor-api-block-functions` | no | protected name |
| cahyana-api | `refactor/global-rules` | `archive/refactor-global-rules` | no | archive tag push refused (HTTP 403) |
| cahyana-api | `refactor/naming-convention` | `archive/refactor-naming-convention` | no | archive tag push refused (HTTP 403) |
| cahyana-api | `test/airport-cars-6-7` | `archive/test-airport-cars-6-7` | no | unmerged commits from the last 7 days (1) |
| cahyana-api | `wo3-account-settings` | `archive/wo3-account-settings` | no | archive tag push refused (HTTP 403) |
| cahyana-api | `wo6-email-brand` | `archive/wo6-email-brand` | no | archive tag push refused (HTTP 403) |
| cahyanaui | `claude/cue-login-account-navbar-x524x8` | `archive/claude-cue-login-account-navbar-x524x8` | no | archive tag push refused (HTTP 403) |
| cahyanaui | `claude/dreamy-knuth-6paxam` | `archive/claude-dreamy-knuth-6paxam` | no | archive tag push refused (HTTP 403) |
| cahyanaui | `claude/focused-shannon-l826rd` | `archive/claude-focused-shannon-l826rd` | no | archive tag push refused (HTTP 403) |
| cahyanaui | `claude/pull-main-cue-yn2wxe` | `archive/claude-pull-main-cue-yn2wxe` | no | archive tag push refused (HTTP 403) |
| cahyanaui | `claude/villa-hero-b` | `archive/claude-villa-hero-b` | no | archive tag push refused (HTTP 403) |
| cahyanaui | `claude/wonderful-mendel-wdjfkn` | `archive/claude-wonderful-mendel-wdjfkn` | no | archive tag push refused (HTTP 403) |
| cahyanaui | `claude/work-tree-validation-vqexsf` | `archive/claude-work-tree-validation-vqexsf` | no | archive tag push refused (HTTP 403) |
| cahyanaui | `docs/claude-md-names` | `archive/docs-claude-md-names` | no | protected name |
| cahyanaui | `docs/claude-md-swap` | `archive/docs-claude-md-swap` | no | archive tag push refused (HTTP 403) |
| cahyanaui | `docs/global-rules-update` | `archive/docs-global-rules-update` | no | archive tag push refused (HTTP 403) |
| cahyanaui | `main` | `archive/main` | no | protected name |
| cahyanaui | `refactor/global-rules` | `archive/refactor-global-rules` | no | archive tag push refused (HTTP 403) |
| cahyanaui | `refactor/naming-convention` | `archive/refactor-naming-convention` | no | archive tag push refused (HTTP 403) |
| cahyana-dashboard | `claude/check-for-updates` | `archive/claude-check-for-updates` | no | archive tag push refused (HTTP 403) |
| cahyana-dashboard | `claude/cue-login-account-navbar-x524x8` | `archive/claude-cue-login-account-navbar-x524x8` | no | archive tag push refused (HTTP 403) |
| cahyana-dashboard | `claude/dashboard-brief-12-login-trips` | `archive/claude-dashboard-brief-12-login-trips` | no | archive tag push refused (HTTP 403) |
| cahyana-dashboard | `claude/dashboard-navbar-tabbar` | `archive/claude-dashboard-navbar-tabbar` | no | archive tag push refused (HTTP 403) |
| cahyana-dashboard | `claude/driver-dispatch` | `archive/claude-driver-dispatch` | no | archive tag push refused (HTTP 403) |
| cahyana-dashboard | `claude/driver-form-pwa-update` | `archive/claude-driver-form-pwa-update` | no | archive tag push refused (HTTP 403) |
| cahyana-dashboard | `claude/eager-gates-esnmvd` | `archive/claude-eager-gates-esnmvd` | no | archive tag push refused (HTTP 403) |
| cahyana-dashboard | `claude/input-zoom-scrolllock` | `archive/claude-input-zoom-scrolllock` | no | archive tag push refused (HTTP 403) |
| cahyana-dashboard | `claude/logo-loader-no-arrows` | `archive/claude-logo-loader-no-arrows` | no | archive tag push refused (HTTP 403) |
| cahyana-dashboard | `claude/style-a-mist` | `archive/claude-style-a-mist` | no | archive tag push refused (HTTP 403) |
| cahyana-dashboard | `claude/style-b-graphite` | `archive/claude-style-b-graphite` | no | archive tag push refused (HTTP 403) |
| cahyana-dashboard | `claude/style-c-porcelain` | `archive/claude-style-c-porcelain` | no | archive tag push refused (HTTP 403) |
| cahyana-dashboard | `claude/wonderful-mendel-wdjfkn` | `archive/claude-wonderful-mendel-wdjfkn` | no | archive tag push refused (HTTP 403) |
| cahyana-dashboard | `docs/claude-md` | `archive/docs-claude-md` | no | archive tag push refused (HTTP 403) |
| cahyana-dashboard | `docs/claude-md-names` | `archive/docs-claude-md-names` | no | protected name |
| cahyana-dashboard | `docs/global-rules-update` | `archive/docs-global-rules-update` | no | archive tag push refused (HTTP 403) |
| cahyana-dashboard | `feature/coin-rewards` | `archive/feature-coin-rewards` | no | archive tag push refused (HTTP 403) |
| cahyana-dashboard | `main` | `archive/main` | no | protected name |
| cahyana-dashboard | `refactor/global-rules` | `archive/refactor-global-rules` | no | archive tag push refused (HTTP 403) |
| cahyana-dashboard | `refactor/naming-convention` | `archive/refactor-naming-convention` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `WO1` | `archive/WO1` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `WO10` | `archive/WO10` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `WO11` | `archive/WO11` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `WO12` | `archive/WO12` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `WO13` | `archive/WO13` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `WO14` | `archive/WO14` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `WO15` | `archive/WO15` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `WO15b` | `archive/WO15b` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `WO16` | `archive/WO16` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `WO2` | `archive/WO2` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `WO3` | `archive/WO3` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `WO4` | `archive/WO4` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `WO5` | `archive/WO5` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `WO6` | `archive/WO6` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `WO7` | `archive/WO7` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `WO8` | `archive/WO8` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `WO9` | `archive/WO9` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/addon-button-under` | `archive/claude-addon-button-under` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/amenities-button-center` | `archive/claude-amenities-button-center` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/amenities-mobile-tiles` | `archive/claude-amenities-mobile-tiles` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/amenity-white-addon-slider` | `archive/claude-amenity-white-addon-slider` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/bar-border` | `archive/claude-bar-border` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/breakfast-menu` | `archive/claude-breakfast-menu` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/brief-b-options` | `archive/claude-brief-b-options` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/brief-v2` | `archive/claude-brief-v2` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/cahyana-coin` | `archive/claude-cahyana-coin` | no | protected name |
| ubud-private-villas | `claude/checklist-icons` | `archive/claude-checklist-icons` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/cream-ivory` | `archive/claude-cream-ivory` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/dark-primary` | `archive/claude-dark-primary` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/focused-shannon-l826rd` | `archive/claude-focused-shannon-l826rd` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/home-cta-wide` | `archive/claude-home-cta-wide` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/home-map` | `archive/claude-home-map` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/home-options` | `archive/claude-home-options` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/hub-pages` | `archive/claude-hub-pages` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/hub-white` | `archive/claude-hub-white` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/image-consistency` | `archive/claude-image-consistency` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/library-audit-reusable-components-n5bive` | `archive/claude-library-audit-reusable-components-n5bive` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/logo-align` | `archive/claude-logo-align` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/map-click-nozoom` | `archive/claude-map-click-nozoom` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/map-hybrid` | `archive/claude-map-hybrid` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/map-image-size` | `archive/claude-map-image-size` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/map-landmarks` | `archive/claude-map-landmarks` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/map-menu` | `archive/claude-map-menu` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/map-menu-villas` | `archive/claude-map-menu-villas` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/map-page` | `archive/claude-map-page` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/map-satellite-preview` | `archive/claude-map-satellite-preview` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/map-scope` | `archive/claude-map-scope` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/nav-order` | `archive/claude-nav-order` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/navbar-logo-center` | `archive/claude-navbar-logo-center` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/new-villa-photos` | `archive/claude-new-villa-photos` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/no-field-zoom` | `archive/claude-no-field-zoom` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/photo-placeholders` | `archive/claude-photo-placeholders` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/radius-6` | `archive/claude-radius-6` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/radius-all-boxes` | `archive/claude-radius-all-boxes` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/radius-token` | `archive/claude-radius-token` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/remove-highlights` | `archive/claude-remove-highlights` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/reserve-bar-everywhere` | `archive/claude-reserve-bar-everywhere` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/reserve-bar-flush` | `archive/claude-reserve-bar-flush` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/scooter-rental` | `archive/claude-scooter-rental` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/section-titles-center` | `archive/claude-section-titles-center` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/service-hero` | `archive/claude-service-hero` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/service-menu-lock` | `archive/claude-service-menu-lock` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/shared-nav-footer` | `archive/claude-shared-nav-footer` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/type-b` | `archive/claude-type-b` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/upv-brief` | `archive/claude-upv-brief` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/villa-addons-reuse` | `archive/claude-villa-addons-reuse` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/villa-calendar-picker` | `archive/claude-villa-calendar-picker` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/villa-detail-space-addons` | `archive/claude-villa-detail-space-addons` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/villa-hero-b` | `archive/claude-villa-hero-b` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/villa-hub-redesign` | `archive/claude-villa-hub-redesign` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/villas-redirect-fix` | `archive/claude-villas-redirect-fix` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/white-sections` | `archive/claude-white-sections` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/wonderful-mendel-wdjfkn` | `archive/claude-wonderful-mendel-wdjfkn` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `claude/work-tree-validation-vqexsf` | `archive/claude-work-tree-validation-vqexsf` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `deploy` | `archive/deploy` | no | protected name |
| ubud-private-villas | `docs/claude-md-names` | `archive/docs-claude-md-names` | no | protected name |
| ubud-private-villas | `docs/claude-md-swap` | `archive/docs-claude-md-swap` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `docs/global-rules-update` | `archive/docs-global-rules-update` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `feature/coin-band-light` | `archive/feature-coin-band-light` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `feature/coin-rewards` | `archive/feature-coin-rewards` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `feature/coin-rewards-section` | `archive/feature-coin-rewards-section` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `feature/coin-strip` | `archive/feature-coin-strip` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `fix/pay-key-frontend` | `archive/fix-pay-key-frontend` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `fix/security-gaps` | `archive/fix-security-gaps` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `main` | `archive/main` | no | protected name |
| ubud-private-villas | `map-image` | `archive/map-image` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `map-preview` | `archive/map-preview` | no | unmerged commits from the last 7 days (1) |
| ubud-private-villas | `refactor/global-rules` | `archive/refactor-global-rules` | no | archive tag push refused (HTTP 403) |
| ubud-private-villas | `refactor/naming-convention` | `archive/refactor-naming-convention` | no | archive tag push refused (HTTP 403) |
| cahyana-ubud-experience | `chore/hide-featured-on` | `archive/chore-hide-featured-on` | no | archive tag push refused (HTTP 403) |
| cahyana-ubud-experience | `chore/hide-villas-section` | `archive/chore-hide-villas-section` | no | archive tag push refused (HTTP 403) |
| cahyana-ubud-experience | `claude/wonderful-mendel-wdjfkn` | `archive/claude-wonderful-mendel-wdjfkn` | no | archive tag push refused (HTTP 403) |
| cahyana-ubud-experience | `deploy` | `archive/deploy` | no | protected name |
| cahyana-ubud-experience | `docs/claude-md-names` | `archive/docs-claude-md-names` | no | protected name |
| cahyana-ubud-experience | `docs/global-rules-update` | `archive/docs-global-rules-update` | no | archive tag push refused (HTTP 403) |
| cahyana-ubud-experience | `fix/security-gaps` | `archive/fix-security-gaps` | no | archive tag push refused (HTTP 403) |
| cahyana-ubud-experience | `main` | `archive/main` | no | protected name |
| cahyana-ubud-experience | `refactor/global-rules` | `archive/refactor-global-rules` | no | archive tag push refused (HTTP 403) |
| cahyana-ubud-experience | `refactor/naming-convention` | `archive/refactor-naming-convention` | no | archive tag push refused (HTTP 403) |
| cahyana-my | `chore/hide-villas` | `archive/chore-hide-villas` | no | archive tag push refused (HTTP 403) |
| cahyana-my | `claude/wonderful-mendel-wdjfkn` | `archive/claude-wonderful-mendel-wdjfkn` | no | unmerged commits from the last 7 days (2) |
| cahyana-my | `docs/claude-md-names` | `archive/docs-claude-md-names` | no | protected name |
| cahyana-my | `docs/global-rules-update` | `archive/docs-global-rules-update` | no | archive tag push refused (HTTP 403) |
| cahyana-my | `fix/security-gaps` | `archive/fix-security-gaps` | no | archive tag push refused (HTTP 403) |
| cahyana-my | `main` | `archive/main` | no | protected name |
| cahyana-my | `refactor/global-rules` | `archive/refactor-global-rules` | no | archive tag push refused (HTTP 403) |
| cahyana-my | `refactor/naming-convention` | `archive/refactor-naming-convention` | no | archive tag push refused (HTTP 403) |

## Tests, before and after

**cahyana-api**

| Branch | Before (`main`) | After |
|---|---|---|
| `docs/claude-md-names` | 47/47 test files; lint, Prettier, comments, global: pass | 47/47 locally and in CI; Quality green |
| `refactor/api-block-functions` | 47/47 | 47/47 after every one of the 11 commits; Quality and API tests green in CI |

**cahyanaui**

| Branch | Before | After |
|---|---|---|
| `docs/claude-md-names` | Quality green on `main` | lint, Prettier, comments pass locally; Quality (with build) green in CI. Only docs and the two apps' `lint` script changed |

**cahyana-dashboard**

| Branch | Before | After |
|---|---|---|
| `docs/claude-md-names` | Quality green on `main` | lint, Prettier, comments, global pass locally; Quality (with build) green in CI. Docs only |

**ubud-private-villas**

| Branch | Before | After |
|---|---|---|
| `docs/claude-md-names` | build and 5 gates pass | build passes, built HTML and CSS identical to `main` (fingerprint: IDENTICAL), 5 gates pass, lint, Prettier, comments, global pass; Quality green in CI |

**cahyana-ubud-experience**

| Branch | Before | After |
|---|---|---|
| `docs/claude-md-names` | build and 5 gates pass | build passes, built HTML and CSS identical to `main` (fingerprint: IDENTICAL), 5 gates pass, lint, Prettier, comments, global pass; Quality green in CI |

**cahyana-my**

| Branch | Before | After |
|---|---|---|
| `docs/claude-md-names` | CI and Quality green on `main` | lint, Prettier, comments, global pass locally; CI (build) and Quality green. Docs only |

## Recommended merge order

1. `cahyana-api` `refactor/api-block-functions` (test helpers and one admin filter; no behaviour change; API tests green).
2. `docs/claude-md-names` in all six repos, any order (docs, plus the `lint` script in CUE, the villa site and the two cahyanaui apps; no build output changes).
3. `cahyana-api` `docs/api-tests-manual` is now covered by `docs/claude-md-names` (same decision, written into section 7 and the exceptions table): merge one of them, not both, or they will conflict in section 7.
4. Nothing from Job 3 (no rebased coin branch was pushed).

## Finishing Job 4 from a computer that can push tags

The list of branches to archive is `docs/finish-archive-list.tsv` next to this file (repo, branch, commit). In a clone of each repo, for each line:

```
tag="archive/${branch//\//-}"
git tag "$tag" "$commit"
git push origin "refs/tags/$tag"
[ "$(git ls-remote origin "refs/tags/$tag" | cut -f1)" = "$(git rev-parse "$commit")" ] && git push origin --delete "$branch"
```

The branch is deleted only after the tag is confirmed on GitHub with the same commit. Re-check the 7-day rule on the day you run it: a branch that has received new commits since 19 Oct should be kept.
