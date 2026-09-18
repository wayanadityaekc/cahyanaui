// The charter plan row, used by components/sections/CharterPlans.jsx - the one
// list that BOTH the charter page and the homepage section render (Wayan, Sep
// 2026: "reuse komponen bro"). The strings live here rather than inside that
// component so the shape stays a design decision the rest of the site can read,
// the way hsClasses.js and modalClasses.js do.
//
// The shell carries no vertical alignment: the list top-aligns its rows on a
// phone and centres them on desktop, so the caller adds its own items-*.
//
// PLAN_ROW_PICKED is the chosen plan - the same box with a CTA-coloured border,
// an inset ring and a cream fill. The ring is what makes the colour read as
// deliberate rather than a 1px slip, and it thickens the line without moving the
// box a pixel, so a chosen row stays level with the others.
const PLAN_ROW_SHELL = 'flex gap-3 py-[0.7rem] px-[0.875rem] rounded-md';
export const PLAN_ROW = `${PLAN_ROW_SHELL} bg-white [border:1px_solid_var(--line)]`;
export const PLAN_ROW_PICKED =
  `${PLAN_ROW_SHELL} bg-cream [border:1px_solid_var(--color-cta)] [box-shadow:inset_0_0_0_1px_var(--color-cta)]`;
export const PLAN_NAME = 'block text-h3 font-semibold text-gold';
export const PLAN_SUB = 'block text-[0.66rem] leading-[1.45] text-muted';
// "Popular" beside a plan name. Never give this its own line box next to the name
// without flex-wrap: at 320px in rupiah it breaks the NAME across two lines.
export const PLAN_BADGE = 'text-label tracking-[0.1em] uppercase font-medium text-amber-d whitespace-nowrap';

// The price: big, left-aligned under the plan name on a phone, right-aligned
// beside it from 993px, so the number is the second thing read rather than
// something parked in a corner (Wayan, Sep 2026, option D from the card sheet).
// Dark, not the site's amber: it sits in a row whose action is a green CTA.
export const PLAN_PRICE_KICK = 'text-label tracking-[0.1em] uppercase text-muted';
export const PLAN_PRICE_LEAD = 'block text-gold font-semibold text-[1.5rem] leading-[1.15] whitespace-nowrap';

// The row's inner grid. One DOM order (name, price, sub), two arrangements:
// stacked on a phone, and from 993px a second column that holds the price
// against the right edge, spanning both text lines (Wayan: "di desktop jelek
// bro, harga bagusnya di kanan card").
//
// A grid, not reordered flex children: flex could move the price block, but only
// by splitting the name away from its sub line, and those two belong together.
export const PLAN_GRID =
  'flex-1 min-w-0 grid grid-cols-1 gap-x-3 min-[993px]:grid-cols-[1fr_auto] min-[993px]:items-center';
export const PLAN_CELL_NAME = 'min-[993px]:col-start-1 min-[993px]:row-start-1';
export const PLAN_CELL_SUB = 'min-[993px]:col-start-1 min-[993px]:row-start-2';
// row-span-2 + self-center: the price sits level with the pair beside it rather
// than against the name's line, whether the sub line wraps or not.
export const PLAN_CELL_PRICE =
  'min-[993px]:col-start-2 min-[993px]:row-start-1 min-[993px]:row-span-2 ' +
  'min-[993px]:self-center min-[993px]:text-right';
