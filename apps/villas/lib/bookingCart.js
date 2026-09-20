// The booking a guest is putting together, kept in their own browser.
//
// This is CUE's My Trips idea (an itinerary you build up, then hand over in one
// message) fitted to what this site actually sells: one stay, plus whichever
// villa services you want waiting when you arrive.
//
// TWO KINDS OF LINE, and the difference is not cosmetic. The stay is PRICED —
// lib/villas.js has a nightly rate and a service-fee rate, so nights x rate is
// a real number we can show. The services are NOT: every service page says
// "message us for current prices", so they go on the booking as REQUESTS with
// no figure. Inventing a number for them would be the site quoting a price
// nobody set. If real service prices ever land in the content, give each entry
// a `price` and total them in with the stay.
//
// Storage is localStorage and nothing else: no account, no server, no id that
// follows anyone. It survives a reload, and it never leaves the device until
// the guest presses send in WhatsApp.
export const CART_KEY = 'upv_booking_v1';

export const EMPTY = { stay: null, services: [] };

// Every read is wrapped: localStorage throws in a private window and comes back
// empty with site data cleared, and a half-written value should not take the
// page down with it.
export function readCart() {
  if (typeof window === 'undefined') return EMPTY;
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw);
    return {
      stay: parsed && typeof parsed.stay === 'object' ? parsed.stay : null,
      services: Array.isArray(parsed?.services) ? parsed.services : [],
    };
  } catch {
    return EMPTY;
  }
}

export function writeCart(cart) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {
    /* private window, or storage full - the page still works, it just forgets */
  }
}

// What the navbar badge counts: the stay is one line, each service is one more.
export function countItems(cart) {
  return (cart.stay ? 1 : 0) + (cart.services?.length || 0);
}

export const SERVICES = [
  { id: 'breakfast', label: 'Breakfast', href: '/services/breakfast' },
  { id: 'spa', label: 'Spa & Massage', href: '/services/spa' },
  { id: 'live-dinner', label: 'Live Dinner', href: '/services/live-dinner' },
  { id: 'scooter-rental', label: 'Scooter Rental', href: '/services/scooter-rental' },
];

export function serviceById(id) {
  return SERVICES.find((s) => s.id === id) || null;
}
