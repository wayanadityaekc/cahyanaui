export function priceUnit(perPerson, guests) {
  if (!perPerson) return 'per car';
  const n = Number(guests) || 2;
  return `for ${n} ${n === 1 ? 'guest' : 'guests'}`;
}
