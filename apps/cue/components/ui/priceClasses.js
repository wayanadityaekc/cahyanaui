// Shared price-display utilities (B-FINAL). Mirrors the old grouped
// `.price/.price-cur/.fee` (amber + 600), `.price__sym` (symbol sized down),
// and `.price-from` ("from" prefix). `.price-unit` and `.fee` were dead in the
// React app (only the retired renderPrices JS emitted them), so no util for them.
// The `price__sym` class stays as a no-CSS hook on the symbol span so BookingForm's
// big-price context override ([&_.price__sym]:text-[0.55em] ...) still targets it.
export const PRICE = 'text-amber font-semibold';
export const PRICE_SYM = 'text-[0.66em] font-semibold [vertical-align:0.12em] mr-px';
export const PRICE_FROM = 'text-[length:var(--fs-small)] text-muted font-normal';
// IDR is always rounded to the nearest 1000 (pricing.js roundCur), so the
// trailing ".000" group never carries real precision - shown smaller so the
// significant digits read clearly and the whole number takes less width
// (Wayan, 14 Sep 2026 - fixes price text overlapping HomepageCard's meta row
// on long amounts like "Rp1.300.000").
export const PRICE_TAIL = 'text-[0.55em] [vertical-align:0.05em]';

// The pre-sale price, struck through, shown just before the sale price.
//
// A struck-through number was DELIBERATELY not copied from GetYourGuide when
// BookBar was built (see CLAUDE.md): with no list price of our own, any crossed
// number would have been an invented discount. A seasonal sale gives us a real
// one, so the strike is now the honest thing rather than the dishonest one - and
// it is only ever rendered when the two numbers actually differ.
//
// Muted and smaller on purpose: it is the number the guest is NOT paying, so it
// must not compete with the one they are. Weight stays normal so it never reads
// as the price itself.
export const PRICE_WAS =
  'text-[0.78em] font-normal text-muted line-through [text-decoration-thickness:1px] mr-[0.35em]';
