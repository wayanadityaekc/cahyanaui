import ExperienceCard from '@/components/cards/ExperienceCard';
import GuideCard from '@/components/cards/GuideCard';
import { SEE_OUR_TOURS } from '@/content/shared/guide-more';

// Blok "guide-more" di bawah artikel guide. `block` bisa:
//  - { kind:'tours' }               -> resolve ke SEE_OUR_TOURS shared (dedup 15x)
//  - { kind:'guides', cls, title, cards:[{href,img,alt,title,tag,cat}] } -> GuideCard
//  - { cls, title, kind:'tours', cards:[...] }  -> ExperienceCard (tour)
// Struktur/section-class dijaga identik sama HTML lama (verify diff=0, kecuali harga
// yang sekarang LIVE via <Price> - keputusan Wayan).
export default function GuideMore({ block }) {
  const b = block.kind === 'tours' && !block.cards ? SEE_OUR_TOURS : block;
  return (
    <section className={b.cls}>
      <h2 className="guide-more__title">{b.title}</h2>
      <div className="experience__grid experience__grid--home4">
        {b.cards.map((c, i) =>
          b.kind === 'tours' ? (
            <ExperienceCard
              key={i}
              href={c.href}
              img={c.img}
              name={c.name}
              meta={c.meta}
              priceName={c.priceName}
              priceFallback={c.priceFallback}
            />
          ) : (
            <GuideCard key={i} href={c.href} img={c.img} alt={c.alt} title={c.title} tag={c.tag} cat={c.cat} />
          ),
        )}
      </div>
    </section>
  );
}
