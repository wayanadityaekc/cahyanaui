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

export function removeItem(state, dayIndex, itemIndex) {
  const days = (state.days || []).map((d, i) => {
    if (i !== dayIndex) return d;
    const items = [...(d.items || [])];
    const modes = [...(d.itemModes || [])];
    items.splice(itemIndex, 1);
    modes.splice(itemIndex, 1);
    return { ...d, items, itemModes: modes };
  });
  return { ...state, days };
}

export function removeDay(state, dayIndex) {
  return { ...state, days: (state.days || []).filter((_, i) => i !== dayIndex) };
}
