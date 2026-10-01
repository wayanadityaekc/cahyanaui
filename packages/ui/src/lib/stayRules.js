// Which days a guest may tap when booking a stay. Pure, so the big calendar and the small picker share one answer.
// `busy` is a list of NIGHT ranges { from, to }, `to` being the last booked night (inclusive) - the same shape the API sends.

function toDate(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function isoDay(date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
}

export function addDays(value, count) {
  const date = toDate(value);
  date.setUTCDate(date.getUTCDate() + count);
  return isoDay(date);
}

export function nightsBetween(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  return Math.round((toDate(checkOut) - toDate(checkIn)) / 86400000);
}

export function isBookedNight(busy = [], night) {
  return busy.some((range) => night >= range.from && night <= range.to);
}

// Every night from checkIn up to the night before checkOut is open.
function nightsOpen(busy, checkIn, checkOut) {
  return !busy.some((range) => range.from < checkOut && range.to >= checkIn);
}

export function stayLimits({ today, minNights = 1, maxNights = 30, maxDaysAhead = 365 }) {
  return { today, minNights, maxNights, lastCheckIn: addDays(today, maxDaysAhead) };
}

// A check-in needs the first `minNights` nights open, from today up to the booking horizon.
export function canCheckIn(day, { busy = [], limits }) {
  if (day < limits.today || day > limits.lastCheckIn) return false;
  return nightsOpen(busy, day, addDays(day, limits.minNights));
}

// A check-out needs every night since check-in open; it may land on the morning a booked stay begins.
export function canCheckOut(day, checkIn, { busy = [], limits }) {
  const nights = nightsBetween(checkIn, day);
  if (nights < limits.minNights || nights > limits.maxNights) return false;
  return nightsOpen(busy, checkIn, day);
}

// Is a picked stay still bookable (busy nights can arrive after the guest picked)?
export function stayIsOpen({ checkIn, checkOut }, { busy = [], limits }) {
  if (!checkIn || !checkOut) return false;
  return canCheckIn(checkIn, { busy, limits }) && canCheckOut(checkOut, checkIn, { busy, limits });
}
