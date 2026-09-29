import { BTN_SM } from '@/components/ui/btnClasses';

// The chat panel's shape. Desktop: a popup hanging under the navbar icon that
// opened it. Phone: a sheet off the bottom, the same shape the hero search and
// the select panels already use, so it is not a fourth kind of surface.
export function PANEL(open) {
  return [
    'fixed z-[130] flex flex-col bg-white overflow-hidden',
    'motion-reduce:transition-none',
    // Desktop: a full-height drawer off the right edge, the same shape and the
    // same slide as the navbar menu (Sep 2026, Wayan: "di desktop buat tampilanya
    // full di kanan seperti menu"). It replaced a small popup hanging under the
    // icon - a conversation with price lines in it needs the height, and the site
    // already has one way of showing a panel on the right.
    //
    // Geometry copied from that menu on purpose: same width cap, same 100dvh,
    // same 300ms translate. Two right-hand drawers that move differently would
    // read as two different systems. (The shadow both used to carry went with the
    // rest of the elevation, Sep 2026.)
    '[@media(min-width:769px)]:top-0 [@media(min-width:769px)]:right-0 [@media(min-width:769px)]:bottom-0',
    '[@media(min-width:769px)]:h-[100dvh] [@media(min-width:769px)]:w-[38%] [@media(min-width:769px)]:max-w-[420px] [@media(min-width:769px)]:min-w-[340px]',
    '[@media(min-width:769px)]:[transition:translate_300ms_var(--ease),visibility_300ms]',
    open
      ? '[@media(min-width:769px)]:translate-x-0'
      : '[@media(min-width:769px)]:translate-x-full',
    // Phone: unchanged - a sheet off the bottom, which Wayan signed off on.
    '[@media(max-width:768px)]:left-0 [@media(max-width:768px)]:right-0 [@media(max-width:768px)]:bottom-0 [@media(max-width:768px)]:top-auto',
    '[@media(max-width:768px)]:h-[86dvh] [@media(max-width:768px)]:[border-radius:var(--r-xl)_var(--r-xl)_0_0]',
    '[@media(max-width:768px)]:[transition:opacity_var(--dur)_var(--ease-out),transform_var(--dur)_var(--ease-out),visibility_var(--dur)]',
    open
      ? '[@media(max-width:768px)]:opacity-100 [@media(max-width:768px)]:[transform:translateY(0)]'
      : '[@media(max-width:768px)]:opacity-0 [@media(max-width:768px)]:[transform:translateY(100%)]',
    open ? 'visible pointer-events-auto' : 'invisible pointer-events-none',
  ].join(' ');
}

