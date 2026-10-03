import { BTN_SM } from '../primitives/btnClasses.js';
import { MENU_ROW_BOX } from './navbarClasses.js';

/**
 * The rail shell: a sticky side menu beside a content column (an "our company"
 * page, an account page, a trip list, guide articles). On phones the rail
 * becomes the first screen - a list of sections - and a section opens with a
 * back row above it.
 *
 * Two things that fail silently, both measured on CUE:
 *   - overflow-clip on the frame, NEVER overflow-hidden. hidden makes the frame
 *     a scroll container and the sticky menu stops sticking, with no error.
 *   - min-height goes on the FRAME, never on the rail. The rail is a flex child
 *     of an items-stretch row, so the frame growing is what carries the tint to
 *     the bottom; a rail with its own height leaves a white hole under it.
 * The frame is a card, so its corners are square like every card here; the
 * active row is a control and keeps its radius.
 */

// Page width + gutter; every block on a rail page uses it. Callers own vertical padding.
export const PAGE_WIDE = 'max-w-[1800px] mx-auto px-[var(--container-x)]';
export const RAIL_PAGE = `${PAGE_WIDE} pb-[var(--space-5)] pt-[calc(var(--header-h-max,104px)+1.9rem)]`;
// Tighter padding for scrollContent pages; RAIL_FRAME_SCROLL's calc shrinks by the same amounts.
export const RAIL_PAGE_SCROLL = `${PAGE_WIDE} pb-[var(--space-3)] pt-[calc(var(--header-h-max,104px)+var(--space-3))]`;

const FRAME_DESK =
  'flex items-stretch bg-surface-raised [border:1px_solid_var(--line)] ' +
  'min-[993px]:min-h-[calc(100dvh_-_var(--header-h-max,104px)_-_1.9rem_-_var(--space-5))] ' +
  'overflow-clip max-[992px]:block';

// Default: on phones the frame disappears and the page is the list.
export const RAIL_FRAME = `${FRAME_DESK} max-[992px]:border-none max-[992px]:bg-transparent`;

// Phones keep the frame as a card around the content (guide articles).
export const RAIL_FRAME_CARD = FRAME_DESK;

// Frame capped to the first screen, only the content column scrolls. On phones it keeps its border,
// so it pads its own content. --footerbar-h is the height of anything fixed at the bottom (0 if none).
export const RAIL_FRAME_SCROLL =
  'flex items-stretch bg-surface-raised [border:1px_solid_var(--line)] ' +
  'min-[993px]:h-[calc(100dvh_-_var(--header-h-max,104px)_-_var(--space-3)_-_var(--space-3)_-_var(--footerbar-h,0px)_-_env(safe-area-inset-bottom))] ' +
  'overflow-clip max-[992px]:block max-[992px]:px-6 max-[992px]:pt-6 max-[992px]:pb-8 ' +
  'max-[560px]:px-4 max-[560px]:pt-5 max-[560px]:pb-[1.6rem]';

// --- desktop rail ---
export const RAIL_ASIDE =
  'max-[992px]:hidden flex-none w-[248px] bg-cream [border-right:1px_solid_var(--line)] ' +
  'transition-[width] duration-200 ease-[ease]';
export const RAIL_ASIDE_COLLAPSED =
  'max-[992px]:hidden flex-none w-[64px] bg-cream [border-right:1px_solid_var(--line)] ' +
  'transition-[width] duration-200 ease-[ease]';

// The menu sticks under the navbar's CURRENT height (--header-h), not its max.
export const RAIL_STICK =
  'sticky top-[var(--header-h,104px)] flex flex-col p-[1.35rem_0.9rem] ' +
  'max-h-[calc(100vh-var(--header-h,104px))] overflow-y-auto';
export const RAIL_STICK_COLLAPSED =
  'sticky top-[var(--header-h,104px)] flex flex-col items-center p-[1.35rem_0.5rem] ' +
  'max-h-[calc(100vh-var(--header-h,104px))] overflow-y-auto';

export const RAIL_LABEL =
  'font-body text-label font-medium tracking-[0.14em] uppercase text-muted m-0 mb-[var(--space-2)] px-[0.75rem]';

// Rail row; the active one is a raised bordered pill on the tinted rail. Collapsed = icon only.
export function railItem(active, collapsed = false) {
  return `flex items-center ${collapsed ? 'justify-center w-9 h-9 p-0' : 'w-full text-left p-[0.55rem_0.75rem] gap-[0.65rem]'} ` +
    'rounded-[var(--r-md)] bg-transparent border-none cursor-pointer font-body text-body leading-[1.35] no-underline ' +
    '[&>svg]:w-[var(--icon-sm)] [&>svg]:h-[var(--icon-sm)] [&>svg]:shrink-0 ' +
    (active
      ? `font-semibold text-gold bg-surface-raised [border:1px_solid_var(--line)] ${collapsed ? '' : 'p-[calc(0.55rem-1px)_calc(0.75rem-1px)]'}`
      : 'text-muted [&>svg]:opacity-75 hover:text-gold');
}

// Desktop header row in the content column: collapse trigger + breadcrumb.
export const RAIL_HEADER =
  'max-[992px]:hidden flex items-center gap-3 pb-4 mb-[1.2rem] [border-bottom:1px_solid_var(--line)]';
export const RAIL_HEADER_PAD = 'min-[993px]:px-[2.1rem] min-[993px]:pt-[1.6rem]';
export const RAIL_TRIGGER =
  'flex items-center justify-center w-8 h-8 -ml-1 rounded-[var(--r-md)] bg-transparent border-none cursor-pointer ' +
  'text-muted hover:bg-surface-raised hover:text-gold [&>svg]:w-[var(--icon-sm)] [&>svg]:h-[var(--icon-sm)]';
