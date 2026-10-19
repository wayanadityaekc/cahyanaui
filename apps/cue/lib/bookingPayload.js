import { formatTime } from '@/content/shared/timeSlots';

export function buildBookingPayload({
  ctx: bookingContext,
  f: formValues,
  referral,
  payOn,
  payOption,
  currency,
  stay,
  priced,
  displayGuests,
  singleLine,
  needsFlight,
  dateOf,
  timeOf,
}) {
  return {
    type: bookingContext.type,
    service: bookingContext.service,
    name: formValues.name,
    phone: formValues.phone,
    email: formValues.email,
    referral: (referral && referral.code) || '',
    pay_option: payOn ? payOption : '',
    currency: currency || 'USD',
    stay: stay || '',
    lines: bookingContext.lines.map((line, index) => {
      const linePrice =
        priced && priced.lines && priced.lines[index] && priced.lines[index].ok ? priced.lines[index] : null;
      const isTarget = !!singleLine && index === 0;
      return {
        type: line.type,
        service: line.service,
        date: dateOf(line, index) || line.date || '',
        time: timeOf(line, index) || line.time || '',
        guests: String(line.guests || displayGuests),
        pickup: line.pickup || formValues.pickup,
        dropoff: line.dropoff || formValues.dropoff,
        day_no: line.day_no != null ? line.day_no : null,
        flight_number:
          (isTarget && needsFlight ? formValues.flightNumber || line.flight_number : line.flight_number) || '',
        flight_datetime:
          (isTarget && needsFlight ? formValues.flightDatetime || line.flight_datetime : line.flight_datetime) || '',
        mode: line.mode || 'standard',
        area: line.area || '',
        duration: line.duration || '',
        extra: line.extra != null ? line.extra : 0,
        return: !!line.return,
        price_usd: linePrice ? linePrice.price_usd : null,
        price_idr: linePrice ? linePrice.price_idr : null,
      };
    }),
  };
}

export function priceText(priced) {
  if (!priced) return '-';
  const currencySymbol = priced.symbol || '$';
  return currencySymbol + priced.total.display.toLocaleString(currencySymbol === 'Rp' ? 'id-ID' : 'en-US');
}

export function buildWhatsappText({
  ctx: bookingContext,
  f: formValues,
  displayGuests,
  singleLine,
  flightNumberDisplay,
  dateOf,
  timeOf,
  price,
}) {
  const rowText = bookingContext.lines
    .map((line, index) => {
      const dateText = dateOf(line, index) || line.date || 'TBD';
      const timeText = timeOf(line, index);
      return `- ${line.day_no ? `Day ${line.day_no} · ` : ''}${dateText}${timeText ? ` · ${formatTime(timeText)}` : ''} · ${line.service} · ${line.guests || displayGuests} pax`;
    })
    .join('\n');
  const flightLine = flightNumberDisplay
    ? `\nFlight: ${flightNumberDisplay} (${formValues.flightDatetime || singleLine.flight_datetime || 'TBD'})`
    : '';
  return `Hello, I'd like to book:\nService: ${bookingContext.service}\nName: ${formValues.name}\nPhone: ${formValues.phone}\nEmail: ${formValues.email}\n${rowText}\nPick-up: ${formValues.pickup || '-'}\nDrop-off: ${formValues.dropoff || '-'}${flightLine}\nPrice: ${price}`;
}
