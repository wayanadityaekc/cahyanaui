import GuideArticle from '@/components/sections/GuideArticle';
import { GUIDE_CONTENT } from '@/content/guides';
import { GUIDES, guidePath } from '@/lib/routes';

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDES.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const guide = GUIDE_CONTENT[slug];
  if (!guide) return { alternates: { canonical: guidePath(slug) } };
  return {
    title: guide.metaTitle,
    description: guide.metaDesc,
    alternates: { canonical: guidePath(slug) },
    openGraph: {
      title: guide.metaTitle,
      description: guide.metaDesc,
      images: guide.ogImage ? [guide.ogImage] : undefined,
    },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  return <GuideArticle data={{ ...GUIDE_CONTENT[slug], __page: `guide/${slug}` }} />;
}
