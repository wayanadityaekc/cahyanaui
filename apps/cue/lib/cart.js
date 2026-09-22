// Cart rules ported verbatim from script.js. Behaviour only - all money comes
// from POST /api/pricing/quote, never from here.

export function addDaysStr(ds, n) {
  if (!ds) return '';
  const [y, m, d] = ds.split('-').map(Number);
  const dt = new Date(y, m - 1, d + n);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
}

// Setting a day's date pushes every later day forward one day each, so the trip
// stays in order. Transfers keep their own date and are skipped in the count.
export function cascadeFrom(state, dayIndex, date) {
  const days = (state.days || []).map((d) => ({ ...d }));
  let step = 0;
  for (let i = dayIndex; i < days.length; i++) {
    days[i].date = addDaysStr(date, step);
    step++;
  }
  return { ...state, days };
}

// Two full-day programmes cannot share a date.
export function hasClash(state, isFullDay) {
  const seen = {};
  return (state.days || []).some((d) => {
    if (!d.date || !(d.items || []).some(isFullDay)) return false;
    if (seen[d.date]) return true;
    seen[d.date] = true;
    return false;
  });
}

export function clashDates(state, isFullDay) {
  const seen = {};
  const out = [];
  for (const d of state.days || []) {
    if (!d.date || !(d.items || []).some(isFullDay)) continue;
    if (seen[d.date]) out.push(d.date);
    seen[d.date] = true;
  }
  return out;
}

export function setItemMode(state, dayIndex, itemIndex, mode) {
  const days = (state.days || []).map((d, i) => {
    if (i !== dayIndex) return d;
    const modes = [...(d.itemModes || [])];
    modes[itemIndex] = mode;
    return { ...d, itemModes: modes };
  });
  return { ...state, days };
}

// Start time is stored PER ITEM, parallel to itemModes - not per day (Sep 2026,
// Wayan: "item yang berisikan 2 tour dalam sehari ... jadi bakalan ada 2 jam soalnya
// beda program"). A day holds items[], so one time on the day row could only ever be
// right for the first of them.
export function setItemTime(state, dayIndex, itemIndex, time) {
  const days = (state.days || []).map((d, i) => {
    if (i !== dayIndex) return d;
    const times = [...(d.itemTimes || [])];
    times[itemIndex] = time;
    return { ...d, itemTimes: times };
  });
  return { ...state, days };
}

export function removeItem(state, dayIndex, itemIndex) {
  const days = (state.days || []).map((d, i) => {
    if (i !== dayIndex) return d;
    const items = [...(d.items || [])];
    const modes = [...(d.itemModes || [])];
    const times = [...(d.itemTimes || [])];
    items.splice(itemIndex, 1);
    modes.splice(itemIndex, 1);
    times.splice(itemIndex, 1);
    return { ...d, items, itemModes: modes, itemTimes: times };
  });
  return { ...state, days };
}

export function removeDay(state, dayIndex) {
  return { ...state, days: (state.days || []).filter((_, i) => i !== dayIndex) };
}

// Suggested plan: tour i on day i, plus an airport pickup and drop-off.
// Ported from suggestState() - inactive programmes are skipped, exactly as
// isProgramActive did.
// timeFor(name) = the default start time for that programme (defaultSlot via the
// pricing catalog, supplied by the caller so this file stays free of catalog logic).
// Without it the suggested days land in the cart with no time at all.
export function suggestState({ nDays, guests, suggest, airportRoute, airportPlace, isActive, timeFor }) {
  const g = guests ? String(guests) : '';
  const days = suggest
    .filter((name) => (isActive ? isActive(name) : true))
    .slice(0, nDays)
    .map((name) => ({ items: [name], itemModes: ['standard'], itemTimes: [(timeFor && timeFor(name)) || ''], date: '', guests: g }));
  const transfers = [
    { route: airportRoute, direction: 'to', pickup: airportPlace, dropoff: '', date: '', guests: g },
    { route: airportRoute, direction: 'from', pickup: '', dropoff: airportPlace, date: '', guests: g },
  ];
  return { days, transfers, charters: [] };
}
