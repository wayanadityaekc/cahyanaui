// Start-time options for every bookable item.
//
// Sep 2026, Wayan: every tour now has to carry a start time, so this stopped being
// "the pickup-time picker in the confirm popup" and became the site's schedule.
// His rules, verbatim, and where each one landed:
//
//   "tour normal selain lempuyang, trekking itu pilihanya jam 8.00,8.30, 9.00 am,
//    jam yang lainya matiin aja"                                    -> MORNING
//   "Lempuyang start bisa dari jam 3 pagi sampai max jam 9"         -> 03:00-09:00
//   "trekking pilihanya jam 2 dan 3 aja, jeep sunrise juga jam 2 dan 3" -> PRE_DAWN
//   "charter bebas jam 24 jam" / "Transfer 24 jam" / "Airport 24 jam"-> no lookup
//   "Experience salain selain kecak dan barong itu jam nya daylight" -> DAYLIGHT,
//    and daylight = "7-4"                                           -> 07:00-16:00
//   "barong dance isi pagi dulu nanti gua update jam pastinya"      -> MORNING
//   "Uluwatu sunset siang aja jam 12-4bro, sisanya ikut default"    -> AFTERNOON
//   "Destinasi sunset dari jam 12- 4 aja bro"                       -> AFTERNOON
//
// TWO NAMES HAD TO BE TRANSLATED, because the catalog keys differ from what Wayan
// calls them, and the keys are what this file must match (they are the same keys as
// `prices.*` in cahyana-api/pricing-data.js - a typo here silently restricts nothing):
//   "Lempuyang" the TOUR      = `tour` -> "East Bali Tour"
//                               (the page is "East Bali: Lempuyang, Besakih & Tirta Gangga")
//   "Lempuyang" the DESTINATION = `place` -> "Lempuyang Temple - Gates of Heaven"
//   Kecak and Barong are `performance`, NOT `experience` - so "experience selain
//   kecak dan barong" is the 7 remaining experience items.

// Every half hour of the day. It used to start at 06:00, which meant 02:00 and 03:00
// - the times the sunrise trips actually leave - did not exist in the picker at all.
export const TIME_SLOTS = (() => {
  const out = [];
  for (let m = 0; m < 24 * 60; m += 30) {
    out.push(`${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`);
  }
  return out;
})();

// Inclusive half-hour range, e.g. range('03:00', '09:00').
const range = (from, to) => TIME_SLOTS.filter((t) => t >= from && t <= to);

const PRE_DAWN = ['02:00', '03:00'];            // trekking + jeep sunrise: those two, nothing else
const MORNING = ['08:00', '08:30', '09:00'];    // the normal tour departure window
const LEMPUYANG = range('03:00', '09:00');      // queue at the Gates of Heaven builds fast
const DAYLIGHT = range('07:00', '16:00');       // Wayan: "7-4"
const AFTERNOON = range('12:00', '16:00');      // sunset runs: leave midday, arrive for the light

// Default per category. An item listed in RESTRICTED_SLOTS overrides its category.
// `transfer` and `charter` are deliberately absent: Wayan wants those free, 24 hours,
// so they fall through to the full list.
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
  // CEK WAYAN: "barong dance isi pagi dulu nanti gua update jam pastinya" - it takes
  // the morning window for now (the tour default), not a made-up showtime.
  'Barong Dance': MORNING,
  // combo
  'Uluwatu & Sunset Kecak': AFTERNOON,
  // CEK WAYAN: these two are my reading, not Wayan's words. He said "sisanya ikut
  // default", but the activity inside each one IS the trekking / jeep sunrise he
  // pinned to 02:00 and 03:00, and a sunrise trip that departs at 08:00 is a booking
  // we cannot deliver. Flagged to him; change these two lines if he says otherwise.
  'Batur Sunrise & Adrenaline': PRE_DAWN,
  'Kintamani Sunrise & Penglipuran': PRE_DAWN,
  // place
  'Lempuyang Temple - Gates of Heaven': LEMPUYANG,
  'Tanah Lot Sunset Temple': AFTERNOON,
  'Uluwatu Cliff Temple': AFTERNOON,
};

// Categories that get a schedule at all. `place` is in here now - it was not before,
// so all 34 destinations offered every slot, Lempuyang included.
const RESTRICTABLE = new Set(['tour', 'experience', 'performance', 'combo', 'place']);

function fmtLabel(t) {
  const [h, m] = t.split(':').map(Number);
  const period = h < 12 ? 'AM' : 'PM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}

// The times an item may start. Item override first, then its category, then the full
// day for transfer/charter.
export function allowedSlots(category, itemName) {
  if (!RESTRICTABLE.has(category)) return null; // null = every slot is fine
  return RESTRICTED_SLOTS[itemName] || CATEGORY_SLOTS[category] || null;
}

// Option list for a time picker: every slot, with the ones this item cannot start at
// marked disabled, so the shape of the day stays visible instead of silently shrinking.
export function timeOptions(category, itemName) {
  const allowed = allowedSlots(category, itemName);
  return TIME_SLOTS.map((t) => ({
    value: t,
    label: fmtLabel(t),
    disabled: !!allowed && !allowed.includes(t),
  }));
}

// The first time an item can start - what a fresh row should default to, so a guest
// is not handed an empty field on every tour they add.
export function defaultSlot(category, itemName) {
  const allowed = allowedSlots(category, itemName);
  return allowed ? allowed[0] : '';
}

// Same route string used by AirportTransferForm.jsx / cahyana-api pricing-data.js
// (prices.transfer key) - centralised here so both places compare identically.
export const AIRPORT_ROUTE = 'Airport – Ubud';
