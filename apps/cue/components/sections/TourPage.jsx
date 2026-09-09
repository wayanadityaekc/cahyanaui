import Img from '@/components/ui/Img';
import JsonLd from '@/components/JsonLd';
import BookCta from '@/components/booking/BookCta';
import BookSidebar from '@/components/booking/BookSidebar';
import BookBar from '@/components/booking/BookBar';
import HeroSlider from '@/components/sections/HeroSlider';
import Related from '@/components/sections/Related';
import ReviewCtaBand from '@/components/reviews/ReviewCtaBand';
import DetailTabs from '@/components/sections/DetailTabs';

// Tailwind-native (migrasi Fase 2): teks stop (.stop__num/.stop__name/.stop__desc)
// -> utilities; .stop__body (tanpa CSS) -> drop class; .stop--link (link + hover
// lift) -> utilities. DIPERTAHANKAN sbg CSS: .stop (grid layout engine, di-scope
// .dtabs__sec .stop) + .stop__image (primitif foto shared, .stop__image > img).
export const STOP_NUM = 'inline-block mb-[0.6rem] text-label font-medium tracking-[0.14em] uppercase text-muted';
export const STOP_NAME = 'mb-[0.6rem] font-body text-h3 font-semibold tracking-[0]';
export const STOP_DESC = 'font-body text-body leading-[var(--lh-body)] font-normal';
const STOP_LINK = 'stop no-underline text-inherit [transition:transform_var(--dur-fast)_ease] hover:[transform:translateY(-3px)]';
// Breadcrumb (migrasi Fase 2): presentasi -> utilities. Kelas `crumb` DIPERTAHANKAN
// sbg marker: dipakai anchor sibling `.crumb + .related::before` (matiin divider dobel).
export const CRUMB_NAV = 'crumb max-w-none m-0 py-5 px-6 text-center [border-bottom:1px_solid_#e0ddd4] text-small text-muted';
export const CRUMB_LINK = 'text-gold no-underline font-medium hover:underline';
export const CRUMB_SEP = 'mx-[0.4rem] opacity-[0.55]';
// Fact hooks di hero detail (migrasi Fase 2): presentasi -> utilities. Kelas
// `tour-hook` DIPERTAHANKAN sbg marker check-detail. Breakpoint min-[769px]
// (bukan md:/768) biar match @media (min-width:769px) persis. li divider via
// [&>li+li]. Child li di-style dari <ul> ([&>li]) biar DRY (1 konteks, hero).
export const HOOK_UL = 'tour-hook list-none flex justify-center mt-6 mx-0 mb-0 p-0 [&>li]:flex [&>li]:flex-col [&>li]:px-4 min-[769px]:[&>li]:px-[22px] [&>li+li]:[border-left:1px_solid_#e6e6e6]';
export const HOOK_LABEL = 'text-small font-normal tracking-[0] normal-case text-muted';
export const HOOK_VALUE = 'mt-[0.2rem] text-small font-medium text-ink min-[769px]:text-h3 min-[769px]:whitespace-nowrap';
// Hero detail leaf (migrasi Fase 2): desc + CTA -> utilities. Struktur hero
// (.tour-hero/.tour-hero__body/.tour-hero__image + override .subhero__title,
// anchor .tour-hero + .tour-layout--book, scope .tourprog) TETEP CSS. CTA di-hide
// di HP via max-[768px]:hidden (match @media max-width:768px persis).
export const HERO_DESC = 'max-w-[460px] m-0 text-[#3d3d3d]';
// `tour-hero__cta` DIPERTAHANKAN sbg marker: di-query JS di BookBar.jsx
// (IntersectionObserver buat munculin sticky book-bar).
export const HERO_CTA = 'tour-hero__cta inline-block mt-[1.6rem] py-[0.8rem] px-8 rounded-pill bg-cta text-white font-semibold no-underline [transition:background-color_var(--dur)_ease] hover:bg-cta-d [@media(max-width:768px)]:hidden';

