// The /api/inquiry body for a villa booking: one villa line plus its CUE extras; prices are never sent, the server prices every line.
import { VILLAS, nightsBetween } from '@/lib/villas';
import { serviceById } from '@/lib/bookingCart';
import { programByKey, transferById, TRANSFER_KEY } from '@/lib/extras';

// Both villas are in Ubud, so every pickup is the villa and no pickup fee applies.
const PICKUP_AREA = 'Ubud';
const AIRPORT = 'Ngurah Rai Airport (DPS)';

function villaCatalogName(slug) {
  const villa = VILLAS[slug];
  return villa ? villa.name : '';
}

function extraLine(extra, stay, villaName) {
  if (extra.kind === 'transfer') {
    const transfer = transferById(extra.dir);
    const arriving = extra.dir === 'arrival';
    return {
      type: 'transfer',
      service: TRANSFER_KEY,
      date: transfer ? transfer.dateOf(stay) : '',
      time: extra.time || '',
      guests: stay.guests,
      pickup: arriving ? AIRPORT : villaName,
      dropoff: arriving ? villaName : AIRPORT,
      flight_number: String(extra.flight || '').trim(),
    };
  }
  const program = programByKey(extra.key);
  return {
    type: 'tour',
    service: extra.key,
    date: extra.date,
    time: extra.time || '',
    guests: stay.guests,
    mode: 'standard',
    pickup: villaName,
    dropoff: villaName,
    items: program ? program.title : '',
  };
}

// Lines in the shape the quote and the booking both take.
export function bookingLines(cart) {
  const stay = cart.stay;
  if (!stay || nightsBetween(stay.checkIn, stay.checkOut) < 1) return [];
  const villaName = villaCatalogName(stay.villaSlug);
  const requests = cart.services.map(serviceById).filter(Boolean).map((service) => service.label);
  return [
    {
      type: 'villa',
      service: villaName,
      date: stay.checkIn,
      check_out: stay.checkOut,
      guests: stay.guests,
      items: requests.length ? `Paid at the villa: ${requests.join(', ')}` : '',
    },
    ...cart.extras.map((extra) => extraLine(extra, stay, villaName)),
  ];
}

export function bookingBody({ cart, guest, currency, payOption }) {
  return {
    name: guest.name.trim(),
    email: guest.email.trim(),
    phone: guest.phone.trim(),
    currency,
    stay: PICKUP_AREA,
    pay_option: payOption,
    lines: bookingLines(cart),
  };
}
