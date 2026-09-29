// One price-unit wording for book bar, Book now row and booking form: tours per car, others total for N guests.
export function priceUnit(perPerson, guests) {
  if (!perPerson) return 'per car';
  const n = Number(guests) || 2;
  return `for ${n} ${n === 1 ? 'guest' : 'guests'}`;
}
