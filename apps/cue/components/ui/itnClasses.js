// Itinerary content-heading primitive (B-FINAL). Panel/section subtitle, used by
// ItineraryBuilder. The .itn2__panel context adds mb-4 (applied at that usage site).
//
// The short gold underline is gone (Sep 2026, Wayan: "kita gak pakai garis itu
// lagi"). `relative` went with it - it was only the bar's containing block. The
// `pb` STAYS: dropping it too pulled the panel content up 7px (measured), and the
// ask was to remove a line, not to retune spacing. It is just bottom breathing
// room now. Tighten it if that is ever wanted.
export const ITN_SUBTITLE = 'pb-[0.45rem] font-body text-[length:var(--fs-h3)] font-semibold text-green';
