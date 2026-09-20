import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { ARTICLES, CATEGORIES, categoryLabel } from '@/content/articles';
import { GRID_CARDS } from '@/components/ui/gridClasses';

export const metadata = {
  title: 'Ubud Guide | Ubud Private Villas by Cahyana Ubud',
  description: 'Getting around Ubud, what is near the villas, when to visit Bali, and whether a villa or a hotel suits your trip - written by the family who hosts here.',
};

const IC = 'w-[var(--icon-sm)] h-[var(--icon-sm)] shrink-0';

export default function GuideHubPage() {
  return (
    <>
      <section className="pt-14 pb-10 border-b border-line bg-cream">
        <div className="wrap">
          <p className="eyebrow">Ubud Guide</p>
          <h1 className="text-display font-bold text-gold">Things worth knowing before you come</h1>
          <p className="mt-3 max-w-xl text-body text-muted">
            Written by the family who lives here and hosts the villas. Practical, and honest about the awkward parts.
          </p>
        </div>
      </section>

      {/* One section per category, each with its own anchor: the category links
          inside an article point at /guide#<id>, so the id has to live here. */}
      {CATEGORIES.map((cat) => {
        const items = ARTICLES.filter((a) => a.cat === cat.id);
        if (items.length === 0) return null;
        return (
          <section key={cat.id} id={cat.id} className="section scroll-mt-[calc(var(--header-h,58px)+1.5rem)]">
            <div className="wrap">
              <h2 className="text-h2 font-semibold text-gold mb-6">{cat.label}</h2>
              <div className={GRID_CARDS}>
                {items.map((a) => (
                  <Link key={a.slug} href={`/guide/${a.slug}`} className="card card-hover p-5 flex flex-col gap-2 no-underline">
                    <p className="eyebrow !mb-0">{categoryLabel(a.cat)}</p>
                    <h3 className="text-h3 font-semibold text-gold">{a.title}</h3>
                    <p className="text-small text-muted">{a.sub}</p>
                    <span className="mt-auto pt-3 flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-1.5 caps text-cta">
                        Read <ArrowRight className={IC} strokeWidth={1.6} aria-hidden="true" />
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-label text-muted">
                        <Clock className={IC} strokeWidth={1.7} aria-hidden="true" />~{a.read} min
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
