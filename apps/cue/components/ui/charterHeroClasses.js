// Tailwind utility strings for the shared "charter hero" band (dark photo hero with a
// centered title/sub + a builder/form below). Used by BOTH the /charter page
// (CharterSection, bg road-ubud) and /airport-transfer (bg transfer-hero) — so the
// strings live here ONCE and each site adds its own bg-[url(...)]. Mirror of the old
// `.charter-hero*` rules in style.css (migrasi Sep 2026, komponen self-contained).
//
// Nilai = mirror PERSIS computed style lama. Base WRAPPER sengaja tanpa bg image
// (cuma bg-center/bg-cover + overlay gradient) — tiap pemakai nambahin bg-[url(...)]-nya.

// .charter-hero (minus the background image): position/size + gradient overlay via ::before.
export const CHARTER_HERO =
  'relative min-h-[620px] flex items-center justify-center bg-center bg-cover pt-28 px-[1.3rem] pb-12 ' +
  "before:content-[''] before:absolute before:inset-0 " +
  'before:bg-[linear-gradient(180deg,rgba(0,0,0,0.5),rgba(0,0,0,0.64))]';

// .charter-hero__inner
export const CHARTER_HERO_INNER = 'relative z-[2] w-full max-w-[600px] text-center';

// .charter-hero__title (H1) — weight 500 (NOT the 700 "Tier display H1" block).
export const CHARTER_HERO_TITLE =
  'font-head font-medium tracking-[-0.01em] text-display leading-[var(--lh-heading)] text-white m-0 mb-[0.4rem]';

// .charter-hero__sub
export const CHARTER_HERO_SUB =
  'text-[rgba(255,255,255,0.9)] text-body leading-[1.5] mx-auto mb-[1.6rem] max-w-[460px]';
