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
