import HomepageCard from '@/components/cards/HomepageCard';
import { CARD_FRAME, CARD_IMAGE, CARD_IMG } from '@/components/ui/cardClasses';
import { CAROUSEL_TITLE } from '@/components/ui/carouselSection';
import { GRID_GUIDEMORE } from '@/components/ui/gridClasses';
import { PAGE_WIDE } from '@/components/ui/railClasses';
import { SEE_OUR_TOURS } from '@/content/shared/guide-more';

// Guide-article bottom block (SEE_OUR_TOURS or guide cards); PAGE_WIDE keeps it on the article's left edge.
const BOX = `${PAGE_WIDE} py-[var(--section-gap)]`;

export default function GuideMore({ block }) {
  const b = block.kind === 'tours' && !block.cards ? SEE_OUR_TOURS : block;
  return (
    <section className={`guide-more ${BOX}`}>
      <h2 className={CAROUSEL_TITLE}>{b.title}</h2>
      <div className={GRID_GUIDEMORE}>
        {b.kind === 'tours'
          ? b.cards.map((c) => <HomepageCard key={c.href} {...c} />)
          : b.cards.map((c, i) => (
              <a className={`${CARD_FRAME} flex flex-col`} href={c.href} key={i}>
                <div className={CARD_IMAGE}>
                  <img className={CARD_IMG} src={`/assets/images/${c.img}`} alt={c.alt} loading="lazy" width={c.w} height={c.hgt} />
                </div>
                <div className="flex flex-col grow p-4">
                  {/* Tag and title use the same token scale as GuideCard. */}
                  <span className="text-label font-medium tracking-[0.14em] uppercase text-muted">{c.tag}</span>
                  <h3 className="font-body text-h3 font-semibold leading-[1.3] mt-[0.3rem] mb-0">{c.title}</h3>
                </div>
              </a>
            ))}
      </div>
    </section>
  );
}
