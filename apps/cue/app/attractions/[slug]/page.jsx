import AttractionPage from '@/components/sections/AttractionPage';
import { ATTRACTION_CONTENT } from '@/content/attractions';
import { ATTRACTIONS, attractionPath } from '@/lib/routes';

export const dynamicParams = false;

export function generateStaticParams() {
  return ATTRACTIONS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const d = ATTRACTION_CONTENT[slug];
  if (!d) return { alternates: { canonical: attractionPath(slug) } };
  return {
    title: d.metaTitle,
    description: d.metaDesc,
    alternates: { canonical: attractionPath(slug) },
    openGraph: { title: d.metaTitle, description: d.metaDesc, images: d.ogImage ? [d.ogImage] : undefined },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  return <AttractionPage data={{ ...ATTRACTION_CONTENT[slug], __page: `attractions/${slug}` }} />;
}
