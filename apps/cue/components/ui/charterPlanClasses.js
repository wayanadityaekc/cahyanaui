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
