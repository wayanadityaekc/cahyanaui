export function priceUnit(perPerson, guests) {
  if (!perPerson) return 'per car';
  const guestCount = Number(guests) || 2;
  return `for ${guestCount} ${guestCount === 1 ? 'guest' : 'guests'}`;
}
