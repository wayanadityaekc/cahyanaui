import { VILLAS, countNightsBetween } from '@/lib/villas';
import { findServiceById } from '@/lib/bookingCart';
import { findProgramByKey, findTransferById, TRANSFER_KEY } from '@/lib/extras';

const PICKUP_AREA = 'Ubud';
const AIRPORT = 'Ngurah Rai Airport (DPS)';

function findVillaCatalogName(slug) {
  const villa = VILLAS[slug];
  return villa ? villa.name : '';
}

function buildExtraLine(extra, stay, villaName) {
  if (extra.kind === 'transfer') {
    const transfer = findTransferById(extra.dir);
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
  const program = findProgramByKey(extra.key);
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

export function buildBookingLines(cart) {
  const stay = cart.stay;
  if (!stay || countNightsBetween(stay.checkIn, stay.checkOut) < 1) return [];
  const villaName = findVillaCatalogName(stay.villaSlug);
  const requests = cart.services
    .map(findServiceById)
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
    ...cart.extras.map((extra) => buildExtraLine(extra, stay, villaName)),
  ];
}

export function buildBookingBody({ cart, guest, currency, payOption }) {
  return {
    name: guest.name.trim(),
    email: guest.email.trim(),
    phone: guest.phone.trim(),
    currency,
    stay: PICKUP_AREA,
    pay_option: payOption,
    lines: buildBookingLines(cart),
  };
}
