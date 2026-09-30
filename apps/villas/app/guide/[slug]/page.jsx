import { notFound } from 'next/navigation';
import ArticlePage from '@/components/sections/ArticlePage';
import { ARTICLES, articleBySlug } from '@/content/articles';

// Static export, so every article path is enumerated at build time.
export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

// `params` is a Promise in this Next: read without await, every article silently exported as the 404 page.
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
