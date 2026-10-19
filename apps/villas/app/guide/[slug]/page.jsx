import { notFound } from 'next/navigation';
import ArticlePage from '@/components/sections/ArticlePage';
import { ARTICLES, findArticleBySlug } from '@/content/articles';
import { JsonLd } from '@cahyana/ui';
import { buildPageMeta } from '@/lib/seo';
import { articleCrumbs, buildArticleSchema, buildBreadcrumbList } from '@/lib/schema';

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = findArticleBySlug(slug);
  if (!article) return {};
  return buildPageMeta({
    title: article.metaTitle || article.title,
    description: article.metaDesc || article.sub,
    path: `/guide/${slug}/`,
  });
}

export default async function GuideArticleRoute({ params }) {
  const { slug } = await params;
  const article = findArticleBySlug(slug);
  if (!article) notFound();
  return (
    <>
      <JsonLd data={[buildArticleSchema(article), buildBreadcrumbList(articleCrumbs(article))]} />
      <ArticlePage article={article} />
    </>
  );
}
