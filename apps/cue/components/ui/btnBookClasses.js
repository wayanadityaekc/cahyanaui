// Shared "Book This ..." CTA button (B-FINAL). Effective value = base (703) + the
// later cta override (bg cta, white text, cta border-color) + text-decoration:none.
// border stays none (0px), border-color cta is inert but reproduced for exact parity.
// Used by AirportTransferForm, CharterBuilder, ItineraryBuilder (Book + suggest btn).
export const BTN_BOOK =
  'w-full mt-4 p-[0.9rem] [border-width:0] [border-style:none] [border-color:var(--color-cta)] rounded-pill ' +
  'text-[1rem] font-semibold text-white bg-cta cursor-pointer no-underline ' +
  'disabled:opacity-45 disabled:cursor-not-allowed';
