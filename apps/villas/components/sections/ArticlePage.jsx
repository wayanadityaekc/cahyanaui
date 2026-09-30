'use client';

import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import CatDropdown, { CAT_ITEM, CAT_ITEM_TAP } from '@/components/ui/CatDropdown';
import Prose from '@/components/prose/Prose';
import { CARD, CARD_WRAP } from '@/components/ui/detailCardClasses';
import { TOUR_LAYOUT_BOOK, TOUR_LAYOUT_MAIN, TOUR_LAYOUT_SIDE } from '@/components/ui/tourLayoutClasses';
import { GRID_CARDS } from '@/components/ui/gridClasses';
import { ARTICLES, CATEGORIES, categoryLabel } from '@/content/articles';
import { CAPS, Card, Container, EYEBROW_LINE, Section, Breadcrumb } from '@cahyana/ui';
import { articleCrumbs } from '@/lib/crumbs';

// Paragraph spacing lives here, not in Prose; max-w keeps lines readable (a full 950px line is ~145 chars).
const PROSE =
  'max-w-[var(--container-read)] ' +
  '[&_p]:m-0 [&_p]:mb-4 [&_p]:text-body [&_p]:text-ink [&_p]:leading-[var(--lh-body)] ' +
  '[&_p:last-child]:mb-0 [&_a]:text-gold [&_a]:font-medium [&_a]:underline ' +
  '[&_li]:text-body [&_li]:text-ink [&_li]:leading-[var(--lh-body)]';
const META = 'flex flex-wrap items-center gap-x-4 gap-y-1 text-label text-muted';
const ICON = 'w-[var(--icon-sm)] h-[var(--icon-sm)] shrink-0';

function CatList({ activeId, onPick }) {
  return CATEGORIES.map((category) => {
    const on = category.id === activeId;
    return (
      <Link
        key={category.id}
        href={`/guide#${category.id}`}
        onClick={onPick}
        className={onPick ? CAT_ITEM_TAP(on) : CAT_ITEM(on)}
        aria-current={on || undefined}
      >
        {category.label}
      </Link>
    );
  });
}

// Guide article on CUE's layout: category column on the RIGHT (border-l on purpose), CatDropdown on mobile.
export default function ArticlePage({ article }) {
  const more = ARTICLES.filter((other) => other.slug !== article.slug).slice(0, 3);

  return (
    <article>
      <header className="bg-cream border-b border-line">
        <Container className="py-10">
          <Breadcrumb items={articleCrumbs(article)} linkAs={Link} className="mb-2" />
          <p className={EYEBROW_LINE}>{categoryLabel(article.cat)}</p>
          <h1 className="text-display font-bold text-gold max-w-3xl">{article.title}</h1>
          <p className="mt-3 max-w-2xl text-body text-muted">{article.sub}</p>
          <p className={`${META} mt-4`}>
            <span className="inline-flex items-center gap-1.5">
              <Clock className={ICON} strokeWidth={1.7} aria-hidden="true" />
              ~{article.read} min read
            </span>
          </p>
        </Container>
      </header>

      <div className={TOUR_LAYOUT_BOOK}>
        <div className={TOUR_LAYOUT_MAIN}>
          <div className={CARD_WRAP}>
            <div className={CARD}>
              <CatDropdown
                className="min-[993px]:hidden w-full pb-[var(--space-1)] mb-5 border-b border-line"
                label={categoryLabel(article.cat)}
                ariaLabel="Guide categories"
              >
                {(close) => <CatList activeId={article.cat} onPick={close} />}
              </CatDropdown>

              <div className={PROSE}>
                <Prose blocks={article.body} headingVariant="guide" />
              </div>
            </div>
          </div>
        </div>

        <div className={TOUR_LAYOUT_SIDE}>
          <nav
            className="max-[992px]:hidden flex flex-col gap-[var(--space-2)] pl-[var(--space-3)] border-l border-line"
            aria-label="Guide categories"
          >
            <p className={`${CAPS} text-muted`}>Guide</p>
            <CatList activeId={article.cat} />
            <Link href="/guide" className="inline-flex items-center gap-1.5 mt-2 text-body text-gold hover:text-cta">
              All articles <ArrowRight className={ICON} strokeWidth={1.6} aria-hidden="true" />
            </Link>
          </nav>
        </div>
      </div>

      {more.length > 0 && (
        <Section tone="cream">
          <h2 className="text-h2 font-semibold text-gold mb-6">Keep reading</h2>
          <div className={GRID_CARDS}>
            {more.map((related) => (
              <Card as={Link} hover key={related.slug} href={`/guide/${related.slug}`} className="p-5 flex flex-col gap-2 no-underline">
                <p className={`${EYEBROW_LINE} !mb-0`}>{categoryLabel(related.cat)}</p>
                <h3 className="text-h3 font-semibold text-gold">{related.title}</h3>
                <p className="text-small text-muted">{related.sub}</p>
                <span className={`${CAPS} mt-auto pt-3 inline-flex items-center gap-1.5 text-cta`}>
                  Read <ArrowRight className={ICON} strokeWidth={1.6} aria-hidden="true" />
                </span>
              </Card>
            ))}
          </div>
</Section>
      )}
    </article>
  );
}
