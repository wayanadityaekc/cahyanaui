import { BTN_SM } from '../primitives/btnClasses.js';

// CUE's chat panel shapes (components/chat/chatClasses.js) on library tokens; the site animates the frame.

// Frame: right-hand full-height drawer on desktop, bottom sheet on phones. Breakpoint written like CUE's (768 exact).
export const CHAT_FRAME =
  'fixed z-[130] flex flex-col bg-surface-raised overflow-hidden outline-none ' +
  '[@media(min-width:769px)]:top-0 [@media(min-width:769px)]:right-0 [@media(min-width:769px)]:bottom-0 ' +
  '[@media(min-width:769px)]:h-[100dvh] [@media(min-width:769px)]:w-[38%] [@media(min-width:769px)]:max-w-[420px] [@media(min-width:769px)]:min-w-[340px] ' +
  '[@media(max-width:768px)]:left-0 [@media(max-width:768px)]:right-0 [@media(max-width:768px)]:bottom-0 ' +
  '[@media(max-width:768px)]:h-[86dvh] [@media(max-width:768px)]:[border-radius:var(--r-xl)_var(--r-xl)_0_0]';

// Scrim under the panel at every width, the navbar menu's colour; tap closes.
export const CHAT_SCRIM = 'fixed inset-0 z-[125] bg-[rgba(26,26,26,0.45)]';

export const CHAT_HEAD =
  'flex items-center gap-[0.7rem] flex-none pt-4 px-4 pb-3 [border-bottom:1px_solid_var(--line)]';
export const CHAT_HEAD_AVATAR =
  'flex-none w-9 h-9 rounded-[50%] bg-cream [border:1px_solid_var(--line)] flex items-center justify-center ' +
  '[&>svg]:w-[var(--icon-md)] [&>svg]:h-[var(--icon-md)] [&>svg]:text-gold';
export const CHAT_HEAD_STACK = 'flex-1 min-w-0 flex flex-col leading-[1.25]';
export const CHAT_HEAD_TITLE = 'font-body font-semibold text-h3 text-gold m-0';
export const CHAT_HEAD_SUB = 'font-body text-label text-muted m-0 truncate';

export const CHAT_BODY =
  'flex-[1_1_auto] min-h-0 overflow-y-auto [overscroll-behavior:contain] px-4 py-4 flex flex-col gap-[0.6rem] ' +
  '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden';

// Bubbles: the guest's own on the right in the action colour, ours on the left on cream.
export const CHAT_BUBBLE_BOT =
  'self-start max-w-[86%] px-[0.85rem] py-[0.6rem] rounded-[var(--r-md)] bg-cream m-0 ' +
  '[border:1px_solid_var(--line)] font-body text-body leading-[var(--lh-body)] text-ink';
export const CHAT_BUBBLE_ME =
  'self-end max-w-[86%] px-[0.85rem] py-[0.6rem] rounded-[var(--r-md)] bg-cta m-0 ' +
  'font-body text-body leading-[var(--lh-body)] text-white';
// The owner's replies: left like ours but bordered and named, so a person reads differently from the bot.
export const CHAT_BUBBLE_OWNER =
  'self-start max-w-[86%] px-[0.85rem] py-[0.6rem] rounded-[var(--r-md)] bg-surface-raised m-0 ' +
  '[border:1px_solid_var(--color-cta)] font-body text-body leading-[var(--lh-body)] text-ink';
export const CHAT_WHO = 'block font-body text-label font-medium tracking-[0.06em] uppercase text-cta mb-[0.2rem]';

// Tappable row inside an answer, linking to the page that has the details.
export const CHAT_ROW =
  'flex flex-none items-center gap-[0.6rem] w-full px-[0.7rem] py-[0.5rem] rounded-[var(--r-sm)] bg-surface-raised ' +
  '[border:1px_solid_var(--line)] no-underline text-left cursor-pointer text-small ' +
  '[transition:background-color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)] hover:bg-cream';
export const CHAT_ROW_NAME = 'flex-1 min-w-0 font-body text-small text-green';
export const CHAT_ROW_NOTE = 'block font-body text-label text-muted truncate';
export const CHAT_ROW_PRICE = 'flex-none font-body text-small font-semibold text-amber tabular-nums';

export const CHAT_LINK =
  `inline-flex flex-none ${BTN_SM} self-start bg-surface-raised text-gold [border:1px_solid_var(--line)] no-underline cursor-pointer ` +
  '[transition:background-color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)] hover:bg-cream';
