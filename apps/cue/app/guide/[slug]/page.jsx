import GuideArticle from '@/components/sections/GuideArticle';
import { GUIDE_CONTENT } from '@/content/guides';
import { GUIDES, guidePath } from '@/lib/routes';

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDES.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const d = GUIDE_CONTENT[slug];
  if (!d) return { alternates: { canonical: guidePath(slug) } };
  return {
    title: d.metaTitle,
    description: d.metaDesc,
    alternates: { canonical: guidePath(slug) },
    openGraph: { title: d.metaTitle, description: d.metaDesc, images: d.ogImage ? [d.ogImage] : undefined },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  return <GuideArticle data={{ ...GUIDE_CONTENT[slug], __page: `guide/${slug}` }} />;
}
