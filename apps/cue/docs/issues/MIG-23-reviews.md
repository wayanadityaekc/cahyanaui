# [MIG-23] Reviews — strip, modal, gate untouched

**Agent:** Engine · **Depends on:** MIG-11, MIG-22

## Objective
Port the review display and submission flow. **The gate is login-only and stays exactly as it is** — this is Wayan's decision on the brief's parked item (Q3).

## Scope
1. `ReviewsStrip` — homepage and `all-reviews.html` from `GET /api/reviews`; per-page strip from `GET /api/reviews?service=…` (`initTourReviews`). Per-page strip renders nothing at all when empty — no "be the first" state outside the homepage and all-reviews.
2. `ReviewModal` (`partials/review-modal.html`) — opens **only** from a "Leave a Review" button on a real booking in My Trips, always with a prefill `{ ref, items, name }`, straight to the write step.
3. Multi-tour bookings: "which tour" checklist, one rating + text block per checked tour, blocks rendered for all items and shown/hidden by checkbox so typed text is never lost.
4. `initReviewCta` — the bottom-of-page "Leave a review" button on bookable pages links to `my-trips.html`. It never opens the modal directly.
5. Submit via `POST /api/reviews` with the session token.

## Out of scope — read this carefully
- **Do not add a guest-typed booking-reference path.** The anonymous booking_ref + contact route was deliberately removed (cahyana-api commit `3bb2766`, QA decision #16) and Wayan has confirmed login-only. The `booking_ref` stays an internal prefill, never a user-entered field.
- Do not weaken or duplicate the server gate: session token + booking_ref owned by that account + trip date passed + not already reviewed + one review per `(booking_ref, service)`. All of it is server-side and correct.
- Do not add fake or seeded reviews. Empty state over invented data.

## Input
- `script.js` ~2841–3103 (`renderReviewCard`, `initReviews`, `initAllReviews`, `initTourReviews`, `initReviewCta`, `openReviewModal`, `wireReviewModal`).
- `partials/review-modal.html`.

## Acceptance criteria
1. The modal cannot be opened without a valid prefill from a real booking.
2. A submission with a tampered `booking_ref` is rejected by the server — verified with an actual request.
3. Rating stars render in `amber`.
4. Toggling a tour's checkbox does not lose text already typed in its block.
5. Empty review list on a tour page renders no section at all.

## Definition of done
- PR merged; the reject path tested against the live API, not assumed.
