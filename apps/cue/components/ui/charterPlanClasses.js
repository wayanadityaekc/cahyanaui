// The charter price block, shared by the charter page's plan cards
// (CharterBuilder) and the homepage's charter rates (CharterHome).
//
// Extracted rather than copied: Wayan asked for the homepage section to match the
// page ("section charter di homepage juga samain, dengan price menurun seperti di
// pagenya"), and two hand-written copies of the same block is exactly how the two
// drifted apart in the first place. One source, both places import it.
//
// Stacked, not inline: the kicker sits ABOVE the amount, in its own tinted box
// (Wayan, Sep 2026: "kanan box berisikan harga yang ukuranya lumayan gede").
// shrink-0 + nowrap so a long Rp figure wraps nothing but itself - it never
// squeezes the name column next to it.
export const PLAN_PRICE_BOX =
  'shrink-0 flex flex-col items-end text-right px-[var(--space-1)] py-[6px] rounded-md bg-cream ' +
  '[border:1px_solid_var(--line)]';
export const PLAN_PRICE_KICK = 'text-label tracking-[0.1em] uppercase text-muted';
// text-gold, NOT the amber every other price on the site uses. Same exemption the
// book bar has: the price sits right next to a green CTA and amber fights it.
// Wayan, Sep 2026: "harga warna dark seperti lainya".
export const PLAN_PRICE_BIG = 'text-gold font-semibold text-[1.35rem] leading-[1.1] whitespace-nowrap';

// The charter plan ROW, shared the same way: the homepage lists the four rates as
// rows, and the charter page's builder lists the three plans as rows you pick from.
// Same shell, one definition.
//
// The shell carries no vertical alignment - the homepage centres its rows, the
// builder top-aligns them because its tick sits beside a three-line block - so each
// consumer adds its own items-*.
//
// PLAN_ROW_ON is the highlighted row on the homepage ("Popular"; nothing there is
// selectable). PLAN_ROW_PICKED is the builder's chosen plan: the same ring plus a
// cream fill, because there it is a live choice and not a label. The ring is what
// makes the colour read as deliberate rather than a 1px slip, and it thickens the
// line without moving the box a pixel, so a highlighted row stays level.
const PLAN_ROW_SHELL = 'flex gap-3 py-[0.7rem] px-[0.875rem] rounded-md';
const PLAN_ROW_RING = '[border:1px_solid_var(--color-cta)] [box-shadow:inset_0_0_0_1px_var(--color-cta)]';
export const PLAN_ROW = `${PLAN_ROW_SHELL} bg-white [border:1px_solid_var(--line)]`;
export const PLAN_ROW_ON = `${PLAN_ROW_SHELL} bg-white ${PLAN_ROW_RING}`;
export const PLAN_ROW_PICKED = `${PLAN_ROW_SHELL} bg-cream ${PLAN_ROW_RING}`;
export const PLAN_NAME = 'block text-h3 font-semibold text-gold';
export const PLAN_SUB = 'block text-[0.66rem] leading-[1.45] text-muted';
// "Popular" beside a plan name. Never give this its own line box next to the name
// without flex-wrap: at 320px in rupiah it breaks the NAME across two lines.
export const PLAN_BADGE = 'text-label tracking-[0.1em] uppercase font-medium text-amber-d whitespace-nowrap';

// The builder's price: big, left-aligned, directly under the plan name, so the
// number is the second thing read rather than something parked in the corner
// (Wayan, Sep 2026, picking option D from the card sheet). Dark for the same reason
// the boxed one is - it sits in a row whose action is a green CTA.
export const PLAN_PRICE_LEAD = 'block text-gold font-semibold text-[1.5rem] leading-[1.15] whitespace-nowrap';
