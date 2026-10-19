import { notFound } from 'next/navigation';
import ArticlePage from '@/components/sections/ArticlePage';
import { ARTICLES, articleBySlug } from '@/content/articles';
import { JsonLd } from '@cahyana/ui';
import { pageMeta } from '@/lib/seo';
import { articleCrumbs, articleSchema, breadcrumbList } from '@/lib/schema';

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = articleBySlug(slug);
  if (!article) return {};
  return pageMeta({ title: article.metaTitle || article.title, description: article.metaDesc || article.sub, path: `/guide/${slug}/` });
}

export default async function GuideArticleRoute({ params }) {
  const { slug } = await params;
  const article = articleBySlug(slug);
  if (!article) notFound();
  return (
    <>
      <JsonLd data={[articleSchema(article), breadcrumbList(articleCrumbs(article))]} />
      <ArticlePage article={article} />
    </>
  );
}
