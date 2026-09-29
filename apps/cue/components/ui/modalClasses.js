import { FIELD_INPUT, FIELD_AREA } from '@/components/ui/formClasses';
import { BTN_SM } from '@/components/ui/btnClasses';
// Shared utility strings for every modal, imported instead of copied.

// Layout/appearance only: open and close animation lives in ModalPresence, so add no animation here.
export const SHELL =
  'fixed inset-0 z-[200] flex items-center justify-center p-6 bg-[rgba(0,0,0,0.55)] pointer-events-auto';
export const BOX =
  'relative w-full max-w-[420px] max-h-[90vh] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden p-8 rounded-md bg-white';
// .modal__box--sm: the same box, narrower (430px) and centre-aligned (confirm dialogs).
export const BOX_SM =
  'relative w-full max-w-[430px] max-h-[90vh] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden p-8 rounded-md bg-white text-center';
// Booking popup only: 12px gutter and 20px padding; SHELL/BOX stay as-is for the other dialogs.
export const SHELL_WIDE =
  'fixed inset-0 z-[200] flex items-center justify-center p-3 bg-[rgba(0,0,0,0.55)] pointer-events-auto';
// Max height = viewport minus the shell's 12px gutters, in dvh because mobile browser chrome moves.
export const BOX_WIDE =
  'relative w-full max-w-[560px] max-h-[calc(100dvh-24px)] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden p-5 rounded-md bg-white';

export const CLOSE =
  'absolute top-3 right-4 text-[1.6rem] leading-none text-green bg-transparent border-none cursor-pointer';
export const LOGO = 'block h-[38px] w-auto mx-auto mb-[1.1rem]';
export const TITLE = 'mb-5 font-body text-h3 text-center font-semibold tracking-normal';
export const SUB = 'mb-[1.1rem] text-body text-muted';

export const GROUP = 'flex flex-col mb-4';
// LABEL dipindah ke formClasses.FIELD_LABEL (satu label buat seluruh web).
export { FIELD_LABEL as LABEL } from '@/components/ui/formClasses';
// Modal fields reuse the site-wide field box from formClasses.
export const INPUT = FIELD_INPUT;
export const TEXTAREA = FIELD_AREA;
export const SELECT = FIELD_INPUT;

// Primary modal button in CTA green; STACK adds the gap on the 2nd+ stacked button.
export const BTN =
  `flex w-full ${BTN_SM} border-none text-white bg-cta no-underline cursor-pointer transition-[background-color,color,scale] duration-[var(--dur)] ease-[ease] hover:bg-cta-d hover:text-white`;
export const STACK = 'mt-[0.6rem]';
export const BTN_GHOST =
  `flex w-full ${BTN_SM} no-underline cursor-pointer transition-[background-color,color,scale] duration-[var(--dur)] ease-[ease] mt-[0.6rem] bg-white [border:1.5px_solid_var(--color-green)] text-green hover:bg-green hover:text-cream hover:[border-color:var(--color-green)]`;
// WhatsApp button in brand green; no top margin baked in, callers add STACK when it follows a button.
export const BTN_WA =
  `flex w-full ${BTN_SM} border-none no-underline cursor-pointer transition-[background-color,color,scale] duration-[var(--dur)] ease-[ease] text-white bg-[#25d366] hover:bg-[#1fb457] hover:text-white`;

// Inline message under a form: neutral, error (red) or success (green).
export const REFMSG = 'block mt-[0.4rem] text-small';
export const REFMSG_ERR = 'block mt-[0.4rem] text-small text-err';
export const REFMSG_OK = 'block mt-[0.4rem] text-small text-ok';

// Per-field error directly under its input, so every missing field shows at once.
export const FIELD_ERR = 'block mt-[0.3rem] text-small text-err';

// Success icon and text; visibility is handled by conditional render.
export const SUCCESS_ICON =
  'flex items-center justify-center w-14 h-14 mx-auto mb-4 rounded-[50%] text-[1.6rem] text-white bg-[#25d366]';
export const SUCCESS_TEXT = 'mb-6 text-body leading-[var(--lh-body)]';

// Referral code field, shared by the booking modal and the payment step.
export const REFERRAL_INPUT = `flex-1 ${FIELD_INPUT}`;
export const REFERRAL_BTN =
  'px-[1.1rem] py-0 border-none rounded-sm font-semibold text-cream bg-green cursor-pointer ' +
  '[transition:background-color_var(--dur)_ease,scale_var(--dur-fast)_var(--ease)]';
export function refMsgCls(ok) { return `block mt-[0.4rem] text-small ${ok ? 'text-ok' : 'text-err'}`; }
