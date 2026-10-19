import AttractionPage from '@/components/sections/AttractionPage';
import { ATTRACTION_CONTENT } from '@/content/attractions';
import { ATTRACTIONS, buildAttractionPath } from '@/lib/routes';

export const dynamicParams = false;

export function generateStaticParams() {
  return ATTRACTIONS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const attraction = ATTRACTION_CONTENT[slug];
  if (!attraction) return { alternates: { canonical: buildAttractionPath(slug) } };
  return {
    title: attraction.metaTitle,
    description: attraction.metaDesc,
    alternates: { canonical: buildAttractionPath(slug) },
    openGraph: {
      title: attraction.metaTitle,
      description: attraction.metaDesc,
      images: attraction.ogImage ? [attraction.ogImage] : undefined,
    },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  return <AttractionPage data={{ ...ATTRACTION_CONTENT[slug], __page: `attractions/${slug}` }} />;
}
