import { SITE } from '@/lib/routes';
import { CONTACT_EMAIL, CUE_LINK, WHATSAPP_NUMBER } from '@/lib/constants';
import { REGISTRATION } from '@/content/registration';

export { HOME_CRUMB, GUIDE_CRUMBS, COMPANY_CRUMBS, villaCrumbs, serviceCrumbs, articleCrumbs } from '@/lib/crumbs';

// Every item carries its own URL, the current page included: an item with no URL has pointed Google at the homepage before (CUE).
export function breadcrumbList(items = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `${SITE}${item.href}`,
    })),
  };
}

const ADDRESS = { '@type': 'PostalAddress', addressLocality: 'Ubud', addressRegion: 'Bali', addressCountry: 'ID' };

const OPERATOR = {
  '@type': 'Organization',
  name: REGISTRATION.name,
  url: CUE_LINK,
  identifier: { '@type': 'PropertyValue', propertyID: 'NIB', value: REGISTRATION.nib },
};

// The site as a business; no aggregateRating on purpose (the 4.96 is Airbnb's, Wayan kept it out of schema).
export function siteSchema(villas = []) {
  const rates = villas.map((villa) => villa.nightlyRateIdr).sort((a, b) => a - b);
  return [
    { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Ubud Private Villas', url: `${SITE}/` },
    {
      '@context': 'https://schema.org',
      '@type': 'LodgingBusiness',
      name: 'Ubud Private Villas',
      url: `${SITE}/`,
      email: CONTACT_EMAIL,
      telephone: `+${WHATSAPP_NUMBER}`,
      address: ADDRESS,
      currenciesAccepted: 'IDR',
      priceRange: rates.length ? `IDR ${rates[0]}-${rates[rates.length - 1]} per night` : undefined,
      parentOrganization: OPERATOR,
    },
  ];
}

// One villa: the nightly rupiah rate as an Offer, the same number the page converts from.
export function villaSchema(villa) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: villa.name,
    description: villa.shortDesc,
    url: `${SITE}/villas/${villa.slug}/`,
    image: `${SITE}${villa.heroImg}`,
    address: ADDRESS,
    numberOfRooms: villa.bedrooms,
    telephone: `+${WHATSAPP_NUMBER}`,
    parentOrganization: OPERATOR,
    makesOffer: {
      '@type': 'Offer',
      price: villa.nightlyRateIdr,
      priceCurrency: 'IDR',
      priceSpecification: { '@type': 'UnitPriceSpecification', price: villa.nightlyRateIdr, priceCurrency: 'IDR', unitText: 'night' },
      url: `${SITE}/villas/${villa.slug}/`,
    },
  };
}

export function articleSchema(article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.metaDesc || article.sub,
    url: `${SITE}/guide/${article.slug}/`,
    author: { '@type': 'Organization', name: 'Ubud Private Villas' },
    publisher: OPERATOR,
  };
}
