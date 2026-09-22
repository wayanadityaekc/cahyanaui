import HomepageCard from '@/components/cards/HomepageCard';
import { CARD_FRAME, CARD_IMAGE, CARD_IMG } from '@/components/ui/cardClasses';
import { CAROUSEL_TITLE } from '@/components/ui/carouselSection';
import { GRID_GUIDEMORE } from '@/components/ui/gridClasses';
import { SEE_OUR_TOURS } from '@/content/shared/guide-more';

// Blok "guide-more" di bawah artikel guide. `block`:
//  - { kind:'tours' }  -> resolve ke SEE_OUR_TOURS shared (dedup 15x).
//  - { kind:'guides', cls, title, cards:[{href,img,alt,title,tag,w,hgt}] } -> kartu guide.
//
// KARTU TOUR = `HomepageCard`, komponen yang SAMA dipakai homepage & "You might also
// like" di halaman detail (Sep 2026, Wayan: "pakai card homepage dan samakan ukuranya").
// Dulu di sini `ExperienceCard` - kartu putih 4:3 dengan judul di bawah foto - jadi
// blok terakhir yang dibaca tamu di artikel guide adalah satu-satunya tempat di web
// yang masih nawarin tour pakai bentuk kartu yang lain. Ukurannya ikut sendiri: grid
// ini lebarnya sama persis sama grid homepage (1152px, auto-fill minmax(260px,1fr)),
// jadi kartunya mendarat di lebar yang sama dan rasio 4/5 punya komponennya.
//
// Judul section pakai `CAROUSEL_TITLE` - string yang SAMA dipakai "You might also like"
// & "Destinations you'll visit" di halaman tour. Dulu ditulis ulang di sini dan
// ketinggalan `leading-[var(--lh-heading)]`.
const BOX = 'max-w-[1200px] mx-auto py-[var(--section-gap)] px-[var(--space-3)]';

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
                  {/* Tag + judul pakai tangga token yang sama kayak GuideCard (label
                      tracked uppercase muted, judul --fs-h3). Tag-nya dulu <span> polos
                      TANPA class sama sekali, jadi ke-render 16px hitam - lebih gede dari
                      judul kartunya sendiri. */}
                  <span className="text-label font-medium tracking-[0.14em] uppercase text-muted">{c.tag}</span>
                  <h3 className="font-body text-h3 font-semibold leading-[1.3] mt-[0.3rem] mb-0">{c.title}</h3>
                </div>
              </a>
            ))}
      </div>
    </section>
  );
}
