// Page subhero, self-contained; consumers may override the default bg image inline.
export const SUBHERO =
  'relative flex items-center justify-center min-h-[60vh] pt-28 px-[var(--space-3)] pb-[var(--space-6)] ' +
  'text-center bg-green bg-cover bg-center ' +
  'bg-[image:linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.55)),url(/assets/images/homepage_hero.webp)]';
// Overlap subhero is identical to SUBHERO; the next section pulls up via SUBHERO_OVERLAP_NEXT.
export const SUBHERO_OVERLAP = SUBHERO;
// Section after an overlap subhero: -5rem pull-up, rounded top, white sheet.
export const SUBHERO_OVERLAP_NEXT =
  'relative z-[2] mt-[-5rem] rounded-t-[var(--r-xl)] bg-white';
export const SUBHERO_CONTENT =
  'relative z-[1] w-full max-w-[720px] animate-[heroFadeIn_0.6s_ease_both] motion-reduce:animate-none';
// H1 tier: font-head 700, gold. (base .subhero__title + the grouped typography rule.)
export const SUBHERO_TITLE =
  'font-head text-[length:var(--fs-display)] leading-[var(--lh-heading)] text-gold font-bold tracking-[-0.01em]';
export const SUBHERO_TEXT =
  'mt-4 text-cream font-body text-[length:var(--fs-body)] leading-[var(--lh-body)] font-normal';
