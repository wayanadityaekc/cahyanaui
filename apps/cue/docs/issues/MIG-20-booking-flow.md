# [MIG-20] Booking flow — form, confirm modal, sidebar, book bar

**Agent:** Engine · **Depends on:** MIG-00 (hard), MIG-11 · **Money path — QA tests immediately, never batched**

## Objective
Port the booking flow exactly as it works today, with one change: prices come from the API instead of local calculation.

## Scope
1. `BookingForm` (`partials/booking.html` + `initBooking`) — the "Build Your Trip" form.
2. `BookConfirmModal` (`partials/book-confirm.html` + `initBookingConfirm`) — contact details, referral field, price breakdown, submit, WhatsApp fallback, success state.
3. `BookSidebar` (`initBookSidebar`) — the two-column layout on bookable detail pages, sticky card, plus the JS-measured offsets: `alignSideToFirstPhoto()` → `--side-offset` and `centerBreakoutTitles()` → `--title-shift` (section titles in the left column are centred on the **full viewport**, not the column).
4. `BookBar` (`initBookBar`) — mobile sticky price + CTA.
5. `TourTypeToggle` (`initTourType`) — Standard/Exclusive. On detail pages it also flips ticket rows between Included/Excluded via `.is-exclusive`, and syncs the choice into the booking form.
6. `DatePopup` (`bookDatePopup`) and the universal `bookNow()` → date → add-to-cart → toast path.
7. **Pricing:** `POST /api/pricing/quote` before opening the confirm modal. `POST /api/inquiry` stays the final authority; if the server price differs from what was displayed, show the server number.

## Out of scope
- **Payment.** There is no payment integration; Xendit registration is still pending. "Make Payment" keeps its current behaviour — it opens this modal and creates an inquiry. Leave a clear hook point after `/api/inquiry` returns a `ref` so Xendit drops in later without rework.
- Redesigning any field, label, validation message, or the field order.

## Input
- `script.js` `initBooking` (~1634–1790), `initBookingConfirm` (~1415–1633), `initBookSidebar`, `initBookBar`, `initTourType`, `bookDatePopup`.
- `partials/booking.html`, `partials/book-confirm.html`.
- MIG-00 endpoint contracts.

## Acceptance criteria
1. `/api/inquiry` payload shape unchanged: `{ type, service, name, phone, email, referral, lines:[…] }` with `flight_number` / `flight_datetime` / `time` preserved for transfers and charters.
2. Validation messages and order identical to today (name → phone → email → pickup → dropoff).
3. Auto-login after booking still works: response `token` stored when not already logged in, account state and navbar dot update.
4. WhatsApp fallback produces the same message format.
5. CTA buttons keep their own height (~46px / `2.9rem`) — they do **not** inherit `--field-h`.
6. Golden test: 10 representative bookings priced through the UI match `/api/pricing/quote` and the value stored by `/api/inquiry`.

## Definition of done
- PR merged. QA runs the money path immediately.
- Confirmed: no booking can be submitted at a client-chosen price.
