import { BTN_SM } from '@/components/ui/btnClasses';
// Two-column rail shell (Our Company, My Trips, Settings, guides); on phones the rail becomes the first screen.

// Page width + gutter only (cap 1800); every block on a rail page uses it; callers own vertical padding.
export const PAGE_WIDE = 'max-w-[1800px] mx-auto px-[var(--container-x)]';

// Width half plus bottom padding; guide articles use it and set their own top (they open with a hero).
export const RAIL_PAGE_BOX = `${PAGE_WIDE} pb-[var(--space-5)]`;

export const RAIL_PAGE = `${RAIL_PAGE_BOX} pt-[calc(var(--header-h-max,104px)+1.9rem)]`;

// Tighter top/bottom padding for scrollContent pages; RAIL_FRAME_SCROLL's calc must shrink by the same amounts.
export const RAIL_PAGE_SCROLL =
  `${PAGE_WIDE} pb-[var(--space-3)] pt-[calc(var(--header-h-max,104px)+var(--space-3))]`;

// overflow-clip, not hidden (hidden kills the sticky menu); min-height goes on the frame, never on the rail.
const FRAME_DESK =
  'flex items-stretch bg-white [border:1px_solid_var(--line)] rounded-[var(--r-lg)] ' +
  'min-[993px]:min-h-[calc(100dvh_-_var(--header-h-max,104px)_-_1.9rem_-_var(--space-5))] ' +
  'overflow-clip max-[992px]:block';

export const RAIL_FRAME =
  `${FRAME_DESK} max-[992px]:border-none ` +
  'max-[992px]:rounded-none max-[992px]:shadow-none max-[992px]:bg-transparent';

// Guide articles: same desktop frame, but a white rounded card on phones.
export const RAIL_FRAME_CARD = `${FRAME_DESK} max-[992px]:rounded-md max-[992px]:shadow-none`;

// Frame capped to the first screen for scrollContent pages; the -60px is the footerbar and must match it.
export const RAIL_FRAME_SCROLL =
  'flex items-stretch bg-white [border:1px_solid_var(--line)] rounded-[var(--r-lg)] ' +
  'min-[993px]:h-[calc(100dvh_-_var(--header-h-max,104px)_-_var(--space-3)_-_var(--space-3)_-_60px_-_env(safe-area-inset-bottom))] ' +
  'overflow-clip max-[992px]:block';

// --- desktop rail -----------------------------------------------------------
export const RAIL_ASIDE =
  'max-[992px]:hidden flex-none w-[248px] bg-cream [border-right:1px_solid_var(--line)] ' +
  'transition-[width] duration-200 ease-[ease]';

// Collapsed rail: same as RAIL_ASIDE but 64px wide; keep the two strings identical otherwise.
export const RAIL_ASIDE_COLLAPSED =
  'max-[992px]:hidden flex-none w-[64px] bg-cream [border-right:1px_solid_var(--line)] ' +
  'transition-[width] duration-200 ease-[ease]';

// Sticks under the nav via --header-h (nav row), not --header-h-max.
export const RAIL_STICK =
  'sticky top-[var(--header-h,104px)] flex flex-col p-[1.35rem_0.9rem] ' +
  'max-h-[calc(100vh-var(--header-h,104px))] overflow-y-auto';

// Collapsed: no side padding; the icon centers itself.
export const RAIL_STICK_COLLAPSED =
  'sticky top-[var(--header-h,104px)] flex flex-col items-center p-[1.35rem_0.5rem] ' +
  'max-h-[calc(100vh-var(--header-h,104px))] overflow-y-auto';

export const RAIL_LABEL =
  'font-body text-label font-medium tracking-[0.14em] uppercase text-muted m-0 mb-[var(--space-2)] px-[0.75rem]';

// Rail row; active is a white bordered pill on the cream rail; collapsed keeps the label via title, icon only.
export function railItem(active, collapsed = false) {
  return `flex items-center ${collapsed ? 'justify-center w-9 h-9 p-0' : 'w-full text-left p-[0.55rem_0.75rem] gap-[0.65rem]'} ` +
    'rounded-[var(--r-md)] bg-transparent border-none cursor-pointer font-body text-body leading-[1.35] ' +
    '[&>svg]:w-[var(--icon-sm)] [&>svg]:h-[var(--icon-sm)] [&>svg]:shrink-0 ' +
    (active
      ? `font-semibold text-gold bg-white [border:1px_solid_var(--line)] ${collapsed ? '' : 'p-[calc(0.55rem-1px)_calc(0.75rem-1px)]'}`
      : 'text-muted [&>svg]:opacity-75 hover:text-gold');
}

// Desktop-only header row in the content column: collapse trigger + breadcrumb.
export const RAIL_HEADER =
  'max-[992px]:hidden flex items-center gap-3 pb-4 mb-[1.2rem] [border-bottom:1px_solid_var(--line)]';
