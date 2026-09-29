// Shared card utility strings, defined once and imported.

// "Popular" badge pill in the card corner.
export const BADGE_POPULAR =
  'absolute top-[0.8rem] right-[0.8rem] bg-amber text-gold text-label font-semibold tracking-[0.04em] uppercase rounded-sm py-[0.2rem] px-[0.7rem]';

// Card frame; no display (callers add it) and no hover lift or transition on purpose.
export const CARD_FRAME =
  'relative rounded-lg p-[5px] overflow-hidden bg-white no-underline text-inherit shadow-card';

// Square card photo wrapper with a bottom gradient so white text stays readable.
export const CARD_IMAGE =
  'relative aspect-square rounded-md overflow-hidden bg-green bg-cover bg-center ' +
  "after:content-[''] after:absolute after:inset-0 after:bg-[linear-gradient(to_bottom,transparent_55%,rgba(31,61,43,0.45))]";
// <img> di dalam CARD_IMAGE (dulu `.experience__image > img`): fill + cover.
export const CARD_IMG = 'absolute inset-0 w-full h-full object-cover object-center';
