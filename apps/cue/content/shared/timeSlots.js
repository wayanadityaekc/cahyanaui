// Start-time rules per item; keys must equal the API catalog keys, a typo silently restricts nothing.

// Every half hour of the day, 00:00-23:30, so 02:00/03:00 sunrise departures exist.
export const TIME_SLOTS = (() => {
  const out = [];
  [...Array(48).keys()].map((k) => k * 30).forEach((m) => {
    out.push(`${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`);
  });
  return out;
})();

// Inclusive half-hour range, e.g. range('03:00', '09:00').
function range(from, to) { return TIME_SLOTS.filter((t) => t >= from && t <= to); }

const PRE_DAWN = ['02:00', '03:00'];            // trekking + jeep sunrise: those two, nothing else
const MORNING = ['08:00', '08:30', '09:00'];    // the normal tour departure window
const LEMPUYANG = range('03:00', '09:00');      // queue at the Gates of Heaven builds fast
const DAYLIGHT = range('07:00', '16:00');       // Wayan: "7-4"
const AFTERNOON = range('12:00', '16:00');      // sunset runs: leave midday, arrive for the light

// Default window per category; transfer and charter are absent on purpose, so any time is allowed.
const CATEGORY_SLOTS = {
  tour: MORNING,
  combo: MORNING,
  experience: DAYLIGHT,
  performance: MORNING, // Kecak overrides below; Barong is morning until Wayan sends the real time
  place: DAYLIGHT,
};

// Per-item overrides. Keys must match `prices.*` in cahyana-api/pricing-data.js EXACTLY.
export const RESTRICTED_SLOTS = {
  // tour
  'East Bali Tour': LEMPUYANG,
  // experience
  'Mount Batur Trekking': PRE_DAWN,
  'Jeep Sunrise': PRE_DAWN,
  // performance
  'Kecak Dance': ['19:00'],
  // Barong Dance uses the morning window until the real showtime is confirmed.
  'Barong Dance': MORNING,
  // combo
  'Uluwatu & Sunset Kecak': AFTERNOON,
  // Sunrise combos get the pre-dawn slots (their core activity is the sunrise trek/jeep); unconfirmed, check with the owner.
  'Batur Sunrise & Adrenaline': PRE_DAWN,
  'Kintamani Sunrise & Penglipuran': PRE_DAWN,
  // place
  'Lempuyang Temple - Gates of Heaven': LEMPUYANG,
  'Tanah Lot Sunset Temple': AFTERNOON,
  'Uluwatu Cliff Temple': AFTERNOON,
};

// Categories that get a restricted schedule at all; anything else may start at any time.
const RESTRICTABLE = new Set(['tour', 'experience', 'performance', 'combo', 'place']);

// The one 12-hour display formatter; stored values stay 24-hour ('14:30') for the server and sorting.
export function fmtTime(t) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
}

// Site-wide date label (e.g. 12 Oct 2026); fmtHour below formats a bare hour for the flight-time picker.
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

// Times an item may start: item override, then category default, else null (any time).
export function allowedSlots(category, itemName) {
  if (!RESTRICTABLE.has(category)) return null; // null = every slot is fine
  return RESTRICTED_SLOTS[itemName] || CATEGORY_SLOTS[category] || null;
}

// All 48 slots with the ones this item cannot start at marked disabled.
export function timeOptions(category, itemName) {
  const allowed = allowedSlots(category, itemName);
  return TIME_SLOTS.map((t) => ({
    value: t,
    label: fmtTime(t),
    disabled: !!allowed && !allowed.includes(t),
  }));
}

// First allowed start time, used as the default for a new row (empty for unrestricted items).
export function defaultSlot(category, itemName) {
  const allowed = allowedSlots(category, itemName);
  return allowed ? allowed[0] : '';
}

// Airport route name; must equal the API catalog key (prices.transfer), so import it, never retype it.
export const AIRPORT_ROUTE = 'Airport – Ubud';
