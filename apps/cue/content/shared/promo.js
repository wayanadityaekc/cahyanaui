// Trip bar content, PER PAGE (Wayan, Sep 2026 - "gua mau tiap halaman beda").
//
// Shape: PROMO[route] = one message, or an ARRAY of messages that rotate in
// place (the homepage does this). A message is:
//   { text, cta?, href?, icon? }    icon: 'tag' | 'shield' | 'calendar' | 'info' | 'car'
// Leave a route out and it falls back to PROMO_DEFAULT. Set a route to `null`
// and the bar is OFF there - that is the honest state for a page whose copy is
// not decided yet, better than filling it with something invented.
//
// Routes are pathnames WITHOUT `.html` (that is what usePathname gives on this
// static export). A key ending in `/` matches by prefix, so a new page under
// /guide/ inherits without touching this file; an exact route always wins over
// a prefix, and the longest prefix wins (see kecak-dance).
//
// COPY RULE: every line here has to be TRUE. Where the claims come from:
// free cancellation 24h (listing cards + FAQ), car/driver/fuel included and
// tickets separate per tier (FAQ "Standard vs Exclusive"), charter priced per
// car up to 5 pax + 60k extra hour (charter page + pricing-data), 10% deposit
// (booking flow). Nothing new gets promised here without Wayan.

const FREE_CANCEL = {
  text: 'Free cancellation up to 24 hours before pickup',
  cta: 'See the policy',
  href: '/our-company.html#cancellation',
  icon: 'shield',
};

const KECAK = {
  text: 'Kecak dance: every Sunday and Tuesday',
  cta: 'See details',
  href: '/attractions/kecak-dance.html',
  icon: 'calendar',
};

const PRIVATE_TOUR = {
  text: 'Every tour is private. Car, driver and fuel included',
  icon: 'car',
};

const ASK_FIRST = {
  text: 'Planning questions are free. Ask before you book',
  cta: 'Chat with us',
  href: '/our-company.html#contact',
  icon: 'info',
};

const NAME_BOARD = { text: 'Your driver meets you with a name board', icon: 'car' };
const PLAN_LOCAL = { text: 'Your plan is saved on this device only', icon: 'info' };

// Detail pages (the 18 tour pages at the root + everything under /attractions/)
// are the majority and all want the same line, so THEY are the default and the
// handful of root pages that are NOT detail pages are listed explicitly below.
// Deriving the tour slug list here instead would drag the whole tour dataset
// into every page bundle (TripBar lives in Navbar), which is why it is inverted.
// No WhatsApp on detail pages (Wayan, Sep 2026): the book bar and the booking
// card already own the next step, a second channel just splits it.
export const PROMO_DEFAULT = {
  text: 'A 10% deposit locks your date. The rest is paid on the day',
  icon: 'info',
};

export const PROMO = {
  // Homepage alternates: reassurance first, then what is on this week.
  '/': [FREE_CANCEL, KECAK],

  // Selling pages - answer the doubt that stops the booking.
  '/tour': PRIVATE_TOUR,
  '/programs': PRIVATE_TOUR,
  '/activities': { text: 'Gear and a licensed guide included on every activity', icon: 'shield' },
  '/destinations': {
    text: 'Standard leaves entrance tickets out, Exclusive includes them',
    cta: 'See the difference',
    href: '/our-company.html#faq',
    icon: 'info',
  },

  // Exact route beats the default - on the Kecak page itself the old global
  // promo linked to the page you were already reading.
  '/attractions/kecak-dance': {
    text: 'Special event: Kecak dance every Sunday and Tuesday',
    icon: 'calendar',
  },

  // Reading pages - invite the question, do not sell.
  '/bali-guide': ASK_FIRST,
  '/guide/': ASK_FIRST,

  '/charter': {
    text: 'Priced per car, up to 5 passengers. Extra hours 60k',
    cta: 'See rates',
    href: '/charter.html#ch-durations',
    icon: 'car',
  },
  '/transfer': NAME_BOARD,
  '/airport-transfer': NAME_BOARD,

  '/all-reviews': FREE_CANCEL,

  // Tool pages - system info, or nothing. A promo here is just noise.
  '/my-trips': PLAN_LOCAL,
  '/itinerary': PLAN_LOCAL,
  '/settings': null,
  '/ui-kit': null,
  '/our-company': null, // Wayan belum mutusin isinya - jangan diisi karangan.
};

// Global kill switch for the whole bar.
export const PROMO_ACTIVE = true;

// Pathname -> the messages that page shows (always an array, possibly empty).
export function promoFor(pathname) {
  if (!PROMO_ACTIVE) return [];
  const path = (pathname || '/').replace(/\.html$/, '').replace(/(.)\/$/, '$1');
  let hit;
  if (Object.prototype.hasOwnProperty.call(PROMO, path)) {
    hit = PROMO[path];
  } else {
    const key = Object.keys(PROMO)
      .filter((k) => k.endsWith('/') && k.length > 1 && path.startsWith(k))
      .sort((a, b) => b.length - a.length)[0];
    hit = key ? PROMO[key] : PROMO_DEFAULT;
  }
  if (!hit) return [];
  return (Array.isArray(hit) ? hit : [hit]).filter((m) => m && m.text);
}
