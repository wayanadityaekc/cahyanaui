// Cart rules only; all money comes from POST /api/pricing/quote, never from here.

export function addDaysStr(dateStr, n) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const shifted = new Date(y, m - 1, d + n);
  return `${shifted.getFullYear()}-${String(shifted.getMonth() + 1).padStart(2, '0')}-${String(shifted.getDate()).padStart(2, '0')}`;
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

// Removes one My Trips row; transfers/charters by their own list index, day items by name.
export function removeRow(state, { kind, localIndex, day_no, service }) {
  const next = JSON.parse(JSON.stringify(state));
  if (kind === 'transfer') next.transfers.splice(localIndex, 1);
  else if (kind === 'charter') next.charters.splice(localIndex, 1);
  else {
    let d = next.days[day_no - 1];
    // Fallback: if the expected day lacks the item, search every day so delete never no-ops.
    if (!d || !(d.items || []).includes(service)) {
      d = (next.days || []).find((day) => (day.items || []).includes(service));
    }
    if (d) {
      const k = d.items.indexOf(service);
      if (k >= 0) {
        d.items.splice(k, 1);
        if (d.itemModes) d.itemModes.splice(k, 1);
      }
    }
  }
  return next;
}

// Moves one My Trips row to a new date/time; null when the row is no longer in the cart.
export function setRowDate(state, row, date, time) {
  if (row.kind === 'day' && row.day_no) {
    // cascadeFrom only moves dates, so the time is written onto its result (one state, one save).
    const moved = cascadeFrom(state, row.day_no - 1, date);
    return setItemTime(moved, row.day_no - 1, row.itemIndex || 0, time || '');
  }
  const next = JSON.parse(JSON.stringify(state));
  const list = row.kind === 'transfer' ? next.transfers : next.charters;
  const idx = row.kind === 'transfer'
    ? (state.transfers || []).findIndex((t) => t.route === row.service && t.date === row.date)
    : (state.charters || []).findIndex((c) => c.date === row.date);
  if (idx < 0) return null;
  list[idx].date = date;
  list[idx].time = time || '';
  return next;
}
