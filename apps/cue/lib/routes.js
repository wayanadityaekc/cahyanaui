export const SITE = 'https://cahyanaubudexperience.com';

export const NOINDEX = ['my-trips', 'settings'];

export const TOURS = [
  'banyumala-twin-lakes',
  'batur-sunrise-adrenaline',
  'besakih-taman-ujung',
  'best-of-bali-3-day-package',
  'full-adventure-rafting-atv',
  'gwk-pandawa-beach',
  'hidden-beaches-cliffs',
  'jatiluwih-tour',
  'kintamani-sunrise-penglipuran',
  'lempuyang-tirta-gangga',
  'lovina-dolphin-sekumpul',
  'munduk-twin-lakes',
  'sangeh-tanah-lot',
  'south-coast-sunset-kecak',
  'tanah-lot-taman-ayun',
  'ubud-atv-adventure',
  'ubud-culture-day',
  'ubud-rafting-adventure',
  'ubud-tour',
  'ulun-danu-tanah-lot',
];

export const ATTRACTIONS = [
  'atv-ride',
  'balangan-beach',
  'bali-bird-park',
  'bali-zoo',
  'banjar-hot-spring',
  'banyumala-waterfall',
  'barong-dance',
  'batur-breakfast',
  'batur-hot-spring',
  'besakih',
  'bingin-beach',
  'coffee-plantation',
  'cooking-class',
  'garuda-wisnu-kencana',
  'gitgit-waterfall',
  'goa-gajah',
  'green-bowl-beach',
  'gunung-kawi',
  'handara-gate',
  'jatiluwih-rice-terrace',
  'jeep-sunrise',
  'jungle-swing',
  'kecak-dance',
  'lempuyang-temple',
  'lovina-dolphin',
  'monkey-forest',
  'mount-batur-trekking',
  'munduk',
  'pandawa-beach',
  'penglipuran',
  'pura-batuan',
  'rafting',
  'sangeh-monkey-forest',
  'sekumpul-waterfall',
  'snorkeling-east-bali',
  'taman-ayun',
  'taman-ujung',
  'tanah-lot',
  'tegal-wangi-beach',
  'tegalalang-rice-terrace',
  'tegenungan-waterfall',
  'tirta-empul',
  'tirta-gangga',
  'twin-lakes',
  'ubud-arts-crafts',
  'ubud-market',
  'ubud-royal-palace',
  'ulun-danu-beratan',
  'uluwatu-kecak',
  'uluwatu-temple',
  'watersport',
];

export const GUIDES = [
  'bali-adventure-activities',
  'bali-beaches-surf',
  'bali-day-tours',
  'bali-money-sim-visa',
  'bali-rice-terraces',
  'bali-volcanoes',
  'bali-waterfalls',
  'balinese-dance',
  'balinese-hinduism',
  'best-time-to-visit-bali',
  'canggu',
  'getting-around-bali',
  'temple-etiquette',
  'ubud',
  'uluwatu-bukit',
];

export const BESPOKE = [
  'about-us',
  'activities',
  'airport-transfer',
  'all-reviews',
  'bali-guide',
  'cancellation-policy',
  'charter',
  'contact',
  'destinations',
  'faq',
  'itinerary',
  'programs',
  'my-trips',
  'privacy-policy',
  'settings',
  'terms-conditions',
  'tour',
  'transfer',
];

export const LEGACY_REDIRECTS = {
  '/ubud-jeep-sunrise.html': '/kintamani-sunrise-penglipuran.html',
  '/taste-of-ubud.html': '/attractions/cooking-class.html',
  '/ubud-cooking-market.html': '/attractions/cooking-class.html',
  '/attractions/celuk-silver.html': '/attractions/ubud-arts-crafts.html',
  '/attractions/batik.html': '/attractions/ubud-arts-crafts.html',
  '/south-bali-tour.html': '/hidden-beaches-cliffs.html',
};

export function tourPath(slug) {
  return `/${slug}.html`;
}

export function attractionPath(slug) {
  return `/attractions/${slug}.html`;
}

export function guidePath(slug) {
  return `/guide/${slug}.html`;
}

export function allPaths() {
  return [
    '/',
    ...BESPOKE.map((s) => `/${s}.html`),
    ...TOURS.map(tourPath),
    ...ATTRACTIONS.map(attractionPath),
    ...GUIDES.map(guidePath),
  ];
}

export function indexablePaths() {
  return allPaths().filter((p) => !NOINDEX.some((s) => p === `/${s}.html`));
}
