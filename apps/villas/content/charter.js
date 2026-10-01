import { CUE_LINK } from '@/lib/constants';

// CUE's charter plans (CUE content/shared/charter.json). `dur` is the API's tier key; prices come live from the catalog.
export const CHARTER_PLANS = [
  { dur: 'full', badge: 'Popular', name: 'Full Day', sub: '10 hours · around 120 km · per car up to 5' },
  { dur: 'half', name: 'Half Day', sub: '5 hours · around 60 km · per car up to 5' },
  { dur: 'long', name: '12 Hours', sub: '12 hours · around 140 km · per car up to 5' },
];

// Copy restates CUE's own charter page; booking happens there, so nothing here promises more than CUE does.
export const CHARTER_CARD = {
  eyebrow: 'Private driver',
  title: 'A car and a driver for the day',
  lede: 'Your own car and local driver from Cahyana Ubud Experience, the same family that hosts you. You choose the route, petrol is included, and the price is per car for up to 5 guests.',
  bookingNote: 'A driver for the day is booked on Cahyana Ubud Experience, not in this booking.',
  cta: 'Book charter',
  href: `${CUE_LINK}/charter.html`,
};