export const RAIL_HEADER_SEP = 'w-px h-4 bg-line shrink-0';

// Line between two groups of rows. block, not inline: h-px on an inline span draws nothing.
export const RAIL_SPLIT = 'block h-px bg-line my-[var(--space-2)] mx-[0.75rem]';

// --- content column ---
export const RAIL_MAIN = 'flex-1 min-w-0 p-[1.6rem_2.1rem] max-[992px]:p-0';
// Guide variant: keeps card padding on phones (that padding draws the phone card).
export const RAIL_MAIN_CARD =
  'flex-1 min-w-0 p-[1.6rem_2.1rem] max-[992px]:px-6 max-[992px]:pt-6 max-[992px]:pb-8 ' +
  'max-[560px]:px-4 max-[560px]:pt-5 max-[560px]:pb-[1.6rem]';
// Scroll mode: a flex column that cannot outgrow the capped frame.
export const RAIL_MAIN_SCROLL =
  'flex-1 min-w-0 min-[993px]:flex min-[993px]:flex-col min-[993px]:min-h-0 ' +
  'min-[993px]:overflow-hidden max-[992px]:p-0';
// The scrolling body; min-h-0 or the flex child grows the frame instead of scrolling.
export const RAIL_SCROLL_BODY =
  'min-[993px]:flex-1 min-[993px]:min-h-0 min-[993px]:overflow-y-auto ' +
  'min-[993px]:px-[2.1rem] min-[993px]:pb-[1.6rem]';
// Prose capped at the reading width but flush left, so its edge lines up with the rest of the page.
export const RAIL_READ = 'max-w-[var(--container-read)]';

// --- phone ---
export const RAIL_MLIST = 'min-[993px]:hidden';
export const RAIL_MLABEL =
  'font-body text-label font-medium tracking-[0.14em] uppercase text-muted m-0 mb-[var(--space-1)] px-[0.75rem]';
// Phone row = the navbar's MENU_ROW_BOX, so navigation rows look the same wherever they appear.
export function railMobileItem(active) {
  return `${MENU_ROW_BOX} no-underline bg-transparent border-none cursor-pointer font-body text-body leading-[1.35] ` +
    (active ? 'font-semibold text-gold bg-cream' : 'text-muted [&>svg]:opacity-75');
}
export const RAIL_MCHEV = 'ml-auto w-[var(--icon-sm)] h-[var(--icon-sm)] shrink-0 text-muted opacity-70';
export const RAIL_BACK =
  'min-[993px]:hidden flex items-center gap-[var(--space-1)] mb-[var(--space-2)] p-0 ' +
  'bg-transparent border-none cursor-pointer font-body text-body font-semibold text-gold ' +
  '[&>svg]:w-[var(--icon-sm)] [&>svg]:h-[var(--icon-sm)] [&>svg]:shrink-0';

// Help card that ends the rail (a question + one button).
export const RAIL_HELP =
  'mt-[var(--space-3)] mx-[0.75rem] p-[0.9rem] bg-surface-raised ' +
  '[border:1px_solid_var(--line)] max-[992px]:mt-[var(--space-4)]';
export const RAIL_HELP_TEXT = 'font-body text-body leading-[1.45] text-muted m-0 mb-[0.6rem]';
// Full width in the 248px rail so the label cannot overflow the card; inline on phones.
export const RAIL_HELP_BTN =
  'flex w-full max-[992px]:inline-flex max-[992px]:w-auto ' +
  `${BTN_SM} gap-[0.4rem] no-underline font-body text-surface-raised bg-cta ` +
  '[&>svg]:w-[var(--icon-sm)] [&>svg]:h-[var(--icon-sm)] [&>svg]:shrink-0 ' +
  '[transition:background-color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)] hover:bg-cta-d';

// --- content inside a rail page (CUE's Our Company sections) ---
// Body paragraph rhythm and the section title shared by every rail section.
export const RAIL_BODY_TEXT = '[&_p]:leading-[var(--lh-body)] [&_p]:m-0 [&_p]:mb-4 [&_p]:text-ink [&_p]:text-body';
export const RAIL_TITLE = 'font-head text-h2 font-bold text-gold mb-4';

// FAQ accordion on native <details>: works before hydration and Ctrl+F finds collapsed answers.
export const FAQ_CAT = 'font-body text-label font-medium tracking-[0.14em] uppercase text-muted m-0 mb-[var(--space-1)]';
// list-none plus the webkit rule remove the browser's default disclosure triangle.
export const FAQ_Q =
  'list-none [&::-webkit-details-marker]:hidden flex items-center gap-[var(--space-2)] ' +
  'cursor-pointer py-[0.85rem] font-body text-h3 font-semibold text-gold';
// Transition `rotate`, not `transform`: Tailwind v4 compiles rotate-180 to the standalone rotate property.
export const FAQ_CHEV =
  'ml-auto w-[var(--icon-sm)] h-[var(--icon-sm)] shrink-0 text-muted ' +
  'transition-[rotate] duration-[var(--dur)] ease-[var(--ease)] group-open:rotate-180';
export const FAQ_ROW = 'group [border-bottom:1px_solid_var(--line)] first-of-type:[border-top:1px_solid_var(--line)]';
export const FAQ_A =
  'pb-[var(--space-2)] pr-[var(--space-4)] [&_p]:m-0 [&_p]:text-body ' +
  '[&_p]:leading-[var(--lh-body)] [&_p]:text-ink [&_a]:text-gold [&_a]:font-medium';
