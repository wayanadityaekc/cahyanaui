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

// The count on a cart icon or a menu row. Two exports, because the badge sits
// in two places: pinned to the corner of the navbar's icon, and inline at the
// right-hand end of a drawer row.
export const NAV_BADGE_BASE =
  'inline-flex items-center justify-center min-w-[18px] h-[18px] px-[5px] rounded-pill ' +
  'text-white text-label font-semibold leading-none [&[hidden]]:hidden';

export const NAV_BADGE = `absolute top-[-7px] right-[-9px] bg-gold ${NAV_BADGE_BASE}`;

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

/**
 * A MENU ROW. Ported from CUE (components/ui/railClasses.js MENU_ROW_BOX) - the
 * same string its navbar drawer and its Our Company / My Trips rails use, so a
 * row of navigation looks the same wherever either site puts one.
 *
 * Icon size lives IN here rather than at each call site, because Lucide renders
 * width/height=24 when given none: "what a menu row looks like" and "how big
 * its icon is" are one decision, not two places to forget.
 */
export const MENU_ROW_BOX =
  'flex items-center gap-[0.65rem] w-full text-left p-[0.7rem_0.75rem] rounded-[var(--r-md)] ' +
  '[&>svg]:w-[var(--icon-sm)] [&>svg]:h-[var(--icon-sm)] [&>svg]:shrink-0';

/**
 * The row's 12px inner padding has to come back out of the drawer's own 22px,
 * or every label shifts 12px right and stops lining up with the head row above
 * it. So the PILL grows outward; the text does not move in. Change this and the
 * submenu indent below has to change with it.
 */
export const NAV_LI = '-mx-3';

/** Submenu indent: 0.9rem of its own, plus the 0.75rem NAV_LI borrowed back. */
export const NAV_SUBLIST = 'list-none mt-[0.1rem] mb-[0.2rem] pt-[0.2rem] pb-[0.5rem] pl-[1.65rem] block';

// A link is the row shape plus its state colour. Active reads as a raised cream
// pill, which is what "you are here" looks like on both sites now.
export const navLink = (active) =>
  `${MENU_ROW_BOX} text-strong no-underline ` +
  (active
    ? 'font-semibold bg-cream text-green max-[992px]:text-gold-d'
    : 'font-medium text-gold hover:bg-cream hover:text-green max-[992px]:hover:text-gold-d');

// The same row, as a <button>, for a submenu trigger.
export const NAV_SUBTRIGGER =
  `${MENU_ROW_BOX} text-strong font-body font-medium border-none bg-transparent text-gold cursor-pointer hover:bg-cream hover:text-green`;

// The drawer's close button. The drawer has no other way to say "close me": the
// hamburger is COVERED by it (measured - drawer is fixed right-0 at z-120, the
// header sits at z-100, and a hit-test at the hamburger's centre lands inside
// the drawer at both 390 and 1280), so the hamburger's morph into an X is never
// visible while the menu is open.
//
// No `transition` of its own, deliberately: that lets the global press-feedback
// rule apply instead of being overridden by a narrower one.
export const NAV_CLOSE =
  'ml-auto flex-none grid place-items-center w-[34px] h-[34px] rounded-[var(--r-md)] ' +
  '[border:1px_solid_var(--line)] bg-white text-gold cursor-pointer [&>svg]:w-4 [&>svg]:h-4 ' +
  '[transition:background-color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)] hover:bg-cream';

export const NAV_SUBLINK =
  'block text-small font-medium no-underline text-gold hover:text-green max-[992px]:hover:text-gold-d';

// A badge or chevron riding the right-hand end of a row.
export const NAV_ROW_END = 'ml-auto';

// The hamburger's three bars, which morph into an X.
export const NAV_BURGER_BAR =
  'w-full h-[2px] bg-gold max-[992px]:w-[22px] ' +
  '[transition:translate_var(--dur)_var(--ease),rotate_var(--dur)_var(--ease),opacity_var(--dur-fast)_var(--ease)] ' +
  'motion-reduce:transition-none';
