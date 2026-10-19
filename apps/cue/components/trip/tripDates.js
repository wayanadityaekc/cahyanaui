export function fmtDay(dateStr) {
  if (!dateStr) return 'date TBD';
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function fmtRange(from, to) {
  if (!from) return 'Date TBD';
  if (to && to !== from) return `${fmtDay(from)} - ${fmtDay(to)}`;
  return fmtDay(from);
}
