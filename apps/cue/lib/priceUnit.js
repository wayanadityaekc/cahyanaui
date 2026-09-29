// What a displayed price covers - ONE wording for the book bar, the inline
// Book now row and the booking form, so the three can never disagree.
//
// Tours are sold per car. Experiences and performances are priced
// ticket x guests + one flat transport fee (cahyana-api pricing.js), so their
// figure is the TOTAL for the guest count the catalog was asked for - which is
// the guest count in the trip preferences. It used to read "per person" over
// that same total (29 Sep 2026, Wayan: fixed).
export function priceUnit(perPerson, guests) {
  if (!perPerson) return 'per car';
  const n = Number(guests) || 2;
  return `for ${n} ${n === 1 ? 'guest' : 'guests'}`;
}
