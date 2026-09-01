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