export const CHAT_CTA =
  `inline-flex flex-none ${BTN_SM} self-start gap-[0.4rem] bg-cta text-white border-none no-underline cursor-pointer ` +
  'disabled:opacity-40 disabled:cursor-not-allowed ' +
  '[transition:background-color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)] hover:bg-cta-d';

// Suggested question chips, phrased as things a guest would ask.
export const CHAT_CHIPS = 'flex flex-wrap gap-[0.4rem] self-start mt-[0.15rem]';
export const CHAT_CHIP =
  'inline-flex flex-none items-center min-h-[var(--field-h)] px-[0.8rem] py-[0.3rem] rounded-[var(--r-pill)] bg-surface-raised ' +
  '[border:1px_solid_var(--line)] font-body text-small text-green cursor-pointer text-left ' +
  '[transition:background-color_var(--dur)_var(--ease),border-color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)] ' +
  'hover:bg-cream hover:[border-color:var(--color-gold)]';

export const CHAT_FOOT =
  'flex-none flex items-center gap-[0.5rem] px-4 pt-3 pb-2 [border-top:1px_solid_var(--line)] bg-surface-raised';
// Send matches the field's height, so the input and the button line up on one row.
export const CHAT_SEND =
  'flex-none inline-flex items-center justify-center w-[var(--field-h)] h-[var(--field-h)] rounded-[var(--r-sm)] ' +
  'bg-cta text-white border-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ' +
  '[&>svg]:w-[var(--icon-sm)] [&>svg]:h-[var(--icon-sm)] ' +
  '[transition:background-color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)] hover:bg-cta-d';
// The way out to another channel (WhatsApp on the villa site), always on screen under the input.
export const CHAT_ALT_ROW =
  'flex-none flex items-center justify-between gap-[0.5rem] px-4 pt-0 bg-surface-raised font-body text-label text-muted ' +
  'pb-[max(0.75rem,env(safe-area-inset-bottom))]';
export const CHAT_ALT_LINK =
  'inline-flex items-center gap-[0.35rem] font-body text-small font-semibold text-gold underline underline-offset-2 ' +
  '[&>svg]:w-[var(--icon-sm)] [&>svg]:h-[var(--icon-sm)] [&>svg]:shrink-0';

export const CHAT_DOTS =
  'self-start flex gap-[4px] px-[0.85rem] py-[0.7rem] rounded-[var(--r-md)] bg-cream [border:1px_solid_var(--line)]';
export const CHAT_DOT = 'w-[5px] h-[5px] rounded-[50%] bg-muted';
export const CHAT_TYPING_ROW = `${CHAT_DOTS} items-center gap-[0.45rem]`;
export const CHAT_TYPING_WHO = 'font-body text-label font-medium tracking-[0.06em] uppercase text-cta';
// Animated live dot; reduced motion stops it but the name still carries the meaning.
export function chatDotLive(index) {
  return `${CHAT_DOT} motion-safe:animate-[cahyana-chatdot_1.1s_ease-in-out_infinite] [animation-delay:${index * 0.15}s]`;
}

// Inline email form after the handover, inside the conversation, not a modal.
export const CHAT_MAIL_FORM =
  'self-start w-full max-w-[86%] flex flex-col gap-[0.4rem] p-[0.7rem] rounded-[var(--r-md)] ' +
  'bg-cream [border:1px_solid_var(--line)]';
export const CHAT_NOTE = 'font-body text-label text-muted m-0';
export const CHAT_TEXT_BTN =
  'font-body text-small text-muted underline underline-offset-2 cursor-pointer bg-transparent border-none p-0 self-start';

// Strip shown once the conversation is with a person.
export const CHAT_CONNECTED =
  'flex-none flex items-center gap-[0.4rem] px-4 py-[0.4rem] m-0 bg-cream [border-top:1px_solid_var(--line)] ' +
  'font-body text-label text-cta [&>svg]:w-[12px] [&>svg]:h-[12px] [&>svg]:shrink-0';

// Quiet sign-in strip above the conversation that guests can ignore.
export const CHAT_SIGNIN_BAR =
  'flex flex-none items-center gap-[0.6rem] px-[0.8rem] py-[0.5rem] rounded-[var(--r-md)] ' +
  'bg-cream [border:1px_solid_var(--line)] m-0';
export const CHAT_SIGNIN_TEXT = 'flex-1 min-w-0 font-body text-label text-muted';
export const CHAT_SIGNIN_BTN =
  `inline-flex flex-none ${BTN_SM} bg-surface-raised text-gold [border:1px_solid_var(--line)] cursor-pointer ` +
  '[transition:background-color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)] hover:bg-cream';
