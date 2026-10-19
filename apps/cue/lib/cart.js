export function addDaysStr(dateStr, dayOffset) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const shifted = new Date(year, month - 1, day + dayOffset);
  return `${shifted.getFullYear()}-${String(shifted.getMonth() + 1).padStart(2, '0')}-${String(shifted.getDate()).padStart(2, '0')}`;
}

export function cascadeDates(state, dayIndex, date) {
  const days = (state.days || []).map((day) => ({ ...day }));
  days.forEach((day, index) => {
    if (index >= dayIndex) day.date = addDaysStr(date, index - dayIndex);
  });
  return { ...state, days };
}

export function hasClash({ days }, isFullDay) {
  const seen = {};
  return (days || []).some((day) => {
    const isPartialDayDate = !day.date || !(day.items || []).some(isFullDay);
    if (isPartialDayDate) return false;
    if (seen[day.date]) return true;
    seen[day.date] = true;
    return false;
  });
}

export function findClashDates({ days }, isFullDay) {
  const seen = {};
  const mergedRows = [];
  (days || []).forEach((day) => {
    const isPartialDayDate = !day.date || !(day.items || []).some(isFullDay);
    if (isPartialDayDate) return;
    if (seen[day.date]) mergedRows.push(day.date);
    seen[day.date] = true;
  });
  return mergedRows;
}

export function setItemMode(state, dayIndex, itemIndex, mode) {
  const days = (state.days || []).map((day, index) => {
    if (index !== dayIndex) return day;
    const modes = [...(day.itemModes || [])];
    modes[itemIndex] = mode;
    return { ...day, itemModes: modes };
  });
  return { ...state, days };
}

export function setItemTime(state, dayIndex, itemIndex, time) {
  const days = (state.days || []).map((day, index) => {
    if (index !== dayIndex) return day;
    const times = [...(day.itemTimes || [])];
    times[itemIndex] = time;
    return { ...day, itemTimes: times };
  });
  return { ...state, days };
}

export function removeItem(state, dayIndex, itemIndex) {
  const days = (state.days || []).map((day, index) => {
    if (index !== dayIndex) return day;
    const items = [...(day.items || [])];
    const modes = [...(day.itemModes || [])];
    const times = [...(day.itemTimes || [])];
    items.splice(itemIndex, 1);
    modes.splice(itemIndex, 1);
    times.splice(itemIndex, 1);
    return { ...day, items, itemModes: modes, itemTimes: times };
  });
  return { ...state, days };
}

export function removeRow(state, { kind, localIndex, day_no, service }) {
  const next = JSON.parse(JSON.stringify(state));
  if (kind === 'transfer') next.transfers.splice(localIndex, 1);
  else if (kind === 'charter') next.charters.splice(localIndex, 1);
  else {
    let dayItem = next.days[day_no - 1];
    const isServiceMissingFromDay = !dayItem || !(dayItem.items || []).includes(service);
    if (isServiceMissingFromDay) {
      dayItem = (next.days || []).find((day) => (day.items || []).includes(service));
    }
    if (dayItem) {
      const serviceIndex = dayItem.items.indexOf(service);
      if (serviceIndex >= 0) {
        dayItem.items.splice(serviceIndex, 1);
        if (dayItem.itemModes) dayItem.itemModes.splice(serviceIndex, 1);
      }
    }
  }
  return next;
}

export function setRowDate(state, row, date, time) {
  if (row.kind === 'day' && row.day_no) {
    const moved = cascadeDates(state, row.day_no - 1, date);
    return setItemTime(moved, row.day_no - 1, row.itemIndex || 0, time || '');
  }
  const next = JSON.parse(JSON.stringify(state));
  const list = row.kind === 'transfer' ? next.transfers : next.charters;
  const index =
    row.kind === 'transfer'
      ? (state.transfers || []).findIndex((transfer) => transfer.route === row.service && transfer.date === row.date)
      : (state.charters || []).findIndex((charter) => charter.date === row.date);
  if (index < 0) return null;
  list[index].date = date;
  list[index].time = time || '';
  return next;
}
