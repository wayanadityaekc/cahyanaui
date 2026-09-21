// The two-column "mail app" shell: a tinted rail of sections on the left, the
// chosen section's content on the right (Sep 2026, Wayan picked "opsi A" from a
// sheet of three rails, then "hp 3" for the phone).
//
// Shared because Our Company and My Trips are meant to be the same page shape.
// Keeping one copy of the strings is what stops them drifting apart, the same
// reason DetailHero and detailCardClasses exist.
//
// DESKTOP: one bordered box, cream rail + white content. The rail is a flex
// child with no height of its own, so it stretches to the box and the cream
// paints the full column; the menu inside it is what sticks.
// PHONE (<=992px): there is no room for a column, so the rail becomes the first
// screen - a full-width list - and a section opens over it with a back row.
// Only the CONTENTS carry over (icons, the About/Legal split, the section
// label), not the shape.

// --- page + frame -----------------------------------------------------------
export const RAIL_PAGE =
  'max-w-[1180px] mx-auto px-[var(--container-x)] ' +
  'pt-[calc(var(--header-h-max,104px)+1.9rem)] pb-[var(--space-5)]';

// overflow-CLIP, not overflow-hidden. Both clip the rail's cream to the rounded
// corner, but `hidden` also makes the frame a scroll container, and a sticky child
// sticks to its nearest scrolling ancestor - so the menu would scroll away with
// the page and never pin under the header. `clip` does not create one.
// (Pre-Safari-16 falls back to visible: the corner shows square, the page works.)
export const RAIL_FRAME =
  'flex items-stretch bg-white [border:1px_solid_var(--line)] rounded-[var(--r-lg)] ' +
  'overflow-clip [box-shadow:var(--shadow-md)] max-[992px]:block max-[992px]:border-none ' +
  'max-[992px]:rounded-none max-[992px]:shadow-none max-[992px]:bg-transparent';

// --- desktop rail -----------------------------------------------------------
export const RAIL_ASIDE =
  'max-[992px]:hidden flex-none w-[248px] bg-cream [border-right:1px_solid_var(--line)]';

// Sticks to the bottom of the live header, so it keeps its place while the
// content column scrolls. --header-h (live) not --header-h-max: the frozen one
// would leave a gap under the navbar once the trip bar closes.
export const RAIL_STICK =
  'sticky top-[var(--header-h,104px)] flex flex-col p-[1.35rem_0.9rem] ' +
  'max-h-[calc(100vh-var(--header-h,104px))] overflow-y-auto';

export const RAIL_LABEL =
  'font-body text-label font-medium tracking-[0.14em] uppercase text-muted m-0 mb-[var(--space-2)] px-[0.75rem]';

// One row of the rail. The active row is a raised white pill - the rail is
// already cream, so "lifted out of the tint" is what reads as selected here.
export const railItem = (active) =>
  'flex items-center gap-[0.65rem] w-full text-left p-[0.55rem_0.75rem] rounded-[var(--r-md)] ' +
  'bg-transparent border-none cursor-pointer font-body text-body leading-[1.35] ' +
  '[&>svg]:w-[var(--icon-sm)] [&>svg]:h-[var(--icon-sm)] [&>svg]:shrink-0 ' +
  (active
    ? 'font-semibold text-gold bg-white [border:1px_solid_var(--line)] [box-shadow:var(--shadow-sm)] p-[calc(0.55rem-1px)_calc(0.75rem-1px)]'
    : 'text-muted [&>svg]:opacity-75 hover:text-gold');

// Splits "about us" from "the legal small print" - two different reasons to be
// on this page, so they should not read as one run of six.
export const RAIL_SPLIT = 'block h-px bg-line my-[var(--space-2)] mx-[0.75rem]';

// --- content column ---------------------------------------------------------
export const RAIL_MAIN = 'flex-1 min-w-0 p-[1.6rem_2.1rem] max-[992px]:p-0';
// Prose is capped for line length but sits flush left, the same compromise the
// guide articles make: the left edge lines up with everything else on the page,
// the lines stay readable.
export const RAIL_READ = 'max-w-[var(--container-read)]';

// --- phone ------------------------------------------------------------------
export const RAIL_MLIST = 'min-[993px]:hidden';
export const RAIL_MLABEL =
  'font-body text-label font-medium tracking-[0.14em] uppercase text-muted m-0 mb-[var(--space-1)] px-[0.75rem]';

// The GEOMETRY of one menu row: flex, gap, padding, radius, full width. Shared
// with the navbar drawer (Sep 2026, Wayan picked "B" from a sheet of three) - its
// rows used to be plain text with a colour-only hover while these already had a
// pill, so one site had two kinds of menu row. One string is what stops them
// drifting apart again, the same reason DetailHero and FormHero exist.
//
// Only the SHAPE travels. Each side keeps its own type and colours: the rail's
// rows are muted body text, the drawer's are --fs-strong in soft black.
// The DESKTOP rail row is deliberately NOT built from this - it runs a tighter
// 0.55rem padding, and a drawer row has to stay thumb-sized.
export const MENU_ROW_BOX =
  'flex items-center gap-[0.65rem] w-full text-left p-[0.7rem_0.75rem] rounded-[var(--r-md)]';

export const railMobileItem = (active) =>
  `${MENU_ROW_BOX} ` +
  'bg-transparent border-none cursor-pointer font-body text-body leading-[1.35] ' +
  '[&>svg]:w-[var(--icon-sm)] [&>svg]:h-[var(--icon-sm)] [&>svg]:shrink-0 ' +
  (active ? 'font-semibold text-gold bg-cream' : 'text-muted [&>svg]:opacity-75');

export const RAIL_MCHEV = 'ml-auto w-[var(--icon-sm)] h-[var(--icon-sm)] shrink-0 text-muted opacity-70';

export const RAIL_BACK =
  'min-[993px]:hidden flex items-center gap-[var(--space-1)] mb-[var(--space-2)] p-0 ' +
  'bg-transparent border-none cursor-pointer font-body text-body font-semibold text-gold ' +
  '[&>svg]:w-[var(--icon-sm)] [&>svg]:h-[var(--icon-sm)] [&>svg]:shrink-0';

// --- help card --------------------------------------------------------------
// The rail runs out well before the fold. Rather than pad it with nothing, it
// ends on the one thing a guest reading policies most often wants next.
export const RAIL_HELP =
  'mt-[var(--space-3)] mx-[0.75rem] p-[0.9rem] rounded-[var(--r-md)] bg-white ' +
  '[border:1px_solid_var(--line)] max-[992px]:mt-[var(--space-4)]';
export const RAIL_HELP_TEXT = 'font-body text-body leading-[1.45] text-muted m-0 mb-[0.6rem]';
export const RAIL_HELP_BTN =
  // Full width inside the rail: the label is 16 characters in a 248px column,
  // so any inline size is one font tweak away from poking out of the card.
  // Stretching it removes the failure mode instead of tuning around it.
  'flex w-full justify-center max-[992px]:inline-flex max-[992px]:w-auto ' +
  'items-center gap-[0.4rem] no-underline font-body text-body font-semibold ' +
  'text-white bg-cta rounded-[var(--r-pill)] py-[0.45rem] px-[0.9rem] ' +
  '[&>svg]:w-[var(--icon-sm)] [&>svg]:h-[var(--icon-sm)] [&>svg]:shrink-0 whitespace-nowrap ' +
  '[transition:background-color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)] hover:bg-cta-d';
