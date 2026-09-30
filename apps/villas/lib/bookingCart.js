// Guest's booking in localStorage only: the stay and extras are priced, villa services are paid at the villa (no price here).
export const CART_KEY = 'upv_booking_v1';

export const EMPTY = { stay: null, services: [], extras: [] };

// Every read is wrapped: localStorage throws in private windows, and bad data must not crash the page.
export function readCart() {
  if (typeof window === 'undefined') return EMPTY;
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw);
    return {
      stay: parsed && typeof parsed.stay === 'object' ? parsed.stay : null,
      services: Array.isArray(parsed?.services) ? parsed.services : [],
      // Carts saved before extras existed simply have none.
      extras: Array.isArray(parsed?.extras) ? parsed.extras.filter((extra) => extra && typeof extra === 'object') : [],
    };
  } catch (e) {
    return EMPTY;
  }
}

export function writeCart(cart) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (e) {
    /* private window, or storage full - the page still works, it just forgets */
  }
}

// What the navbar badge counts: the stay is one line, each service and each extra one more.
export function countItems(cart) {
  return (cart.stay ? 1 : 0) + (cart.services?.length || 0) + (cart.extras?.length || 0);
}

export const SERVICES = [
  { id: 'breakfast', label: 'Breakfast', href: '/services/breakfast' },
  { id: 'spa', label: 'Spa & Massage', href: '/services/spa' },
  { id: 'live-dinner', label: 'Live Dinner', href: '/services/live-dinner' },
  { id: 'scooter-rental', label: 'Scooter Rental', href: '/services/scooter-rental' },
];

export function serviceById(id) {
  return SERVICES.find((service) => service.id === id) || null;
}
