export const SITE = 'https://cahyanaubudexperience.com';

// Kept out of the generated sitemap. my-trips/settings are private tools;
// programs.html sets robots:noindex in its own metadata, so listing it would
// send Google both "here is my URL" and "do not index it".
export const NOINDEX = ['my-trips', 'settings', 'programs'];

// Tours parked as "not ready to sell yet" (Wayan). Their content stays in
// content/tours/index.js so they can be switched back on by deleting a line
// here. This list keeps them out of the shipped sitemap; sitemap.xml at the
// root marks the same slugs NONAKTIF.
export const HIDDEN_TOURS = [
  'hidden-beaches-cliffs',
  'lovina-dolphin-sekumpul',
  'munduk-twin-lakes',
];

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

// about-us / contact / faq / terms-conditions / privacy-policy /
// cancellation-policy were folded into our-company.html (Sep 2026) and now only
// exist as 301s in public/.htaccess - listing them here kept them in the shipped
// sitemap, pointing Google at six redirects.
export const BESPOKE = [
  'activities',
  'airport-transfer',
  'all-reviews',
  'bali-guide',
  'charter',
  'destinations',
  'itinerary',
  'our-company',
  'programs',
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
};

export function tourPath(slug) {
  return `/${slug}.html`;
}

// True for a link pointing at a parked tour. Card lists filter on this so a
// hidden tour stops being offered anywhere, while its page still resolves for
// anyone holding the link (no 404s) and its content stays put for the day
// Wayan switches it back on.
export function isHiddenTour(href) {
  return HIDDEN_TOURS.some((slug) => href === tourPath(slug));
}

// Same switch, applied to editorial HTML: an anchor pointing at a parked tour
// is unwrapped so the sentence reads the same but stops being a way through to
// a page that still has a Book Now on it.
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
