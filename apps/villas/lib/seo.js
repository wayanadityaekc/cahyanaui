const SITE_NAME = 'Ubud Private Villas';
const DEFAULT_IMAGE = '/images/cahyana-house-pool-aerial-garden.jpg';

export function pageMeta({ title, description, path, image = DEFAULT_IMAGE }) {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: 'website', siteName: SITE_NAME, title, description, url: path, images: [image] },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}
