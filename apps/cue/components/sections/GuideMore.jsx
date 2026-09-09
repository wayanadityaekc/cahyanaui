import ExperienceCard from '@/components/cards/ExperienceCard';
import { CARD_FRAME, CARD_IMAGE, CARD_IMG } from '@/components/ui/cardClasses';
import { SEE_OUR_TOURS } from '@/content/shared/guide-more';

// Blok "guide-more" di bawah artikel guide. `block`:
//  - { kind:'tours' }  -> resolve ke SEE_OUR_TOURS shared (dedup 15x), pake ExperienceCard.
//  - { kind:'guides', cls, title, cards:[{href,img,alt,title,tag,w,hgt}] } -> kartu guide.
// Kartu guide di sini render STRUKTUR PERSIS HTML lama (class experience__card/
// guide-home__card + experience__image/body/name + guide-home__tag) = zero-diff. Bukan
// <GuideCard> (itu versi homepage judul-overlay, beda konteks). CSS class-nya diapus
// nanti pas family .experience__*/.guide-home__* dikonversi ke utilities.
//
// TW-B3 #336: box (.guide-more) + judul (.guide-more__title) -> utilities. Class
// `guide-more` dipertahankan HANYA sbg hook buat rule grid-override desktop
// `.guide-more .experience__grid--home4` (biar kartu wrap, bukan slide) - itu
// nempel ke grid engine `.experience__grid*` yg sengaja tetep CSS (CLAUDE.md).
const BOX = 'max-w-[1200px] mx-auto py-[var(--section-gap)] px-[var(--space-3)]';
const TITLE = 'font-body font-semibold text-h3 text-green mb-[1.2rem]';

export default function GuideMore({ block }) {
  const b = block.kind === 'tours' && !block.cards ? SEE_OUR_TOURS : block;
  const extra = b.cls.includes('tourprog') ? ' tourprog' : '';
  return (
    <section className={`guide-more ${BOX}${extra}`}>
      <h2 className={TITLE}>{b.title}</h2>
      <div className="experience__grid experience__grid--home4">
        {b.kind === 'tours'
          ? b.cards.map((c, i) => (
              <ExperienceCard
                key={i}
                href={c.href}
                img={c.img}
                name={c.name}
                meta={c.meta}
                priceName={c.priceName}
                priceFallback={c.priceFallback}
              />
            ))
          : b.cards.map((c, i) => (
              <a className={`${CARD_FRAME} flex flex-col`} href={c.href} key={i}>
                <div className={CARD_IMAGE}>
                  <img className={CARD_IMG} src={`/assets/images/${c.img}`} alt={c.alt} loading="lazy" width={c.w} height={c.hgt} />
                </div>
                <div className="flex flex-col grow p-4">
                  <span>{c.tag}</span>
                  <h3 className="font-body text-[1rem] font-semibold leading-[1.6] mb-[0.4rem]">{c.title}</h3>
                </div>
              </a>
            ))}
      </div>
    </section>
  );
}
