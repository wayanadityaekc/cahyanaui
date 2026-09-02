import Img from '@/components/ui/Img';
import JsonLd from '@/components/JsonLd';
import BookCta from '@/components/booking/BookCta';

export default function AttractionPage({ data }) {
  return (
    <>
      <JsonLd page={data.__page} />
      <section className="tour-hero">
        <div className="tour-hero__image" style={{ backgroundImage: `url(/assets/images/${data.heroBg})` }} />
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

      <section className="stops" id={data.stopsId}>
        <h2 className="section__title">{data.stopsTitle}</h2>
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
      </section>

      <section className="info" dangerouslySetInnerHTML={{ __html: data.infoHtml }} />
      <BookCta item={data.bookItem} />

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
