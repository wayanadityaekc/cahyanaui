// Subhero (page hero) -> utilities (B-FINAL). Fully self-contained now: the old
// `subhero`/`subhero--overlap` marker classes are gone (their CSS mechanics - the gold
// divider ::before/exclusions and the overlap next-section rule - were removed/converted).
// The default bg image is overridden by an inline backgroundImage on consumers that set
// one (GuideHub, LegalPage).
export const SUBHERO =
  'relative flex items-center justify-center min-h-[60vh] pt-28 px-[var(--space-3)] pb-[var(--space-6)] ' +
  'text-center bg-green bg-cover bg-center ' +
  'bg-[image:linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.55)),url(/assets/images/homepage_hero.webp)]';
// Overlap subhero: identical to SUBHERO now (no marker needed). The following section
// pulls up over it via SUBHERO_OVERLAP_NEXT applied to that section directly.
export const SUBHERO_OVERLAP = SUBHERO;
// The section that follows an overlap subhero: -5rem pull-up, rounded top, white sheet
// (was `.subhero--overlap + section`). Applied on the next <section> in the 3 consumers
// (LegalPage, faq, itinerary).
export const SUBHERO_OVERLAP_NEXT =
  'relative z-[2] mt-[-5rem] rounded-t-[var(--r-xl)] bg-white [box-shadow:0_-12px_30px_rgba(0,0,0,0.06)]';
export const SUBHERO_CONTENT =
  'relative z-[1] w-full max-w-[720px] animate-[heroFadeIn_0.6s_ease_both] motion-reduce:animate-none';
// H1 tier: font-head 700, gold. (base .subhero__title + the grouped typography rule.)
export const SUBHERO_TITLE =
  'font-head text-[length:var(--fs-display)] leading-[var(--lh-heading)] text-gold font-bold tracking-[-0.01em]';
export const SUBHERO_TEXT =
  'mt-4 text-cream font-body text-[length:var(--fs-body)] leading-[var(--lh-body)] font-normal';
