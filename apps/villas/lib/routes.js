import { VILLA_LIST } from '@/lib/villas';
import { ARTICLES } from '@/content/articles';

export const SITE = 'https://ubudprivatevillas.com';

// Sitemap paths are listed by hand (/my-booking is noindex and left out): add a new page here, no build step will notice.
const STATIC_PATHS = [
  '/',
  '/guide',
  '/our-company',
  '/services/breakfast',
  '/services/spa',
  '/services/live-dinner',
  '/services/scooter-rental',
];

// Trailing slash on every path: the export writes folder/index.html, so /guide would be a 301 to /guide/.
export function indexablePaths() {
  return [
    ...STATIC_PATHS,
    ...VILLA_LIST.map((villa) => `/villas/${villa.slug}`),
    ...ARTICLES.map((article) => `/guide/${article.slug}`),
  ].map((path) => (path.endsWith('/') ? path : `${path}/`));
}
