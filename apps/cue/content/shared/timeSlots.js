// Pickup-time options for the booking confirmation popup (BookConfirmModal).
// TIME_SLOTS = the full pickup-time range offered site-wide (06:00-19:30, every
// 30 min). Transfer and Charter always offer the full list - free choice, nothing
// blocked (Wayan, Sep 2026: "transfer charter bebas pilih jam").
//
// Tour / Experience / Performance / multi-day combo items can be restricted to a
// subset via RESTRICTED_SLOTS below - list ONLY the times that actually work for
// that program and every other slot in the picker greys out automatically
// ("jam yang gabisa dipilih itu di block matikan").
//
// CEK WAYAN: RESTRICTED_SLOTS is empty right now, so every tour/experience/
// performance currently offers the FULL range above (nothing is blocked yet) -
// this is the safe default until real schedules are filled in here (no fake
// business hours invented). Add an entry per item with its real start time(s)/
// cutoff, keyed EXACTLY like `prices.tour`/`prices.experience`/`prices.performance`
// in cahyana-api/pricing-data.js, e.g. once you have the real hours:
//   "Kecak Dance": ["18:00"],                    // fixed sunset showtime, one slot
//   "Mount Batur Trekking": ["02:00", "02:30"],   // sunrise trek, pre-dawn pickup only
export const RESTRICTED_SLOTS = {};

export const TIME_SLOTS = (() => {
  const out = [];
  for (let m = 6 * 60; m <= 19 * 60 + 30; m += 30) {
    const h = String(Math.floor(m / 60)).padStart(2, '0');
    const mm = String(m % 60).padStart(2, '0');
    out.push(`${h}:${mm}`);
  }
  return out;
})();

// Categories whose pickup time can be restricted per item via RESTRICTED_SLOTS.
// Transfer & Charter are looked up separately (always free choice) - not here.
const RESTRICTABLE = new Set(['tour', 'experience', 'performance', 'combo']);

function fmtLabel(t) {
  const [h, m] = t.split(':').map(Number);
  const period = h < 12 ? 'AM' : 'PM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}

// Build the <Select> option list for a "Pickup Time" field.
//   category - catalog item category ('tour'/'experience'/'performance'/'combo'),
//              or null/'transfer'/'charter' for the always-free-choice types.
//   itemName - catalog item name, used to look up a restriction override.
export function timeOptions(category, itemName) {
  const allowed = RESTRICTABLE.has(category) ? RESTRICTED_SLOTS[itemName] : null;
  return TIME_SLOTS.map((t) => ({
    value: t,
    label: fmtLabel(t),
    disabled: !!allowed && !allowed.includes(t),
  }));
}

// Same route string used by AirportTransferForm.jsx / cahyana-api pricing-data.js
// (prices.transfer key) - centralised here so both places compare identically.
export const AIRPORT_ROUTE = 'Airport – Ubud';
