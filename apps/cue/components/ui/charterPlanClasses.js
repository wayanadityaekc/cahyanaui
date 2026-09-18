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

// The charter plan ROW, shared the same way: the homepage lists the four rates
// as rows, and the charter page's builder lists the three plans as rows you pick
// from. Same shape, one definition.
//
// PLAN_ROW_ON is the highlighted row. It means "Popular" on the homepage (nothing
// there is selectable) and "this is the plan you are booking" in the builder - the
// same visual either way: a CTA-coloured border plus an inset ring. The ring is
// what makes the colour read as deliberate rather than as a 1px slip, and it
// thickens the line without moving the box a pixel, so a highlighted row stays
// level with the others.
const PLAN_ROW_BASE = 'flex items-center gap-3 py-[0.7rem] px-[0.875rem] rounded-md bg-white';
export const PLAN_ROW = `${PLAN_ROW_BASE} [border:1px_solid_var(--line)]`;
export const PLAN_ROW_ON =
  `${PLAN_ROW_BASE} [border:1px_solid_var(--color-cta)] [box-shadow:inset_0_0_0_1px_var(--color-cta)]`;
export const PLAN_NAME = 'block text-h3 font-semibold text-gold';
export const PLAN_SUB = 'block text-[0.66rem] leading-[1.45] text-muted';