function Stop({ s }) {
  const inner = (
    <>
      {s.img ? (
        <div className="stop__image">
          <Img src={`/assets/images/${s.img}`} alt={s.alt} width={s.w} height={s.hgt} />
        </div>
      ) : s.gradient ? (
        <div className="stop__image" style={{ backgroundImage: s.gradient.replace(/^background-image:\s*/, '').replace(/;$/, '') }} />
      ) : null}
      <div>
        {s.num && <span className={STOP_NUM}>{s.num}</span>}
        <h3 className={STOP_NAME}>{s.name}</h3>
        <p className={STOP_DESC} dangerouslySetInnerHTML={{ __html: s.highlight }} />
      </div>
    </>
  );
  // Link stop = detail page. refId (referensi destination/experience) diturunkan jadi
  // /attractions/<refId>.html (URL tetep, nol perubahan SEO); fallback s.link buat item
  // non-attraction lama. name/img/highlight tetep tour-specific.
  const href = s.refId ? `/attractions/${s.refId}.html` : s.link;
  return href ? (
    <a className={STOP_LINK} href={href}>{inner}</a>
  ) : (
    <article className="stop">{inner}</article>
  );
}

export default function TourPage({ data }) {
  return (
    <>
      <JsonLd page={data.__page} />
      {/* "tour-hero"/"tour-hero__image"/"tour-hero__body" kept as inert marker
          classNames (own styling below is Tailwind utilities) - needed by rules
          left untouched in style.css: `.tour-hero + .tour-layout--book` (sibling
          selector), `.tourprog .tour-hero__image::after` (ListingPage-only mobile
          gradient), and `.tour-hero__body .subhero__title` (margin-bottom on the
          shared H1 tier, out of scope). */}
      <section className="tour-hero min-[769px]:grid min-[769px]:grid-cols-[45%_55%] min-[769px]:items-stretch min-[769px]:min-h-[62vh] min-[769px]:pt-[6.5rem]">
        {data.heroSlides && data.heroSlides.length > 1 ? (
          <HeroSlider slides={data.heroSlides} />
        ) : (
          <div
            className="tour-hero__image min-h-[48vh] bg-green bg-cover bg-center min-[769px]:order-1 min-[769px]:min-h-0"
            style={{ backgroundImage: `url(/assets/images/${data.heroBg})` }}
          />
        )}
        <div className="tour-hero__body relative z-[1] -mt-7 pt-9 px-6 pb-3 bg-white rounded-t-[var(--r-xl)] flex flex-col items-center text-center
          min-[769px]:mt-0 min-[769px]:pt-12 min-[769px]:pr-12 min-[769px]:pb-12 min-[769px]:pl-[max(1.5rem,calc((100vw-1280px)/2))]
          min-[769px]:bg-transparent min-[769px]:rounded-none min-[769px]:justify-center min-[769px]:items-start min-[769px]:text-left">
          <h1 className="subhero__title">{data.title}</h1>
          <p className={HERO_DESC}>{data.desc}</p>
          <ul className={HOOK_UL}>
            {data.hooks.map((h) => (
              <li key={h.label}>
                <span className={HOOK_LABEL}>{h.label}</span>
                <span className={HOOK_VALUE}>{h.value}</span>
              </li>
            ))}
          </ul>
          <a href={data.ctaHref} className={HERO_CTA}>{data.cta}</a>
        </div>
      </section>

      <div className={data.bookItem ? 'tour-layout tour-layout--book' : undefined}>
      <div className={data.bookItem ? 'tour-layout__main' : undefined}>
      <DetailTabs
        overview={(
          <div className="stops" id={data.stopsId}>
            {data.items.map((it, i) =>
              it.type === 'sub' ? (
                <h3 className="section__title section__title--sub" key={i}>{it.text}</h3>
              ) : (
                <Stop s={it} key={i} />
              ),
            )}
          </div>
        )}
        priceItem={data.bookItem}
        included={data.included}
        excluded={data.excluded}
        reviewService={data.title}
      />
      </div>
      {data.bookItem && (
        <div className="tour-layout__side">
          <BookSidebar item={data.bookItem} facts={data.facts} />
        </div>
      )}
      </div>
      <BookCta item={data.bookItem} />
      <BookBar item={data.bookItem} />
      <Related href={data.__href} />
      {data.bookItem && <ReviewCtaBand />}

      {data.bookItem && (
        <div id="book-modal-placeholder" data-default={data.bookDefault} data-item={data.bookItem} />
      )}

      {data.crumb && (
        <nav className={CRUMB_NAV} aria-label="Breadcrumb">
          {data.crumb.map((p, i) =>
            p.type === 'link' ? (
              <a className={CRUMB_LINK} href={p.href} key={i}>{p.text}</a>
            ) : p.type === 'sep' ? (
              <span className={CRUMB_SEP} key={i}>{p.text}</span>
            ) : (
              <span key={i}>{p.text}</span>
            ),
          )}
        </nav>
      )}
    </>
  );
}
