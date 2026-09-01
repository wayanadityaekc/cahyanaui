import { GUIDES, guidePath } from '@/lib/routes';

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDES.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return { alternates: { canonical: guidePath(slug) } };
}

export default async function GuidePage({ params }) {
  const { slug } = await params;
  return (
    <main>
      <h1>{slug}</h1>
      <p>Guide route shell. Content lands in MIG-32.</p>
    </main>
  );
}
