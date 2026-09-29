// Shared price classes; the price__sym class stays as a no-CSS hook that BookingForm's override targets.
export const PRICE = 'text-amber font-semibold';
export const PRICE_SYM = 'text-[0.66em] font-semibold [vertical-align:0.12em] mr-px';
export const PRICE_FROM = 'text-[length:var(--fs-small)] text-muted font-normal';
// IDR ends in '.000' (rounded to 1000), so that tail is shown smaller to keep long prices narrow.
export const PRICE_TAIL = 'text-[0.55em] [vertical-align:0.05em]';

// Struck pre-sale price, rendered only when list and sale differ; muted, smaller, normal weight.
export const PRICE_WAS =
  'text-[0.78em] font-normal text-muted line-through [text-decoration-thickness:1px] mr-[0.35em]';
