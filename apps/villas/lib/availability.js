import { API_BASE } from '@/lib/constants';

export const AVAILABILITY_COPY = {
  free: 'Good news: these nights are open.',
  taken: 'Sorry, some of those nights are already booked. Please pick other dates.',
  unknown: "We can't confirm availability online right now, so our team will check these nights by hand on WhatsApp.",
};

export async function checkStay(villaSlug, checkIn, checkOut) {
  const query = new URLSearchParams({ villa: villaSlug, checkIn, checkOut }).toString();
  try {
    const response = await fetch(`${API_BASE}/villas/check?${query}`, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) return 'unknown';
    const data = await response.json();
    return data && (data.answer === 'free' || data.answer === 'taken') ? data.answer : 'unknown';
  } catch (e) {
    return 'unknown';
  }
}

export const STAY_RULES = { minNights: 2, maxNights: 30, maxDaysAhead: 365 };

export function baliToday() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Makassar', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

export async function fetchAvailability(villaSlug) {
  try {
    const response = await fetch(`${API_BASE}/villas/availability?villa=${encodeURIComponent(villaSlug)}`, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) return { known: false, busy: [] };
    const data = await response.json();
    const villa = data && data.villas && data.villas[villaSlug];
    if (!villa || !villa.known || !Array.isArray(villa.busy)) return { known: false, busy: [] };
    return { known: true, busy: villa.busy.filter((range) => range && range.from && range.to) };
  } catch (e) {
    return { known: false, busy: [] };
  }
}
