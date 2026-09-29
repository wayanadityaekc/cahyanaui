// Breadcrumb trails for non-detail pages; a literal map (no content imports), keyed by the same `page` as JsonLd.
const HOME = { label: 'Home', href: '/' };

const SECTION = {
  tour: 'Tours',
  destinations: 'Destinations',
  activities: 'Experiences',
  charter: 'Charter',
  transfer: 'Transfer',
  'airport-transfer': 'Airport Transfer',
  'bali-guide': 'Bali Guide',
  'all-reviews': 'Guest Reviews',
  'our-company': 'Our Company',
  'about-us': 'About Us',
  'my-trips': 'My Trips',
  settings: 'Settings',
};

export function crumbsFor(page) {
  // No trail on the homepage; a single 'Home' crumb is noise.
  if (!page || page === 'index') return [];
  const label = SECTION[page];
  if (!label) return [];
  return [HOME, { label, href: `/${page}.html` }];
}

// Guide article trail: Home > Bali Guide > category > article; used for both the visible crumb and JSON-LD.
export function guideCrumbs(tabs = [], title = '') {
  const cat = tabs.find((t) => t.active) || tabs[0];
  return [
    HOME,
    { label: 'Bali Guide', href: '/bali-guide.html' },
    ...(cat ? [{ label: cat.label, href: cat.href }] : []),
    ...(title ? [{ label: title }] : []),
  ];
}
