// Subhero (page hero) -> utilities (B-FINAL). `subhero`/`subhero--overlap` classes
// are KEPT as markers only: they anchor next-sibling CSS mechanics with no Tailwind
// equivalent — `.subhero::before` / `.subhero + section::before` (divider exclusion)
// and `.subhero--overlap + section` (the following section's -5rem overlap). All the
// visual styling below is utilities. The default bg image is overridden by an inline
// backgroundImage on consumers that set one (GuideHub, LegalPage).
export const SUBHERO =
  'subhero relative flex items-center justify-center min-h-[60vh] pt-28 px-[var(--space-3)] pb-[var(--space-6)] ' +
  'text-center bg-green bg-cover bg-center ' +
  'bg-[image:linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.55)),url(/assets/images/homepage_hero.webp)]';
export const SUBHERO_OVERLAP = `${SUBHERO} subhero--overlap`;
export const SUBHERO_CONTENT =
  'relative z-[1] w-full max-w-[720px] animate-[heroFadeIn_0.6s_ease_both] motion-reduce:animate-none';
// H1 tier: font-head 700, gold. (base .subhero__title + the grouped typography rule.)
export const SUBHERO_TITLE =
  'font-head text-[length:var(--fs-display)] leading-[var(--lh-heading)] text-gold font-bold tracking-[-0.01em]';
export const SUBHERO_TEXT =
  'mt-4 text-cream font-body text-[length:var(--fs-body)] leading-[var(--lh-body)] font-normal';
