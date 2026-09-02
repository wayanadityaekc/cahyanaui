# [MIG-21] Itinerary builder + My Trips cart

**Agent:** Engine · **Depends on:** MIG-00 (hard), MIG-11, MIG-12 · **Money path — QA tests immediately**

## Objective
Port the largest single piece of logic in the codebase: the itinerary builder (`initItinerary`, ~800 lines) and the My Trips cart page (`initMyTripsCart`, ~285 lines).

## Scope
1. `ItineraryBuilder` (`itinerary.html`) — day-by-day builder, add/remove items per day, per-item Standard/Exclusive mode, transfers, charters, date assignment.
2. `SuggestedPlan` (`initSuggested`) — "Don't know where to start?": pick days + guests, auto-fill from `SUGGEST` plus airport pickup/drop-off.
3. `MyTripsCart` (`my-trips.html`) — flat card per item, heart toggle in/out of cart, totals, "Make Payment", upcoming/history from `GET /api/bookings/mine`, "Leave a Review" per reviewable tour.
4. Cart mechanics to preserve exactly: `cartFlatten` skipping empty days, `cartCascadeFrom` date cascade, `cartHasClash` conflict detection, one-day-per-add behaviour, the badge count in the navbar.
5. `TripDetailsModal` (`showTripDetails`) — the trip editor reached from the tripbar Edit and navbar Reset.
6. State in `ItineraryProvider`, key `cue_itinerary_v1` unchanged.
7. **Pricing:** totals come from `POST /api/pricing/quote`, not local maths. Referral discount display keeps the struck-through old price + amber new price.

## Out of scope
- Payment (see MIG-20).
- Redesigning the cart layout or changing what a "day" means.

## Input
- `script.js` `initItinerary` (~2004–2806), `initMyTripsCart` (~3994–4278), `cartCheckout` (~3928), `initSuggested`, `showTripDetails`, and the `cart*` / `itn*` helpers (~629–1290).

## Acceptance criteria
1. An existing `cue_itinerary_v1` from the current site loads and renders identically in the new build — same items, days, dates, modes.
2. Empty days are excluded from totals and from the checkout payload (the "cart shows 1 item but says 3 days" bug must not return).
3. "Make Payment" stays disabled while any row has no date.
4. Totals equal the sum of the per-card numbers on screen, and match `/api/pricing/quote`.
5. `GET /api/bookings/mine` grouping (one card per `booking_ref`), upcoming vs history split, and per-tour review buttons all behave as today.
6. Screenshot diff clean at 390 / 768 / 1440.

## Definition of done
- PR merged. QA runs the money path immediately.

---

# RESULT — pages built, logic partially ported (2 Sep 2026)

`my-trips.html`, `settings.html` and `itinerary.html` now render and **diff clean**, completing 104/104 pages.

What works: cart rows read from `cue_itinerary_v1`, prices come from `POST /api/pricing/quote` (never local maths), remove-from-cart, the empty state, the total, checkout into `BookConfirmModal`, and past bookings from `GET /api/bookings/mine`. The itinerary builder renders days, the suggested-plan controls, trip details, and the running total.

The class gate caught invented names again - `mtc-row__*`. The real markup from `initMyTripsCart` uses `mtc-item`, `mtc-item__title/__desc/__price/__del`, `mtc-empty__lead/__sub`, `mtc-total__label/__val`.

## NOT ported - carried forward
These behaviours exist in `initItinerary` / `initMyTripsCart` and are **not** in the React version yet:
- Adding an item to a day from a category modal (`itn-svc-modal` picker flow).
- Date cascade (`cartCascadeFrom`) and clash detection (`cartHasClash`).
- Per-item Standard/Exclusive toggle inside the builder.
- Heart/save toggle and the suggested-package browse tab.
- Transfer and charter editing rows inside the builder.
- `initSuggested` auto-fill from `SUGGEST` including airport pickup/drop-off.

The pages are structurally correct and the money path is server-priced, but **the builder is not yet at feature parity**. It must not ship in this state.

---

# UPDATE — cart rules ported, builder closer to parity (3 Sep 2026)

`lib/cart.js` ports the behaviour rules verbatim from `script.js`, kept separate
from anything that touches money:

- `cascadeFrom` - setting a day's date pushes every later day forward one day each.
- `clashDates` / `hasClash` - two full-day programmes cannot share a date.
- `setItemMode`, `removeItem`, `removeDay`.

Verified directly rather than by eye:

```
cascade from day 1 -> 2026-10-01, 2026-10-02, 2026-10-03
cascade from day 2 -> 2026-10-01, 2026-10-05, 2026-10-06
clash detected     -> [ '2026-10-01' ]
no clash           -> []
remove item        -> {"items":["B"],"itemModes":["exclusive"]}
```

The builder now has per-day dates with cascade, per-item Standard/Exclusive
toggles on full-day programmes, remove item, remove day, and a clash warning
that also disables Book.

## Still not ported
- The add-item picker that opens a category modal and writes into a chosen day
  (`itn-svc-modal`). Items still get added from the detail pages via Add to My Trip.
- Heart/save toggle and the suggested-package browse tab in My Trips.
- Transfer and charter editing rows inside the builder - they render read-only.
- `initSuggested` auto-fill from `SUGGEST`, including airport pickup and drop-off.
  The Build my itinerary button currently creates empty days rather than
  pre-filling a suggested route.