export const RAIL_TRIGGER =
  'flex items-center justify-center w-8 h-8 -ml-1 rounded-[var(--r-md)] bg-transparent border-none cursor-pointer ' +
  'text-muted hover:bg-white hover:text-gold [&>svg]:w-[var(--icon-sm)] [&>svg]:h-[var(--icon-sm)]';
export const RAIL_HEADER_SEP = 'w-px h-4 bg-line shrink-0';
// Scroll mode moves padding off <main>, so the header brings its own inset.
export const RAIL_HEADER_PAD = 'min-[993px]:px-[2.1rem] min-[993px]:pt-[1.6rem]';

// Divider between the About sections and the legal sections.
export const RAIL_SPLIT = 'block h-px bg-line my-[var(--space-2)] mx-[0.75rem]';

// --- content column ---------------------------------------------------------
export const RAIL_MAIN = 'flex-1 min-w-0 p-[1.6rem_2.1rem] max-[992px]:p-0';
// Guide variant keeps card padding below 993px (that padding draws the phone card).
export const RAIL_MAIN_CARD =
  'flex-1 min-w-0 p-[1.6rem_2.1rem] max-[992px]:px-6 max-[992px]:pt-6 max-[992px]:pb-8 ' +
  'max-[560px]:px-4 max-[560px]:pt-5 max-[560px]:pb-[1.6rem]';

// Scroll mode: unpadded flex column that can't outgrow the capped frame; mobile unchanged.
export const RAIL_MAIN_SCROLL =
  'flex-1 min-w-0 min-[993px]:flex min-[993px]:flex-col min-[993px]:min-h-0 ' +
  'min-[993px]:overflow-hidden max-[992px]:p-0';
// The scrolling body; min-h-0 is required or the flex child grows the frame instead of scrolling.
export const RAIL_SCROLL_BODY =
  'min-[993px]:flex-1 min-[993px]:min-h-0 min-[993px]:overflow-y-auto ' +
  'min-[993px]:px-[2.1rem] min-[993px]:pb-[1.6rem]';

// Prose capped at --container-read but flush left, so its edge lines up with the rest of the page.
export const RAIL_READ = 'max-w-[var(--container-read)]';

// --- phone ------------------------------------------------------------------
export const RAIL_MLIST = 'min-[993px]:hidden';
export const RAIL_MLABEL =
  'font-body text-label font-medium tracking-[0.14em] uppercase text-muted m-0 mb-[var(--space-1)] px-[0.75rem]';

// Shared menu-row geometry + icon size (phone rail, navbar drawer, account menu); callers keep their own colours.
export const MENU_ROW_BOX =
  'flex items-center gap-[0.65rem] w-full text-left p-[0.7rem_0.75rem] rounded-[var(--r-md)] ' +
  '[&>svg]:w-[var(--icon-sm)] [&>svg]:h-[var(--icon-sm)] [&>svg]:shrink-0';

export function railMobileItem(active) {
  return `${MENU_ROW_BOX} ` +
    'bg-transparent border-none cursor-pointer font-body text-body leading-[1.35] ' +
    (active ? 'font-semibold text-gold bg-cream' : 'text-muted [&>svg]:opacity-75');
}

export const RAIL_MCHEV = 'ml-auto w-[var(--icon-sm)] h-[var(--icon-sm)] shrink-0 text-muted opacity-70';

export const RAIL_BACK =
  'min-[993px]:hidden flex items-center gap-[var(--space-1)] mb-[var(--space-2)] p-0 ' +
  'bg-transparent border-none cursor-pointer font-body text-body font-semibold text-gold ' +
  '[&>svg]:w-[var(--icon-sm)] [&>svg]:h-[var(--icon-sm)] [&>svg]:shrink-0';

// Help card that ends the rail, pointing to the next thing a guest usually wants.
export const RAIL_HELP =
  'mt-[var(--space-3)] mx-[0.75rem] p-[0.9rem] rounded-[var(--r-md)] bg-white ' +
  '[border:1px_solid_var(--line)] max-[992px]:mt-[var(--space-4)]';
export const RAIL_HELP_TEXT = 'font-body text-body leading-[1.45] text-muted m-0 mb-[0.6rem]';
export const RAIL_HELP_BTN =
  // Full width in the rail so the label can't overflow the 248px card; inline on phones.
  'flex w-full max-[992px]:inline-flex max-[992px]:w-auto ' +
  `${BTN_SM} gap-[0.4rem] no-underline font-body ` +
  'text-white bg-cta ' +
  '[&>svg]:w-[var(--icon-sm)] [&>svg]:h-[var(--icon-sm)] [&>svg]:shrink-0 whitespace-nowrap ' +
  '[transition:background-color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)] hover:bg-cta-d';
