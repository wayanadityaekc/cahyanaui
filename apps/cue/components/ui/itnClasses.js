// Itinerary content-heading primitive (B-FINAL). Panel/section subtitle with a short
// gold underline (::after). Used by CharterSection ("Good to know") and ItineraryBuilder.
// The .itn2__panel context adds mb-4 (applied at that usage site).
export const ITN_SUBTITLE =
  'relative pb-[0.45rem] font-body text-[length:var(--fs-h3)] font-semibold text-green ' +
  'after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-11 after:h-[3px] after:rounded-[3px] after:bg-gold';
