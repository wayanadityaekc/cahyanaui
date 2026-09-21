import { BTN_SM } from '@/components/ui/btnClasses';
// Shared "Book This ..." CTA button (B-FINAL). Effective value = base (703) + the
// later cta override (bg cta, white text, cta border-color) + text-decoration:none.
// border stays none (0px), border-color cta is inert but reproduced for exact parity.
// Used by AirportTransferForm, CharterBuilder, ItineraryBuilder (Book + suggest btn).
export const BTN_BOOK =
  `flex w-full mt-4 ${BTN_SM} [border-width:0] [border-style:none] [border-color:var(--color-cta)] ` +
  'text-white bg-cta cursor-pointer no-underline ' +
  'disabled:opacity-45 disabled:cursor-not-allowed';
