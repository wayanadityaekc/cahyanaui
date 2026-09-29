// Cart rules only; all money comes from POST /api/pricing/quote, never from here.

export function addDaysStr(ds, n) {
  if (!ds) return '';
  const [y, m, d] = ds.split('-').map(Number);
  const dt = new Date(y, m - 1, d + n);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
}

// Setting a day's date moves every later day to follow on consecutive dates.
export function cascadeFrom(state, dayIndex, date) {
  const days = (state.days || []).map((d) => ({ ...d }));
  days.forEach((day, i) => {
    if (i >= dayIndex) day.date = addDaysStr(date, i - dayIndex);
  });
  return { ...state, days };
}

// Two full-day programmes cannot share a date.
export function hasClash({ days }, isFullDay) {
  const seen = {};
  return (days || []).some((d) => {
    if (!d.date || !(d.items || []).some(isFullDay)) return false;
    if (seen[d.date]) return true;
    seen[d.date] = true;
    return false;
  });
}

export function clashDates({ days }, isFullDay) {
  const seen = {};
  const out = [];
  (days || []).forEach((d) => {
    if (!d.date || !(d.items || []).some(isFullDay)) return;
    if (seen[d.date]) out.push(d.date);
    seen[d.date] = true;
  });
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

// Start time is stored per item in itemTimes (parallel to itemModes), not per day.
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

// Suggested plan: active programme i on day i with timeFor(name) as start time, plus airport pickup and drop-off.
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
