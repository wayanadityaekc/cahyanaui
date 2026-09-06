import Img from '@/components/ui/Img';
import JsonLd from '@/components/JsonLd';
import BookCta from '@/components/booking/BookCta';
import BookSidebar from '@/components/booking/BookSidebar';
import BookBar from '@/components/booking/BookBar';
import HeroSlider from '@/components/sections/HeroSlider';
import Related from '@/components/sections/Related';
import ReviewCtaBand from '@/components/reviews/ReviewCtaBand';
import DetailTabs from '@/components/sections/DetailTabs';
import { BookModeProvider } from '@/state/BookModeProvider';

export default function AttractionPage({ data }) {
  return (
    <BookModeProvider>
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
            {data.stops.map((s, i) => (
              <article className="stop" key={i}>
                {s.img && (
                  <div className="stop__image">
                    <Img src={`/assets/images/${s.img}`} alt={s.alt} width={s.w} height={s.hgt} />
                  </div>
                )}
                <div className="stop__body">
                  {s.num && <span className="stop__num">{s.num}</span>}
                  <h3 className="stop__name">{s.name}</h3>
                  <p className="stop__desc" dangerouslySetInnerHTML={{ __html: s.descHtml }} />
                </div>
              </article>
            ))}
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
    </BookModeProvider>
  );
}
