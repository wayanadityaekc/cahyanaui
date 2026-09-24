# [MIG-10] Layout shell — Navbar, Footer, TripBar, providers

**Agent:** Engine (structure) → Atelier (styling) · **Depends on:** MIG-01, MIG-02

## Objective
Replace the JS-fetched partials with a real layout, and mount the four state providers. This is the single biggest page-speed win of the migration: it removes the `loadPartials()` fetch waterfall from all 105 pages.

## Scope
1. `app/layout.jsx` — html/body, `next/font/local` for Inter, provider tree, `Navbar`, `TripBar`, children, `Footer`.
2. `Navbar` from `partials/navbar.html` + `initNavbar`. Order stays: Home · Itinerary (badge) · Program▾ · About · Contact Us + account icon. Program dropdown: Tours / Experiences / Transfer / Charter. Desktop hover/click; mobile Program **closed by default**, bottom shadow + separator, roomier items. Icon cluster spacing: `.acct` margin-right 0.9rem, `.navbar__cart` 1.3rem.
3. `Footer` from `partials/footer.html`.
4. `TripBar` from `initTripBar`: booking pages → Guests/Pickup (click opens the trip editor); non-booking pages → promo bar from `PROMO`, shown only when `active: true` **and** `text` is non-empty.
5. Providers in `state/`: `TripPrefsProvider`, `ItineraryProvider`, `AccountProvider`, `ReferralProvider` — localStorage keys unchanged (`cue_currency`, `cue_guests`, `cue_stay`, `cue_date_from`, `cue_date_to`, `cue_itinerary_v1`, `cue_itn_synced`, `cue_token`, `cue_referral`).
6. `AccountPanel` (account dropdown incl. the currency picker) and `MobileMenu`.

## Out of scope
- The hero search form (MIG-11 / MIG-33).
- The floating WhatsApp button — it stays CSS-hidden as today (`.wa-float { display:none !important }`); do not re-enable it.
- Any visual change to the navbar. The large logo↔cluster gap is deliberate.

## Input
- `partials/navbar.html`, `partials/footer.html`, `script.js` `initNavbar`, `initTripBar`, `initAccountMenu`, `initCurrency`.
- `CLAUDE.md` — Navbar section.

## Acceptance criteria
1. No `fetch()` for layout markup anywhere. `loadPartials` and `PARTIALS_VERSION` are gone.
2. **Hydration:** providers render the built default first, read localStorage in `useEffect`, then re-render. No hydration warnings in the console.
3. A returning visitor's cart, login and currency survive — set them on the old site, load the new build on the same origin, and confirm they are still there.
4. Cart badge count, account dot (upcoming booking), and currency label all update correctly.
5. Screenshot diff vs the current navbar/footer clean at 390 / 768 / 1440.

## Definition of done
- PR merged to `feature/nextjs-migration`.
- Engine states explicitly in the handoff whether styling is complete or needs Mike/Miki.
