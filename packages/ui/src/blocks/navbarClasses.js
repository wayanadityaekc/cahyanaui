/**
 * The navbar's class strings, apart from the component so a site can build an
 * unusual row (a promo strip, an extra icon) without re-deriving the look.
 */

// The bar is FIXED. Everything under it reads one of two height variables, and
// they answer two different questions:
//   --header-h      how tall the bar is RIGHT NOW  (sticky things under it)
//   --header-h-max  how tall it ever gets          (page top padding)
// Page padding must read the ceiling, or the document jumps under the reader
// the first time the bar's contents shrink mid-scroll.
//
// leading-[normal] and text-green are not cosmetic. A site whose <body> sets a
// line-height (1.6 is typical for body copy) leaks it into every row in here:
// measured on the villa site, each nav link came out 5px taller than CUE's
// (46.4px vs 41px). Pinning the subtree keeps the bar identical on both sites
// without touching body copy anywhere else.
export const NAV_HEADER =
  'fixed top-0 left-0 right-0 z-[100] w-full leading-[normal] text-green bg-white ' +
  'shadow-[0_2px_12px_rgba(31,61,43,0.07)] animate-[navbarIn_0.4s_ease-out] motion-reduce:animate-none';

export const NAV_ROW = 'flex justify-between items-center max-w-[var(--container-wide)] mx-auto py-[0.55rem] px-6';

// The icon cluster's spacing pair. Both icons use it, so changing one without
// the other is immediately visible. No `relative` here: only the icon that
// carries a badge needs a positioning context, and giving one to the others
// changes what an absolutely-positioned child inside them would anchor to.
export const NAV_ICON =
  'inline-flex items-center text-gold mr-[1.3rem] ' +
  'transition-[color] duration-200 ease-[ease] hover:text-gold-d max-[992px]:mr-[0.85rem]';

// The count that rides a cart icon.
export const NAV_BADGE =
  'absolute top-[-7px] right-[-9px] bg-gold inline-flex items-center justify-center ' +
  'min-w-[18px] h-[18px] px-[5px] rounded-pill text-white text-label font-semibold leading-none [&[hidden]]:hidden';

// The drawer. It is a PANEL COVERING the bar, not content starting below it -
// fixed, full height, higher z - which is why its first row sits at the top of
// the screen and not at --header-h.
//
// It animates on `translate`. In Tailwind v4 `translate-x-*` compiles to the
// standalone `translate:` property and NOT into `transform:`, so a transition
// naming `transform` animates nothing and the drawer teleports. This has bitten
// CUE in five separate places.
export const NAV_DRAWER =
  'fixed top-0 right-0 bottom-0 left-auto w-4/5 max-w-[340px] max-[992px]:max-w-[360px] h-[100dvh] ' +
  'bg-white shadow-[-14px_0_40px_rgba(26,26,26,0.2)] px-[22px] pb-[30px] overflow-y-auto ' +
  '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden overscroll-contain ' +
  'transition-[translate] duration-300 ease-[var(--ease)] motion-reduce:transition-none ' +
  'z-[120] flex flex-col items-stretch text-left gap-0 list-none';

// The drawer's top line. Negative side margins let its hairline reach the full
// width, and it is the ONLY border in the drawer: per-link borders read as too
// many lines, which is why CUE dropped them.
export const NAV_DRAWER_HEAD =
  'flex items-center gap-[10px] bg-white [border-bottom:1px_solid_var(--line)] [border-color:var(--line)] ' +
  'mx-[-22px] pt-[0.8rem] px-[22px] pb-[0.8rem]';

export const NAV_SCRIM =
  'fixed inset-0 bg-[rgba(26,26,26,0.45)] z-[95] transition-[opacity,visibility] duration-300 ease-[var(--ease)]';

// Each link is a full-width block carrying its own vertical padding, so the
// spacing between links comes from the links rather than from borders.
export const navLink = (active) =>
  active
    ? 'block w-full py-3 text-left text-strong font-medium no-underline text-green max-[992px]:text-gold-d'
    : 'block w-full py-3 text-left text-strong font-medium no-underline text-gold hover:text-green max-[992px]:hover:text-gold-d';

export const NAV_SUBLINK =
  'block text-small font-medium no-underline text-gold hover:text-green max-[992px]:hover:text-gold-d';

// The hamburger's three bars, which morph into an X.
export const NAV_BURGER_BAR =
  'w-full h-[2px] bg-gold max-[992px]:w-[22px] ' +
  '[transition:translate_var(--dur)_var(--ease),rotate_var(--dur)_var(--ease),opacity_var(--dur-fast)_var(--ease)] ' +
  'motion-reduce:transition-none';
