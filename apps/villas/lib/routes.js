import { VILLA_LIST } from '@/lib/villas';
import { ARTICLES } from '@/content/articles';

export const SITE = 'https://ubudprivatevillas.com';

const STATIC_PATHS = [
  '/',
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
    ...VILLA_LIST.map((villa) => `/villas/${villa.slug}`),
    ...ARTICLES.map((article) => `/guide/${article.slug}`),
  ].map((path) => (path.endsWith('/') ? path : `${path}/`));
}
