# Bundled bookings on the villa site

Brief #14. Wayan answered the 4 open questions (1 Oct 2026, below). The **site
side is built**; the server side (one booking reference, online payment,
availability check) still waits for the cahyana-api un-park.

## Wayan's answers

1. Payment: the villa is paid in full at booking. Tours and activities (CUE
   programs) take a small deposit now, the rest on the day. Spa, breakfast,
   scooter and similar are paid at the villa, never charged upfront.
2. Keep the starting list of 4 tours and 4 activities for now.
3. Extras can be added after booking too, from My Booking.
4. Offer both arrival and departure airport transfers.

## What is built (site side)

- Library: `ExtrasPanel` block; `DateField` gained `max`.
- Villa: `lib/extras.js` (the list, rules, prices, deposit split),
  `lib/timeSlots.js` (CUE's start-time rules, copied), `lib/bookingMessage.js`,
  `components/trip/ExtrasSection.jsx` + `useExtrasCatalog.js`, extras in the cart.
- My Booking shows the extras; the booking sheet links there ("Add extras").
- Prices come from `/api/pricing/catalog` in the guest's currency and group
  size; "-" and a blocked send while it has not answered.
- One flat deposit (the catalog's `deposit`, $10) for all CUE extras together,
  as on CUE; airport transfers are counted with the CUE extras (flagged to Wayan).
- Booking still goes out as a WhatsApp message, now listing each extra with its
  date, start time, flight and price, the deposit split, and the villa services
  marked "paid at the villa".
- Not built yet: the private driver (charter) rows below, and exact-minute
  flight times (the transfer asks for a half-hour time plus the flight number).

## What the guest does

1. Picks a villa and dates (as today).
2. Before paying, sees **"Add to your stay"**, three groups:
   - **Airport transfer**: arrival (on the check-in date) and/or departure
     (on the check-out date). Asks for the flight number and time, CUE's
     `DateTimeField` with real minutes, like CUE's airport form.
   - **Private driver (charter)**: CUE's charter list (5h / 10h / 12h), one
     row per day, the day picked from the stay's nights.
   - **Tours and activities**: 8 cards, each with its own date (inside the
     stay) and start time (CUE's `TimeChoice`, same slot rules per item).
3. One summary, one total, one payment: the stay line plus each extra.

Pick-up is always the villa, and both villas are in Ubud. CUE's pick-up
surcharge for Ubud is 0, so there is no pick-up field at all.

## Starting set (placeholders; Wayan tweaks the list)

Catalog keys exactly as the API prices them:

| group | catalog key |
|---|---|
| Tour | Ubud Tour |
| Tour | Ubud Culture Day |
| Tour | East Bali Tour |
| Tour | West Bali Tour |
| Activity | Mount Batur Trekking |
| Activity | Rafting |
| Activity | Cooking Class |
| Activity | Kecak Dance |
| Transfer | Airport – Ubud |
| Charter | half / full / long |

None of these is a parked CUE tour (`HIDDEN_TOURS`). The list is data, one
array, so changing it is a one-line edit.

## Rules

- **Dates**: an extra's date must fall inside the stay (check-in to
  check-out). Arrival transfer = check-in date; departure = check-out date.
- **Times**: CUE's `content/shared/timeSlots.js` rules per catalog key (Kecak
  7 PM, Batur 2-3 AM, tours 8-9 AM, transfers free). The category comes from
  the catalog, never from the page (CUE's `categoryOf` lesson).
- **Guests**: default to the stay's guests, editable per extra, capped at the
  villa's maximum. Transfers and charter are per car (a second car above 5,
  as on CUE).
- **Prices**: always from `/api/pricing/catalog` and `/api/pricing/quote` in
  the guest's currency, the same rates and ladder as CUE. No fallback numbers
  in the site: show "-" until the API answers, like CUE's charter.
- **Currency**: one currency for the whole booking; rupiah is the base.

## Payment and cancellation (decisions for Wayan)

- The villa is **paid in full** at booking; CUE's tours allow a **$10
  deposit**. In a bundle:
  - **(a) Recommended**: pay everything in full, one charge. One rule on the
    payment screen, one refund story, and the villa rule already needs a
    full payment.
  - (b) Villa in full, extras by deposit: two payment rules on one screen, and
    a refund that splits.
- **Cancellation is per line, shown per line**: the villa follows "Firm"
  (30 days full, 7 days half); each extra keeps CUE's free cancellation up to
  24 hours before. Cancelling the villa does not silently cancel the extras,
  so the summary says so.

## Backend work (blocked on the un-park)

1. **Catalog**: correct `prices.villa` (it still holds Rp1.480.000 /
   Rp1.250.000; Wayan's figures are Rp2.500.000 / Rp1.700.000). Price a villa
   line by nights in `quote()`, so the villa site stops mirroring the rounding
   rule (today's G5 stopgap).
2. **Availability**: `/api/inquiry` refuses a villa line whose nights are
   busy, and refuses when villas-api says `known: false` (an unknown calendar
   is not a free one).
3. **Booking**: `/api/inquiry` takes a villa line plus extras under one
   `booking_ref`, marked `site: villas`, with the date-inside-stay rule
   checked on the server (validate.js).
4. **Payment**: `payment.js` forces option "full" when a villa line is
   present (or implements (b), if chosen). The nominal still comes only from
   the server, and `paid` still comes only from the webhook.
5. **Email and dashboard**: the confirmation lists every line with its own
   cancellation rule; the dashboard already groups by `booking_ref`.

## Frontend work (after the backend)

- Library: an `ExtrasPanel` block (presentational: groups, cards, date and
  time slots), reusing `DateField`, `TimeChoice` and CUE's charter list.
- Villa: wiring into the booking sheet and My Booking, prices from the
  catalog, and the quote for totals.
- Checks: dates outside the stay are refused, every price equals the API, one
  total equals the sum of the lines, and each line shows its own cancellation
  rule.

