// The trail for every page that is NOT a detail page (those keep theirs in
// content, see itemsFromLegacy). Sep 2026: ten indexable pages shipped a
// BreadcrumbList in their JSON-LD and nothing on screen, so a guest had no way
// back up while Google was told there was one.
//
// Deliberately a small literal map and nothing else: this module is imported by
// listing and form pages, and pulling TOUR_CONTENT or GUIDE_CONTENT in here to
// "derive" the labels would drag those datasets into every one of their bundles -
// the same trap TripBar hit with TOUR_CONTENT and PayWaiting with LISTINGS.
//
// Keys match the `page` string each page already passes to <JsonLd>, so the two
// cannot be pointed at different pages by accident.
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
  itinerary: 'Itinerary',
  'our-company': 'Our Company',
  'about-us': 'About Us',
  programs: 'All Programs',
  'my-trips': 'My Trips',
  settings: 'Settings',
};

export function crumbsFor(page) {
  // The homepage is the root; a breadcrumb that reads "Home" and nothing else is
  // noise, and Google ignores a single-item BreadcrumbList anyway.
  if (!page || page === 'index') return [];
  const label = SECTION[page];
  if (!label) return [];
  return [HOME, { label, href: `/${page}.html` }];
}

// A guide article: Home › Bali Guide › <its category> › <the article>.
// The visible crumb used to stop at the category and never name the article,
// while the JSON-LD named the article but never said Home - two hand-kept copies
// of one trail, disagreeing. Both come from here now.
export function guideCrumbs(tabs = [], title = '') {
  const cat = tabs.find((t) => t.active) || tabs[0];
  return [
    HOME,
    { label: 'Bali Guide', href: '/bali-guide.html' },
    ...(cat ? [{ label: cat.label, href: cat.href }] : []),
    ...(title ? [{ label: title }] : []),
  ];
}
