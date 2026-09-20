// The site's own URL and the list of paths that belong in the sitemap.
//
// Written out by hand rather than crawled off the filesystem, because
// "every exported route" and "every page worth indexing" are not the same
// list: /my-booking only ever shows one guest's own in-progress booking read
// out of their browser, so a crawler would see nothing but the empty state.
// It is noindex on the page itself and absent here.
//
// Add a page → add it here. There is no build step that will notice for you.
import { VILLA_LIST } from '@/lib/villas';
import { ARTICLES } from '@/content/articles';

export const SITE = 'https://ubudprivatevillas.com';

const STATIC_PATHS = [
  '/',
  '/villas',
  '/experiences',
  '/guide',
  '/our-company',
  '/services/breakfast',
  '/services/spa',
  '/services/live-dinner',
  '/services/scooter-rental',
];

export function indexablePaths() {
  return [
    ...STATIC_PATHS,
    ...VILLA_LIST.map((v) => `/villas/${v.slug}`),
    ...ARTICLES.map((a) => `/guide/${a.slug}`),
  ];
}
