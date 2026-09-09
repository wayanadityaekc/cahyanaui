// Shared card utility strings (full-portable migrasi). Didefinisiin SEKALI, di-import
// komponen yang butuh biar gak keduplikat & style.css bisa dikecilin.

// Badge "Popular"/featured (amber pill di pojok kartu). Dulu `.chcard__badge` -
// dipake CharterHome + ExperienceCard.
export const BADGE_POPULAR =
  'absolute top-[0.8rem] right-[0.8rem] bg-amber text-gold text-label font-semibold tracking-[0.04em] uppercase rounded-pill py-[0.2rem] px-[0.7rem]';

// Frame kartu (dulu base `.experience__card`): putih inset radius + shadow-md + hover
// lift. DISPLAY sengaja gak diikutin di sini - ditambah per komponen (`flex flex-col`
// buat kartu standar, `block` buat kartu tourprog "See our tours"). Dipake
// ExperienceCard / GuideCard / GuideMore (you-might) / GuideHome (CTA more).
export const CARD_FRAME =
  'relative rounded-lg p-[5px] overflow-hidden bg-white [box-shadow:var(--shadow-md)] no-underline text-inherit ' +
  '[transition:transform_var(--dur-slow)_ease,box-shadow_var(--dur-slow)_ease] hover:[transform:translateY(-4px)] hover:[box-shadow:var(--shadow-lg)]';

// Foto kartu persegi (dulu `.experience__image` + ::after gradient). Wrapper pegang
// rasio/radius/overflow; gradient gelap dari bawah biar teks putih (kalau ada) kebaca.
export const CARD_IMAGE =
  'relative aspect-square rounded-md overflow-hidden bg-green bg-cover bg-center ' +
  "after:content-[''] after:absolute after:inset-0 after:bg-[linear-gradient(to_bottom,transparent_55%,rgba(31,61,43,0.45))]";
// <img> di dalam CARD_IMAGE (dulu `.experience__image > img`): fill + cover.
export const CARD_IMG = 'absolute inset-0 w-full h-full object-cover object-center';
