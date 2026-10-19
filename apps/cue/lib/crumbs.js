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
  if (!page || page === 'index') return [];
  const label = SECTION[page];
  if (!label) return [];
  return [HOME, { label, href: `/${page}.html` }];
}

export function guideCrumbs(tabs = [], title = '') {
  const cat = tabs.find((tab) => tab.active) || tabs[0];
  return [
    HOME,
    { label: 'Bali Guide', href: '/bali-guide.html' },
    ...(cat ? [{ label: cat.label, href: cat.href }] : []),
    ...(title ? [{ label: title }] : []),
  ];
}
