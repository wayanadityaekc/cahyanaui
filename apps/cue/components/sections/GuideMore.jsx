import HomepageCard from '@/components/cards/HomepageCard';
import { CARD_FRAME, CARD_IMAGE, CARD_IMG } from '@/components/ui/cardClasses';
import { CAROUSEL_TITLE } from '@/components/ui/carouselSection';
import { GRID_GUIDEMORE } from '@/components/ui/gridClasses';
import { PAGE_WIDE } from '@/components/ui/railClasses';
import { SEE_OUR_TOURS } from '@/content/shared/guide-more';

const BOX = `${PAGE_WIDE} py-[var(--section-gap)]`;

export default function GuideMore({ block }) {
  const b = block.kind === 'tours' && !block.cards ? SEE_OUR_TOURS : block;
  return (
    <section className={`guide-more ${BOX}`}>
      <h2 className={CAROUSEL_TITLE}>{b.title}</h2>
      <div className={GRID_GUIDEMORE}>
        {b.kind === 'tours'
          ? b.cards.map((card) => <HomepageCard key={card.href} {...card} />)
          : b.cards.map((card, i) => (
              <a className={`${CARD_FRAME} flex flex-col`} href={card.href} key={i}>
                <div className={CARD_IMAGE}>
                  <img className={CARD_IMG} src={`/assets/images/${card.img}`} alt={card.alt} loading="lazy" width={card.w} height={card.hgt} />
                </div>
                <div className="flex flex-col grow p-4">
                  <span className="text-label font-medium tracking-[0.14em] uppercase text-muted">{card.tag}</span>
                  <h3 className="font-body text-h3 font-semibold leading-[1.3] mt-[0.3rem] mb-0">{card.title}</h3>
                </div>
              </a>
            ))}
      </div>
    </section>
  );
}
