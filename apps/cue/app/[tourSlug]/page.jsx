import TourPage from '@/components/sections/TourPage';
import { TOUR_CONTENT } from '@/content/tours';
import { TOURS, HIDDEN_TOURS, buildTourPath } from '@/lib/routes';

export const dynamicParams = false;

export function generateStaticParams() {
  return TOURS.map((tourSlug) => ({ tourSlug }));
}

export async function generateMetadata({ params }) {
  const { tourSlug } = await params;
  const tour = TOUR_CONTENT[tourSlug];
  if (!tour) return { alternates: { canonical: buildTourPath(tourSlug) } };
  return {
    title: tour.metaTitle,
    description: tour.metaDesc,
    alternates: { canonical: buildTourPath(tourSlug) },
    openGraph: { title: tour.metaTitle, description: tour.metaDesc, images: tour.ogImage ? [tour.ogImage] : undefined },
    ...(HIDDEN_TOURS.includes(tourSlug) ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function Page({ params }) {
  const { tourSlug } = await params;
  return <TourPage data={{ ...TOUR_CONTENT[tourSlug], __page: `${tourSlug}` }} />;
}
