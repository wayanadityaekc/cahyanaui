import { CUE_LINK } from '@/lib/constants';
import { AIRPORT_ROUTE, allowedSlots, fmtTime } from '@/lib/timeSlots';

export const EXTRA_PROGRAMS = [
  { key: 'Ubud Tour', group: 'tours', title: 'Ubud: Rice Terrace & Monkey Forest', path: '/ubud-tour.html' },
  {
    key: 'Ubud Culture Day',
    group: 'tours',
    title: 'Full-Day Ubud Culture: Barong & Kecak',
    path: '/ubud-culture-day.html',
  },
  {
    key: 'East Bali Tour',
    group: 'tours',
    title: 'East Bali: Lempuyang, Besakih & Tirta Gangga',
    path: '/lempuyang-tirta-gangga.html',
  },
  { key: 'West Bali Tour', group: 'tours', title: 'West Bali Tour', path: '/tanah-lot-taman-ayun.html' },
  {
    key: 'Mount Batur Trekking',
    group: 'activities',
    title: 'Mount Batur Sunrise Trek',
    path: '/attractions/mount-batur-trekking.html',
  },
  { key: 'Rafting', group: 'activities', title: 'Ayung River Rafting', path: '/attractions/rafting.html' },
  {
    key: 'Cooking Class',
    group: 'activities',
    title: 'Cooking Class: Market & Kitchen',
    path: '/attractions/cooking-class.html',
  },
  { key: 'Kecak Dance', group: 'activities', title: 'Kecak Fire Dance', path: '/attractions/kecak-dance.html' },
].map((program) => ({ ...program, href: `${CUE_LINK}${program.path}` }));

export const TRANSFERS = [
  { id: 'arrival', title: 'Airport pickup (arrival)', dateOf: (stay) => stay.checkIn },
  { id: 'departure', title: 'Airport drop-off (departure)', dateOf: (stay) => stay.checkOut },
];

export const TRANSFER_KEY = AIRPORT_ROUTE;

export function programByKey(key) {
  return EXTRA_PROGRAMS.find((program) => program.key === key) || null;
}

export function transferById(id) {
  return TRANSFERS.find((transfer) => transfer.id === id) || null;
}

export function extraId(extra) {
  return extra.kind === 'transfer' ? `transfer:${extra.dir}` : `program:${extra.key}`;
}

export function slotsFor(key, category) {
  if (!category) return null;
  return allowedSlots(category, key) || null;
}

export function timeLabel(time) {
  return fmtTime(time);
}

export function extraProblem(extra, stay, category) {
  if (!stay || !stay.checkIn || !stay.checkOut) return 'Pick your stay dates first.';
  if (extra.kind === 'transfer') {
    if (!extra.time) return 'Add the pickup time for your flight.';
    return '';
  }
  if (!extra.date) return 'Pick a date.';
  if (extra.date < stay.checkIn || extra.date > stay.checkOut) return 'Pick a date inside your stay.';
  const slots = slotsFor(extra.key, category);
  if (!extra.time) return 'Pick a start time.';
  if (slots && !slots.includes(extra.time)) return 'Pick one of the listed start times.';
  return '';
}

export function priceFor(extra, catalog) {
  if (!catalog) return null;
  if (extra.kind === 'transfer')
    return catalog.transfer ? { display: catalog.transfer.display, idr: catalog.transfer.idr } : null;
  const item = catalog.items[extra.key];
  if (!item || !item.standard) return null;
  return { display: item.standard.display, idr: item.standard.idr };
}

export function isOffered(key, catalog) {
  if (!catalog) return true;
  const item = catalog.items[key];
  return !!item && item.active !== false;
}

export function extrasTotals(extras, catalog) {
  if (!extras.length) return { total: 0, totalIdr: 0, deposit: 0, rest: 0 };
  const prices = extras.map((extra) => priceFor(extra, catalog));
  if (prices.some((price) => !price) || !catalog.deposit) return null;
  const total = prices.reduce((sum, price) => sum + price.display, 0);
  const totalIdr = prices.reduce((sum, price) => sum + price.idr, 0);
  const deposit = Math.min(catalog.deposit.display, total);
  return { total, totalIdr, deposit, rest: total - deposit };
}
