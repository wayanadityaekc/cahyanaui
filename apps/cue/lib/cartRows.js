import { CHARTER_SERVICE } from '@/lib/constants';

export function buildCartRows(state, displayGuests) {
  const cartRowItems = [];
  (state.days || []).forEach((day, index) => {
    if (!day.items || !day.items.length) return;
    day.items.forEach((name, itemIndex) => {
      cartRowItems.push({
        kind: 'day',
        type: 'tour',
        service: name,
        date: day.date || '',
        guests: parseInt(day.guests, 10) || displayGuests,
        mode: (day.itemModes && day.itemModes[itemIndex]) || 'standard',
        time: (day.itemTimes && day.itemTimes[itemIndex]) || '',
        itemIndex: itemIndex,
        day_no: index + 1,
      });
    });
  });
  (state.transfers || []).forEach((transfer, transferIndex) =>
    cartRowItems.push({
      kind: 'transfer',
      type: 'transfer',
      service: transfer.route,
      date: transfer.date || '',
      guests: parseInt(transfer.guests, 10) || displayGuests,
      return: !!transfer.return,
      localIndex: transferIndex,
      ...(transfer.direction ? { direction: transfer.direction } : null),
      ...(transfer.pickup ? { pickup: transfer.pickup } : null),
      ...(transfer.dropoff ? { dropoff: transfer.dropoff } : null),
      ...(transfer.time ? { time: transfer.time } : null),
      ...(transfer.flight_number ? { flight_number: transfer.flight_number } : null),
      ...(transfer.flight_datetime ? { flight_datetime: transfer.flight_datetime } : null),
    }),
  );
  (state.charters || []).forEach((charter, charterIndex) =>
    cartRowItems.push({
      kind: 'charter',
      type: 'charter',
      service: CHARTER_SERVICE,
      date: charter.date || '',
      guests: parseInt(charter.guests, 10) || displayGuests,
      area: charter.area || 'Ubud',
      duration: charter.dur || charter.duration,
      extra: charter.extra || 0,
      localIndex: charterIndex,
      ...(charter.time ? { time: charter.time } : null),
    }),
  );
  return cartRowItems;
}
