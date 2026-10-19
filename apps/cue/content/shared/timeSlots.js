export const TIME_SLOTS = (() => {
  const out = [];
  [...Array(48).keys()]
    .map((slotIndex) => slotIndex * 30)
    .forEach((minutes) => {
      out.push(`${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`);
    });
  return out;
})();

function filterTimeSlotsInRange(from, to) {
  return TIME_SLOTS.filter((timeSlot) => timeSlot >= from && timeSlot <= to);
}

const PRE_DAWN = ['02:00', '03:00'];
const MORNING = ['08:00', '08:30', '09:00'];
const LEMPUYANG = filterTimeSlotsInRange('03:00', '09:00');
const DAYLIGHT = filterTimeSlotsInRange('07:00', '16:00');
const AFTERNOON = filterTimeSlotsInRange('12:00', '16:00');

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

export function formatTime(time) {
  if (!time) return '';
  const [hours, minutes] = time.split(':').map(Number);
  return `${hours % 12 === 0 ? 12 : hours % 12}:${String(minutes).padStart(2, '0')} ${hours < 12 ? 'AM' : 'PM'}`;
}

export function formatDate(dateValue) {
  if (!dateValue) return '';
  const [year, month, day] = String(dateValue).split('-').map(Number);
  if (!year || !month || !day) return String(dateValue);
  return new Date(year, month - 1, day).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatHour(hour) {
  const hourNumber = Number(hour);
  return `${hourNumber % 12 === 0 ? 12 : hourNumber % 12} ${hourNumber < 12 ? 'AM' : 'PM'}`;
}

export function findAllowedSlots(category, itemName) {
  if (!RESTRICTABLE.has(category)) return null;
  return RESTRICTED_SLOTS[itemName] || CATEGORY_SLOTS[category] || null;
}

export function timeOptions(category, itemName) {
  const allowed = findAllowedSlots(category, itemName);
  return TIME_SLOTS.map((timeSlot) => ({
    value: timeSlot,
    label: formatTime(timeSlot),
    disabled: !!allowed && !allowed.includes(timeSlot),
  }));
}

export function findDefaultSlot(category, itemName) {
  const allowed = findAllowedSlots(category, itemName);
  return allowed ? allowed[0] : '';
}

export const AIRPORT_ROUTE = 'Airport – Ubud';
