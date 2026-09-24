import TourPage from '@/components/sections/TourPage';
import { TOUR_CONTENT } from '@/content/tours';
import { TOURS, HIDDEN_TOURS, tourPath } from '@/lib/routes';

export const dynamicParams = false;

export function generateStaticParams() {
  return TOURS.map((tourSlug) => ({ tourSlug }));
}

export async function generateMetadata({ params }) {
  const { tourSlug } = await params;
  const d = TOUR_CONTENT[tourSlug];
  if (!d) return { alternates: { canonical: tourPath(tourSlug) } };
  return {
    title: d.metaTitle,
    description: d.metaDesc,
    alternates: { canonical: tourPath(tourSlug) },
    openGraph: { title: d.metaTitle, description: d.metaDesc, images: d.ogImage ? [d.ogImage] : undefined },
    // Parked tours keep their page (anyone holding the link still lands on
    // something) but drop out of search along with the sitemap.
    ...(HIDDEN_TOURS.includes(tourSlug) ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function Page({ params }) {
  const { tourSlug } = await params;
  return <TourPage data={{ ...TOUR_CONTENT[tourSlug], __page: `${tourSlug}` }} />;
}
