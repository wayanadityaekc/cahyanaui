import { CHARTER_SERVICE } from '@/lib/constants';

export function cartRows(state, displayGuests) {
  const out = [];
  (state.days || []).forEach((d, i) => {
    if (!d.items || !d.items.length) return;
    d.items.forEach((name, k) => {
      out.push({
        kind: 'day',
        type: 'tour',
        service: name,
        date: d.date || '',
        guests: parseInt(d.guests, 10) || displayGuests,
        mode: (d.itemModes && d.itemModes[k]) || 'standard',
        time: (d.itemTimes && d.itemTimes[k]) || '',
        itemIndex: k,
        day_no: i + 1,
      });
    });
  });
  (state.transfers || []).forEach((t, transferIndex) =>
    out.push({
      kind: 'transfer',
      type: 'transfer',
      service: t.route,
      date: t.date || '',
      guests: parseInt(t.guests, 10) || displayGuests,
      return: !!t.return,
      localIndex: transferIndex,
      ...(t.direction ? { direction: t.direction } : null),
      ...(t.pickup ? { pickup: t.pickup } : null),
      ...(t.dropoff ? { dropoff: t.dropoff } : null),
      ...(t.time ? { time: t.time } : null),
      ...(t.flight_number ? { flight_number: t.flight_number } : null),
      ...(t.flight_datetime ? { flight_datetime: t.flight_datetime } : null),
    }),
  );
  (state.charters || []).forEach((c, charterIndex) =>
    out.push({
      kind: 'charter',
      type: 'charter',
      service: CHARTER_SERVICE,
      date: c.date || '',
      guests: parseInt(c.guests, 10) || displayGuests,
      area: c.area || 'Ubud',
      duration: c.dur || c.duration,
      extra: c.extra || 0,
      localIndex: charterIndex,
      ...(c.time ? { time: c.time } : null),
    }),
  );
  return out;
}