// The scrim now runs at every width, because the desktop panel became a drawer
// that covers part of the page rather than a popup floating over it. Same
// colour and timing as the navbar menu's scrim; it sits under the panel and
// closes on a tap.
export function SCRIM(open) {
  return 'fixed inset-0 z-[125] bg-[rgba(26,26,26,0.45)] ' +
    '[transition:opacity_300ms_var(--ease),visibility_300ms] motion-reduce:transition-none ' +
    (open ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none');
}

export const HEAD =
  'flex items-center gap-[0.7rem] flex-none pt-4 px-4 pb-3 [border-bottom:1px_solid_var(--line)]';
export const HEAD_AVATAR =
  'flex-none w-9 h-9 rounded-[50%] bg-cream [border:1px_solid_var(--line)] flex items-center justify-center ' +
  '[&>svg]:w-[var(--icon-md)] [&>svg]:h-[var(--icon-md)] [&>svg]:text-gold';
export const HEAD_STACK = 'flex-1 min-w-0 flex flex-col leading-[1.25]';
export const HEAD_TITLE = 'font-body font-semibold text-h3 text-gold m-0';
export const HEAD_SUB = 'font-body text-label text-muted m-0 truncate';

export const BODY =
  'flex-[1_1_auto] overflow-y-auto [overscroll-behavior:contain] px-4 py-4 flex flex-col gap-[0.6rem] ' +
  '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden';

// Bubbles. The guest's own words sit on the right in the CTA green already used
// for "this is you / this is the action"; ours sit left on cream.
export const BUBBLE_BOT =
  'self-start max-w-[86%] px-[0.85rem] py-[0.6rem] rounded-[var(--r-md)] bg-cream ' +
  '[border:1px_solid_var(--line)] font-body text-body leading-[var(--lh-body)] text-ink';
export const BUBBLE_ME =
  'self-end max-w-[86%] px-[0.85rem] py-[0.6rem] rounded-[var(--r-md)] bg-cta ' +
  'font-body text-body leading-[var(--lh-body)] text-white';

// A price line inside an answer. Tappable, because a guest who just asked the
// price of a tour is one tap from the page that sells it.
export const ROW =
  'flex flex-none items-center gap-[0.6rem] w-full px-[0.7rem] py-[0.5rem] rounded-[var(--r-sm)] bg-white ' +
  '[border:1px_solid_var(--line)] no-underline text-left cursor-pointer text-small ' +
  '[transition:background-color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)] hover:bg-cream';
export const ROW_NAME = 'flex-1 min-w-0 font-body text-small text-green';
export const ROW_NOTE = 'block font-body text-label text-muted truncate';
export const ROW_PRICE = 'flex-none font-body text-small font-semibold text-amber tabular-nums';

export const LINK =
  `inline-flex flex-none ${BTN_SM} self-start bg-white text-gold [border:1px_solid_var(--line)] no-underline cursor-pointer ` +
  '[transition:background-color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)] hover:bg-cream';
export const HANDOFF_BTN =
  `inline-flex flex-none ${BTN_SM} self-start gap-[0.4rem] bg-cta text-white border-none no-underline cursor-pointer ` +
  '[&>svg]:w-[var(--icon-sm)] [&>svg]:h-[var(--icon-sm)] [&>svg]:shrink-0 ' +
  '[transition:background-color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)] hover:bg-cta-d';

// The suggested questions. Written as things a guest would say, so tapping one
// reads as asking rather than as picking from a menu.
export const CHIPS = 'flex flex-wrap gap-[0.4rem] self-start mt-[0.15rem]';
export const CHIP_Q =
  'inline-flex flex-none items-center h-[var(--btn-h)] px-[0.8rem] py-0 rounded-[var(--r-pill)] bg-white ' +
  '[border:1px_solid_var(--line)] font-body text-small text-green cursor-pointer text-left ' +
  '[transition:background-color_var(--dur)_var(--ease),border-color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)] ' +
  'hover:bg-cream hover:[border-color:var(--color-gold)]';

export const FOOT =
  'flex-none flex items-center gap-[0.5rem] px-4 py-3 [border-top:1px_solid_var(--line)] bg-white';
export const SEND =
  'flex-none inline-flex items-center justify-center w-[var(--btn-h)] h-[var(--btn-h)] rounded-[var(--r-sm)] text-small ' +
  'bg-cta text-white border-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ' +
  '[&>svg]:w-[var(--icon-sm)] [&>svg]:h-[var(--icon-sm)] ' +
  '[transition:background-color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)] hover:bg-cta-d';

export const DOTS = 'self-start flex gap-[4px] px-[0.85rem] py-[0.7rem] rounded-[var(--r-md)] bg-cream [border:1px_solid_var(--line)]';
export const DOT = 'w-[5px] h-[5px] rounded-[50%] bg-muted';
// Wayan typing. Same bubble shell as the panel's own dots so it sits on the
// conversation's rhythm, with his name in front - unlabelled dots could be
// either of us, and only one of the two is a person waiting on.
export const TYPING_ROW = `${DOTS} items-center gap-[0.45rem]`;
export const TYPING_WHO = 'font-body text-label font-medium tracking-[0.06em] uppercase text-cta';
// The animation is the only thing on screen that says this is live rather than a
// static row, so it is not decoration. Honouring reduced motion leaves the row
// legible: the name is what carries the meaning.
export function DOT_LIVE(i) { return `${DOT} motion-safe:animate-[chatdot_1.1s_ease-in-out_infinite] [animation-delay:${i * 0.15}s]`; }

// Wayan's own replies. Same side as ours so the conversation reads as one
// thread, but named and tinted so a guest can tell a person from the panel -
// that difference matters most in the message that says "we cannot do that".
export const BUBBLE_WAYAN =
  'self-start max-w-[86%] px-[0.85rem] py-[0.6rem] rounded-[var(--r-md)] bg-white ' +
  '[border:1px_solid_var(--color-cta)] font-body text-body leading-[var(--lh-body)] text-ink';
export const WHO = 'block font-body text-label font-medium tracking-[0.06em] uppercase text-cta mb-[0.2rem]';

// The handover form: two optional fields and the button that sends. It sits in
// the conversation rather than in a modal, because the guest is mid-sentence
// and a dialog would make it feel like starting over.
export const HANDOFF_FORM =
  'self-start w-full max-w-[86%] flex flex-col gap-[0.4rem] p-[0.7rem] rounded-[var(--r-md)] ' +
  'bg-cream [border:1px_solid_var(--line)]';
export const HANDOFF_ROW = 'flex flex-col min-[420px]:flex-row gap-[0.4rem] [&>*]:flex-1 [&>*]:min-w-0';
export const NOTE = 'font-body text-label text-muted m-0';
export const ALT_LINK =
  'font-body text-small text-muted underline underline-offset-2 cursor-pointer bg-transparent border-none p-0 self-start';
// Shown once the conversation belongs to Wayan, so nobody wonders whether the
// panel is still the one reading.
export const CONNECTED =
  'flex-none flex items-center gap-[0.4rem] px-4 py-[0.4rem] bg-cream [border-top:1px_solid_var(--line)] ' +
  'font-body text-label text-cta [&>svg]:w-[12px] [&>svg]:h-[12px] [&>svg]:shrink-0';

// The sign-in offer, sitting above the conversation. A quiet strip rather than
// a card: a guest who does not want an account should be able to ignore it
// without it looking like an unfinished step.
export const SIGNIN_BAR =
  'flex flex-none items-center gap-[0.6rem] px-[0.8rem] py-[0.5rem] rounded-[var(--r-md)] ' +
  'bg-cream [border:1px_solid_var(--line)] m-0';
export const SIGNIN_TEXT = 'flex-1 min-w-0 font-body text-label text-muted';
export const SIGNIN_BTN =
  `inline-flex flex-none ${BTN_SM} bg-white text-gold [border:1px_solid_var(--line)] cursor-pointer ` +
  '[transition:background-color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)] hover:bg-cream';
