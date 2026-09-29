import { fmtTime } from '@/content/shared/timeSlots';

// Booking request sent to /api/inquiry; carries the quoted prices or the server stores nothing and the email shows $0.
export function bookingPayload({ ctx, f, referral, payOn, payOption, currency, stay, priced, displayGuests, singleLine, needsFlight, dateOf, timeOf }) {
  return ({
    type: ctx.type,
    service: ctx.service,
    name: f.name,
    phone: f.phone,
    email: f.email,
    referral: (referral && referral.code) || '',
    // Only the option the guest picked; the server never trusts an amount from the browser.
    pay_option: payOn ? payOption : '',
    // Quoted currency, so the server invoices the same number the guest agreed to.
    currency: currency || 'USD',
    stay: stay || '',
    lines: ctx.lines.map((l, i) => {
      const p = priced && priced.lines && priced.lines[i] && priced.lines[i].ok ? priced.lines[i] : null;
      // Each line sends its own date/time (falling back to what it arrived with); flight fields only for a single airport line.
      const isTarget = !!singleLine && i === 0;
      return {
        type: l.type,
        service: l.service,
        date: dateOf(l, i) || l.date || '',
        time: timeOf(l, i) || l.time || '',
        guests: String(l.guests || displayGuests),
        pickup: l.pickup || f.pickup,
        dropoff: l.dropoff || f.dropoff,
        day_no: l.day_no != null ? l.day_no : null,
        flight_number: (isTarget && needsFlight ? f.flightNumber || l.flight_number : l.flight_number) || '',
        flight_datetime: (isTarget && needsFlight ? f.flightDatetime || l.flight_datetime : l.flight_datetime) || '',
        mode: l.mode || 'standard',
        area: l.area || '',
        duration: l.duration || '',
        extra: l.extra != null ? l.extra : 0,
        return: !!l.return,
        price_usd: p ? p.price_usd : null,
        price_idr: p ? p.price_idr : null,
      };
    }),
  });
}

// Quoted total as display text ("$240", "Rp1.200.000"), or "-" before the quote lands.
export function priceText(priced) {
  if (!priced) return '-';
  const s = priced.symbol || '$';
  return s + priced.total.display.toLocaleString(s === 'Rp' ? 'id-ID' : 'en-US');
}

// Prefilled WhatsApp message for "Discuss via WhatsApp".
export function whatsappText({ ctx, f, displayGuests, singleLine, flightNumberDisplay, dateOf, timeOf, price }) {
  const rowText = ctx.lines
    .map((l, i) => {
      const d = dateOf(l, i) || l.date || 'TBD';
      const t = timeOf(l, i);
      return `- ${l.day_no ? `Day ${l.day_no} · ` : ''}${d}${t ? ` · ${fmtTime(t)}` : ''} · ${l.service} · ${l.guests || displayGuests} pax`;
    })
    .join('\n');
  const flightLine = flightNumberDisplay ? `\nFlight: ${flightNumberDisplay} (${f.flightDatetime || singleLine.flight_datetime || 'TBD'})` : '';
  return `Hello, I'd like to book:\nService: ${ctx.service}\nName: ${f.name}\nPhone: ${f.phone}\nEmail: ${f.email}\n${rowText}\nPick-up: ${f.pickup || '-'}\nDrop-off: ${f.dropoff || '-'}${flightLine}\nPrice: ${price}`;
}
