# [MIG-93] Release gate: money path

**Agent:** QA · **Depends on:** MIG-00, MIG-20, MIG-21 · **Runs immediately on each merge, never batched**

## Objective
Verify everything touching money. Per the QA cadence: a broken layout can wait a day, a wrong price cannot.

## Scope
1. **Pricing parity** — every item × 5 currencies × guest counts 1–10 × standard/exclusive: displayed price vs `/api/pricing/quote` vs the value stored by `/api/inquiry`. All three must agree.
2. **Rounding** — `Math.ceil` to whole USD and to 10k IDR; `guests > 5 → 2 cars`; per-car vs per-person by category; return transfer ×2 −10%; pickup surcharge only when the pickup zone differs from the item zone.
3. **Currency switching** — all 5 currencies, correct symbols (`A$` distinct from `$`), persisted in `cue_currency`, page total equals the sum of the visible card prices.
4. **Referral** — each valid code applies its correct percentage; an invalid code is rejected; the discount is applied **server-side**; display shows struck-through old price + amber new price.
5. **Tamper test** — submit `/api/inquiry` with a manipulated `price_usd`. The stored price must be the server's, not the client's.
6. **Leak test** — the shipped JS bundle contains no `EXCLUSIVE_FEE`, no `TICKETS` table, and no referral codes. Grep the built output to prove it.
7. **Booking submit** — direct booking, multi-day itinerary, transfer with flight details, charter with pickup time: all land in the database with the right `booking_ref`, `day_no`, prices, and both emails sent.

## Acceptance criteria
All seven pass. Any failure blocks the merge, not just the cutover.

## Definition of done
- Full results table attached. Item 6 is the one that closes the current price/discount leak, so state it explicitly as pass or fail.
