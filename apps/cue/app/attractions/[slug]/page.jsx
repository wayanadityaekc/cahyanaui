import { ATTRACTIONS, attractionPath } from '@/lib/routes';

export const dynamicParams = false;

export function generateStaticParams() {
  return ATTRACTIONS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return { alternates: { canonical: attractionPath(slug) } };
}

export default async function AttractionPage({ params }) {
  const { slug } = await params;
  return (
    <main>
      <h1>{slug}</h1>
      <p>Attraction route shell. Content lands in MIG-31.</p>
    </main>
  );
}
