import { TOURS, tourPath } from '@/lib/routes';

export const dynamicParams = false;

export function generateStaticParams() {
  return TOURS.map((tourSlug) => ({ tourSlug }));
}

export async function generateMetadata({ params }) {
  const { tourSlug } = await params;
  return { alternates: { canonical: tourPath(tourSlug) } };
}

export default async function TourPage({ params }) {
  const { tourSlug } = await params;
  return (
    <main>
      <h1>{tourSlug}</h1>
      <p>Tour route shell. Content lands in MIG-30.</p>
    </main>
  );
}
