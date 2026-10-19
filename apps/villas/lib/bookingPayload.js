import { VILLAS, nightsBetween } from '@/lib/villas';
import { serviceById } from '@/lib/bookingCart';
import { programByKey, transferById, TRANSFER_KEY } from '@/lib/extras';

const PICKUP_AREA = 'Ubud';
const AIRPORT = 'Ngurah Rai Airport (DPS)';

function villaCatalogName(slug) {
  const villa = VILLAS[slug];
  return villa ? villa.name : '';
}

function extraLine(extra, stay, villaName) {
  if (extra.kind === 'transfer') {
    const transfer = transferById(extra.dir);
    const isArrival = extra.dir === 'arrival';
    return {
      type: 'transfer',
      service: TRANSFER_KEY,
      date: transfer ? transfer.dateOf(stay) : '',
      time: extra.time || '',
      guests: stay.guests,
      pickup: isArrival ? AIRPORT : villaName,
      dropoff: isArrival ? villaName : AIRPORT,
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

export function bookingLines(cart) {
  const stay = cart.stay;
  if (!stay || nightsBetween(stay.checkIn, stay.checkOut) < 1) return [];
  const villaName = villaCatalogName(stay.villaSlug);
  const requests = cart.services
    .map(serviceById)
    .filter(Boolean)
    .map((service) => service.label);
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
