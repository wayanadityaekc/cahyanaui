// Date labels for My Trips rows and booked-trip cards.
export function fmtDay(dateStr) {
  if (!dateStr) return 'date TBD';
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function fmtRange(from, to) {
  if (!from) return 'Date TBD';
  if (to && to !== from) return `${fmtDay(from)} - ${fmtDay(to)}`;
  return fmtDay(from);
}
