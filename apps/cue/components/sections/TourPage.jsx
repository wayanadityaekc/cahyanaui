import Img from '@/components/ui/Img';
import JsonLd from '@/components/JsonLd';
import BookCta from '@/components/booking/BookCta';
import BookSidebar from '@/components/booking/BookSidebar';
import BookBar from '@/components/booking/BookBar';
import HeroSlider from '@/components/sections/HeroSlider';
import Related from '@/components/sections/Related';
import ReviewCtaBand from '@/components/reviews/ReviewCtaBand';
import DetailTabs from '@/components/sections/DetailTabs';

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
      <div className="stop__body">
        {s.num && <span className="stop__num">{s.num}</span>}
        <h3 className="stop__name">{s.name}</h3>
        <p className="stop__desc" dangerouslySetInnerHTML={{ __html: s.descHtml }} />
      </div>
    </>
  );
  return s.link ? (
    <a className="stop stop--link" href={s.link}>{inner}</a>
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
        facts={data.facts}
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
