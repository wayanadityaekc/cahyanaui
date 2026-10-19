export const CART_KEY = 'upv_booking_v1';

export const EMPTY = { stay: null, services: [], extras: [] };

export function readCart() {
  if (typeof window === 'undefined') return EMPTY;
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw);
    return {
      stay: parsed && typeof parsed.stay === 'object' ? parsed.stay : null,
      services: Array.isArray(parsed?.services) ? parsed.services : [],
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
  }
}

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
