import { BTN_SM } from '@/components/ui/btnClasses';
// Shared "Book This ..." CTA button (B-FINAL). Effective value = base (703) + the
// later cta override (bg cta, white text, cta border-color) + text-decoration:none.
// border stays none (0px), border-color cta is inert but reproduced for exact parity.
// Used by AirportTransferForm, CharterBuilder, ItineraryBuilder (Book + suggest btn).
//
// font-body added Sep 2026: without it "Book charter" and "Book transfer" were the
// only two action buttons on the whole site rendering in Arial (measured, 9 pages).
// NOTE: this and BTN_CTA are the same role (primary green CTA) written twice - the
// difference is real today (this one has no hover, carries mt-4 and disabled styles)
// but merging them is a call for Wayan, not a silent refactor.
export const BTN_BOOK =
  `flex w-full mt-4 ${BTN_SM} font-body [border-width:0] [border-style:none] [border-color:var(--color-cta)] ` +
  'text-white bg-cta cursor-pointer no-underline ' +
  'disabled:opacity-45 disabled:cursor-not-allowed';
