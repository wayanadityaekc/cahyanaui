import { notFound } from 'next/navigation';
import ArticlePage from '@/components/sections/ArticlePage';
import { ARTICLES, articleBySlug } from '@/content/articles';

// Static export, so every article path is enumerated at build time.
export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

// `params` is a PROMISE in this version of Next, not a plain object. Read
// synchronously it is not undefined — it is a thenable whose .slug is
// undefined — so articleBySlug found nothing, notFound() fired, and every
// article exported as the 404 page with a build that still reported success.
// Awaiting it is the whole fix. Caught by the design audit: the article URLs
// came back with no headings and an h1 reading "404".
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = articleBySlug(slug);
  if (!article) return {};
  return {
    title: `${article.title} | Ubud Private Villas`,
    description: article.sub,
  };
}

export default async function GuideArticleRoute({ params }) {
  const { slug } = await params;
  const article = articleBySlug(slug);
  if (!article) notFound();
  return <ArticlePage article={article} />;
}
