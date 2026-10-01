import { API_BASE } from '@/lib/constants';

// What the guest is told for each calendar answer; "unknown" is never shown as available.
export const AVAILABILITY_COPY = {
  free: 'Good news: these nights are open.',
  taken: 'Sorry, some of those nights are already booked. Please pick other dates.',
  unknown: "We can't confirm availability online right now, so our team will check these nights by hand on WhatsApp.",
};

// Asks cahyana-api's Airbnb calendar about one stay: "free", "taken" or "unknown" (anything but a clear answer).
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
