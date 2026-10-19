const FREE_CANCEL = {
  text: 'Free cancellation up to 24 hours',
  cta: 'See policy',
  href: '/our-company.html#cancellation',
  icon: 'shield',
};

const KECAK = {
  text: 'Kecak dance: Sundays and Tuesdays',
  cta: 'See details',
  href: '/attractions/kecak-dance.html',
  icon: 'calendar',
};

const PRIVATE_TOUR = {
  text: 'Private tour, car and driver included',
  icon: 'car',
};

const ASK_FIRST = {
  text: 'Planning questions are free',
  cta: 'Ask us',
  href: '/our-company.html#contact',
  icon: 'info',
};

const NAME_BOARD = { text: 'Your driver meets you with a name board', icon: 'car' };
const PLAN_LOCAL = { text: 'Saved on this device only', icon: 'info' };

export const PROMO_DEFAULT = {
  text: 'A $10 deposit locks your date',
  icon: 'info',
};

export const PROMO = {
  '/': [FREE_CANCEL, KECAK],

  '/tour': PRIVATE_TOUR,
  '/activities': { text: 'Gear and licensed guide included', icon: 'shield' },
  '/destinations': {
    text: 'Exclusive includes entrance tickets',
    cta: 'Compare',
    href: '/our-company.html#faq',
    icon: 'info',
  },

  '/attractions/kecak-dance': {
    text: 'Special event: Sundays and Tuesdays',
    icon: 'calendar',
  },

  '/bali-guide': ASK_FIRST,
  '/guide/': ASK_FIRST,

  '/charter': {
    text: 'Per car, up to 5 passengers',
    cta: 'See rates',
    href: '/charter.html#ch-durations',
    icon: 'car',
  },
  '/transfer': NAME_BOARD,
  '/airport-transfer': NAME_BOARD,

  '/all-reviews': FREE_CANCEL,

  '/my-trips': PLAN_LOCAL,
  '/settings': null,
  '/ui-kit': null,
  '/our-company': null,
};

export const PROMO_ACTIVE = true;

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
