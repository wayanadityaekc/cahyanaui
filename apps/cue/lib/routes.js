export const SITE = 'https://cahyanaubudexperience.com';

// Kept out of the generated sitemap. my-trips/settings are private tools.
export const NOINDEX = ['my-trips', 'settings'];

// Parked tours: page kept, dropped from the sitemap and card lists; delete a line to switch one back on.
export const HIDDEN_TOURS = [
  'banyumala-twin-lakes',
  'gwk-pandawa-beach',
  'hidden-beaches-cliffs',
  'lovina-dolphin-sekumpul',
  'munduk-twin-lakes',
];

export const TOURS = [
  'banyumala-twin-lakes',
  'batur-sunrise-adrenaline',
  'best-of-bali-3-day-package',
  'full-adventure-rafting-atv',
  'gwk-pandawa-beach',
  'hidden-beaches-cliffs',
  'jatiluwih-tour',
  'kintamani-sunrise-penglipuran',
  'lempuyang-tirta-gangga',
  'lovina-dolphin-sekumpul',
  'munduk-twin-lakes',
  'south-coast-sunset-kecak',
  'tanah-lot-taman-ayun',
  'ubud-atv-adventure',
  'ubud-culture-day',
  'ubud-rafting-adventure',
  'ubud-tour',
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

// Pages folded into our-company.html are 301s in .htaccess; listing them here would put redirects in the sitemap.
export const BESPOKE = [
  'activities',
  'airport-transfer',
  'all-reviews',
  'bali-guide',
  'charter',
  'destinations',
  'our-company',
  'my-trips',
  'settings',
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
  '/ulun-danu-tanah-lot.html': '/jatiluwih-tour.html',
  '/sangeh-tanah-lot.html': '/tanah-lot-taman-ayun.html',
};

export function tourPath(slug) {
  return `/${slug}.html`;
}

// True for a link to a parked tour; card lists filter these out while the page still resolves.
export function isHiddenTour(href) {
  return HIDDEN_TOURS.some((slug) => href === tourPath(slug));
}

// Unwraps editorial links to parked tours so the text reads the same without linking to them.
export function unlinkHiddenTours(html) {
  if (!html || !HIDDEN_TOURS.length) return html;
  const slugs = HIDDEN_TOURS.join('|');
  return html.replace(new RegExp(`<a\\b[^>]*href="/(?:${slugs})\\.html"[^>]*>([\\s\\S]*?)</a>`, 'gi'), '$1');
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
  const off = new Set([...NOINDEX, ...HIDDEN_TOURS].map((s) => `/${s}.html`));
  return allPaths().filter((p) => !off.has(p));
}
