export const HOME_CRUMB = { label: 'Home', href: '/' };
export const GUIDE_CRUMBS = [HOME_CRUMB, { label: 'Ubud Guide', href: '/guide/' }];
export const COMPANY_CRUMBS = [HOME_CRUMB, { label: 'Our Company', href: '/our-company/' }];

export function buildVillaCrumbs(villa) {
  return [HOME_CRUMB, { label: villa.name, href: `/villas/${villa.slug}/` }];
}

export function buildServiceCrumbs(label, slug) {
  return [HOME_CRUMB, { label, href: `/services/${slug}/` }];
}

export function buildArticleCrumbs(article) {
  return [...GUIDE_CRUMBS, { label: article.short || article.title, href: `/guide/${article.slug}/` }];
}
