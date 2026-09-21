// Tailwind utility strings mirroring the legacy `.modal*` CSS family (migrasi Fase 2,
// opsi B - Wayan: modal full-utility). Didefinisiin SEKALI di sini, di-import tiap
// komponen modal biar gak keduplikat 12x tapi tetep utility murni (bukan class CSS).
//
// Nilai = mirror PERSIS computed style lama, termasuk rule global yang numpuk di atas
// blok `.modal*`:
//   - .modal__btn: bg/hover-nya SEBENERNYA dari grup CTA di style.css (~7488),
//     bukan hijau .color-green di blok 3129 -> jadi bg-cta / hover:bg-cta-d.
//   - .modal__title / .modal__group label: weight/letter-spacing dari grup global (7450/7470).
//   - .modal__group input/textarea/select: border/radius/font/color dari shared
//     form-field base (~1527) + padding/height dari blok modal.
// `.modal*` CSS baru dihapus dari style.css kalau SEMUA pemakainya udah pindah ke sini.

// Shell + box: these modals mount fresh only while open (ReviewModal/BookConfirm/
// BookSidebar/BookCta confirm-dialogs). They used to carry a mount-triggered keyframe
// here (heroFadeIn / popCardIn) because a CSS *transition* never gets a "closed" frame
// to animate from. That solved the way IN and left the way OUT abrupt - on close the
// element left the DOM immediately. Both directions now live in <ModalPresence>
// (AnimatePresence), so these strings are pure layout/appearance: no animation here.
export const SHELL =
  'fixed inset-0 z-[200] flex items-center justify-center p-6 bg-[rgba(0,0,0,0.55)] pointer-events-auto';
export const BOX =
  'relative w-full max-w-[420px] max-h-[90vh] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden p-8 rounded-md bg-white';
// .modal__box--sm: the same box, narrower (430px) and centre-aligned (confirm dialogs).
export const BOX_SM =
  'relative w-full max-w-[430px] max-h-[90vh] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden p-8 rounded-md bg-white text-center';
export const CLOSE =
  'absolute top-3 right-4 text-[1.6rem] leading-none text-green bg-transparent border-none cursor-pointer';
export const LOGO = 'block h-[38px] w-auto mx-auto mb-[1.1rem]';
export const TITLE = 'mb-5 font-body text-h3 text-center font-semibold tracking-normal';
export const SUB = 'mb-[1.1rem] text-body text-muted';

export const GROUP = 'flex flex-col mb-4';
export const LABEL = 'mb-[0.4rem] text-small font-medium font-body tracking-normal normal-case';
export const INPUT =
  'border border-line rounded-md font-body text-field text-green px-[0.65rem] py-2 h-[var(--field-h)]';
export const TEXTAREA =
  'border border-line rounded-md font-body text-field text-green px-[0.65rem] py-2 min-h-[110px] resize-y bg-white';
export const SELECT =
  'border border-line rounded-md font-body text-field text-green w-full h-[var(--field-h)] px-[0.7rem] py-[0.6rem] bg-white';

// Primary button = the site CTA (green fill, white text) - NOT the dead green in the
// 3129 block. Stacked buttons keep a 0.6rem gap (STACK), applied to the 2nd+ button.
export const BTN =
  'w-full p-[0.85rem] border-none rounded-pill text-[1rem] font-semibold text-white bg-cta no-underline cursor-pointer transition-[background-color,color,scale] duration-[var(--dur)] ease-[ease] hover:bg-cta-d hover:text-white';
export const STACK = 'mt-[0.6rem]';
export const BTN_GHOST =
  'w-full p-[0.85rem] rounded-pill text-[1rem] font-semibold no-underline cursor-pointer transition-[background-color,color,scale] duration-[var(--dur)] ease-[ease] mt-[0.6rem] bg-white [border:1.5px_solid_var(--color-green)] text-green hover:bg-green hover:text-cream hover:[border-color:var(--color-green)]';
// WhatsApp button: base layout + WA brand green. NO top margin baked in - the gap
// to the button above is context (the .modal__btn + .modal__btn adjacency = STACK,
// 0.6rem, which wins over .modal__btn--wa's own 0.75rem when stacked). Callers add
// the margin they actually render with (STACK when it follows another button).
export const BTN_WA =
  'w-full p-[0.85rem] border-none rounded-pill text-[1rem] font-semibold no-underline cursor-pointer transition-[background-color,color,scale] duration-[var(--dur)] ease-[ease] text-white bg-[#25d366] hover:bg-[#1fb457] hover:text-white';

// Inline message under a form (.modal__referral-msg): base has no colour (inherits);
// .error -> red, .success -> green. Used by auth / account / contact / hero-search.
export const REFMSG = 'block mt-[0.4rem] text-small';
export const REFMSG_ERR = 'block mt-[0.4rem] text-small text-err';
export const REFMSG_OK = 'block mt-[0.4rem] text-small text-ok';

// Per-field validation message - sits directly under the input it belongs to, so a
// guest sees every missing field at once instead of one message per submit attempt.
export const FIELD_ERR = 'block mt-[0.3rem] text-small text-err';

// Success state (.modal__success + icon + p). display:none default is handled by
// conditional render in React, so only the visible styles are mirrored here.
export const SUCCESS_ICON =
  'flex items-center justify-center w-14 h-14 mx-auto mb-4 rounded-[50%] text-[1.6rem] text-white bg-[#25d366]';
export const SUCCESS_TEXT = 'mb-6 text-body leading-[var(--lh-body)]';

// Referral code field - lives here rather than inline in one component now that
// both the booking modal and the payment step render it (DRY rule in CLAUDE.md:
// used by more than one component means one module, imported, not copy-pasted).
export const REFERRAL_INPUT =
  'flex-1 px-[0.65rem] py-2 h-[var(--field-h)] [border:1px_solid_#d8d2c4] rounded-sm font-body text-field text-green';
export const REFERRAL_BTN =
  'px-[1.1rem] py-0 border-none rounded-sm font-semibold text-cream bg-green cursor-pointer ' +
  '[transition:background-color_var(--dur)_ease,scale_var(--dur-fast)_var(--ease)]';
export const refMsgCls = (ok) => `block mt-[0.4rem] text-small ${ok ? 'text-ok' : 'text-err'}`;
