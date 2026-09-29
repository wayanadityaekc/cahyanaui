// Charter plan row shared by the charter page and homepage; the caller adds items-*. Picked = CTA border + inset ring.
const PLAN_ROW_SHELL = 'flex gap-3 py-[0.7rem] px-[0.875rem] rounded-md';
export const PLAN_ROW = `${PLAN_ROW_SHELL} bg-white [border:1px_solid_var(--line)]`;
export const PLAN_ROW_PICKED =
  `${PLAN_ROW_SHELL} bg-cream [border:1px_solid_var(--color-cta)] [box-shadow:inset_0_0_0_1px_var(--color-cta)]`;
export const PLAN_NAME = 'block text-h3 font-semibold text-gold';
export const PLAN_SUB = 'block text-[0.66rem] leading-[1.45] text-muted';
// 'Popular' badge; needs flex-wrap next to the name or the name wraps at 320px.
export const PLAN_BADGE = 'text-label tracking-[0.1em] uppercase font-medium text-amber-d whitespace-nowrap';

// Plan price: under the name on phones, right-aligned from 993px; dark, not amber, beside a green CTA.
export const PLAN_PRICE_KICK = 'text-label tracking-[0.1em] uppercase text-muted';
export const PLAN_PRICE_LEAD = 'block text-gold font-semibold text-[1.5rem] leading-[1.15] whitespace-nowrap';

// Row grid: one DOM order (name, price, sub), stacked on phones, price in a right column from 993px.
export const PLAN_GRID =
  'flex-1 min-w-0 grid grid-cols-1 gap-x-3 min-[993px]:grid-cols-[1fr_auto] min-[993px]:items-center';
export const PLAN_CELL_NAME = 'min-[993px]:col-start-1 min-[993px]:row-start-1';
export const PLAN_CELL_SUB = 'min-[993px]:col-start-1 min-[993px]:row-start-2';
// Price spans both text rows and centres against them, whether or not the sub line wraps.
export const PLAN_CELL_PRICE =
  'min-[993px]:col-start-2 min-[993px]:row-start-1 min-[993px]:row-span-2 ' +
  'min-[993px]:self-center min-[993px]:text-right';
