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
        <p className={STOP_DESC} dangerouslySetInnerHTML={{ __html: s.descHtml }} />
      </div>
    </>
  );
  return s.link ? (
    <a className={STOP_LINK} href={s.link}>{inner}</a>
  ) : (
    <article className="stop">{inner}</article>
  );
}

export default function TourPage({ data }) {
  return (
    <>
      <JsonLd page={data.__page} />
      <section className="tour-hero">
        {data.heroSlides && data.heroSlides.length > 1 ? (
          <HeroSlider slides={data.heroSlides} />
        ) : (
          <div className="tour-hero__image" style={{ backgroundImage: `url(/assets/images/${data.heroBg})` }} />
        )}
        <div className="tour-hero__body">
          <h1 className="subhero__title">{data.title}</h1>
          <p className="tour-hero__desc">{data.desc}</p>
          <ul className="tour-hook">
            {data.hooks.map((h) => (
              <li key={h.label}>
                <span className="tour-hook__label">{h.label}</span>
                <span className="tour-hook__value">{h.value}</span>
              </li>
            ))}
          </ul>
          <a href={data.ctaHref} className="tour-hero__cta">{data.cta}</a>
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
        <nav className="crumb" aria-label="Breadcrumb">
          {data.crumb.map((p, i) =>
            p.type === 'link' ? (
              <a href={p.href} key={i}>{p.text}</a>
            ) : p.type === 'sep' ? (
              <span className="crumb__sep" key={i}>{p.text}</span>
            ) : (
              <span key={i}>{p.text}</span>
            ),
          )}
        </nav>
      )}
    </>
  );
}
