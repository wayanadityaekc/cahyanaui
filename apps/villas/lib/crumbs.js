// One source for every trail (visible crumb and JSON-LD); zero imports so client components can read it cheaply.
export const HOME_CRUMB = { label: 'Home', href: '/' };
export const GUIDE_CRUMBS = [HOME_CRUMB, { label: 'Ubud Guide', href: '/guide/' }];
export const COMPANY_CRUMBS = [HOME_CRUMB, { label: 'Our Company', href: '/our-company/' }];

export function villaCrumbs(villa) {
  return [HOME_CRUMB, { label: villa.name, href: `/villas/${villa.slug}/` }];
}

export function serviceCrumbs(label, slug) {
  return [HOME_CRUMB, { label, href: `/services/${slug}/` }];
}

export function articleCrumbs(article) {
  return [...GUIDE_CRUMBS, { label: article.short || article.title, href: `/guide/${article.slug}/` }];
}
