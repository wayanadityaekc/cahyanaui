
export const TIME_SLOTS = (() => {
  const out = [];
  [...Array(48).keys()].map((k) => k * 30).forEach((m) => {
    out.push(`${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`);
  });
  return out;
})();

function range(from, to) { return TIME_SLOTS.filter((t) => t >= from && t <= to); }

const PRE_DAWN = ['02:00', '03:00'];
const MORNING = ['08:00', '08:30', '09:00'];
const LEMPUYANG = range('03:00', '09:00');
const DAYLIGHT = range('07:00', '16:00');
const AFTERNOON = range('12:00', '16:00');

const CATEGORY_SLOTS = {
  tour: MORNING,
  combo: MORNING,
  experience: DAYLIGHT,
  performance: MORNING,
  place: DAYLIGHT,
};

export const RESTRICTED_SLOTS = {
  'East Bali Tour': LEMPUYANG,
  'Mount Batur Trekking': PRE_DAWN,
  'Jeep Sunrise': PRE_DAWN,
  'Kecak Dance': ['19:00'],
  'Barong Dance': MORNING,
  'Uluwatu & Sunset Kecak': AFTERNOON,
  'Batur Sunrise & Adrenaline': PRE_DAWN,
  'Kintamani Sunrise & Penglipuran': PRE_DAWN,
  'Lempuyang Temple - Gates of Heaven': LEMPUYANG,
  'Tanah Lot Sunset Temple': AFTERNOON,
  'Uluwatu Cliff Temple': AFTERNOON,
};

const RESTRICTABLE = new Set(['tour', 'experience', 'performance', 'combo', 'place']);

export function fmtTime(t) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
}

export function fmtDate(v) {
  if (!v) return '';
  const [y, m, d] = String(v).split('-').map(Number);
  if (!y || !m || !d) return String(v);
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function fmtHour(h) {
  const n = Number(h);
  return `${n % 12 === 0 ? 12 : n % 12} ${n < 12 ? 'AM' : 'PM'}`;
}

export function allowedSlots(category, itemName) {
  if (!RESTRICTABLE.has(category)) return null;
  return RESTRICTED_SLOTS[itemName] || CATEGORY_SLOTS[category] || null;
}

export function timeOptions(category, itemName) {
  const allowed = allowedSlots(category, itemName);
  return TIME_SLOTS.map((t) => ({
    value: t,
    label: fmtTime(t),
    disabled: !!allowed && !allowed.includes(t),
  }));
}

export function defaultSlot(category, itemName) {
  const allowed = allowedSlots(category, itemName);
  return allowed ? allowed[0] : '';
}

export const AIRPORT_ROUTE = 'Airport – Ubud';
