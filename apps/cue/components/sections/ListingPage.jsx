import ListingRow from '@/components/cards/ListingRow';
import Price from '@/components/Price';
import ZoneTabs from '@/components/ui/ZoneTabs';

export default function ListingPage({ data }) {
  const { heroBg, title, sub, lbox, listTitle, sectionId, chipLabel, chips, cats, closing, info } = data;

  return (
    <div className="tourprog">
      <section className="lhero" style={{ backgroundImage: `url(/assets/images/${heroBg})` }}>
        <div className="lhero__inner">
          <h1 className="lhero__title">{title}</h1>
          <p className="lhero__sub">{sub}</p>

          {lbox && (
            <div className="lbox">
              <div className="lbox__img" style={{ backgroundImage: `url(/assets/images/${lbox.img})` }}>
                <span className="lbox__tag">{lbox.tag}</span>
              </div>
              <div className="lbox__body">
                <h2 className="lbox__title">{lbox.title}</h2>
                <p className="lbox__desc">{lbox.desc}</p>
                <div className="lbox__facts">
                  {lbox.facts.map((f) => (
                    <div className="lbox__fact" key={f.label}>
                      <span>{f.label}</span>
                      {f.priceName ? (
                        <Price name={f.priceName} fallback={f.value} className="price" as="strong" />
                      ) : (
                        <strong>{f.value}</strong>
                      )}
                    </div>
                  ))}
                </div>
                <div className="lbox__actions">
                  <a href={lbox.go.href} className="lbox__btn lbox__btn--go">{lbox.go.text}</a>
                  {lbox.add && lbox.add.item && (
                    <button type="button" className="lbox__btn lbox__btn--add" data-add-item={lbox.add.item}>
                      {lbox.add.text}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="experience experience--alt" id={sectionId}>
        <div className="lhead">
          <h2 className="section__title">{listTitle}</h2>
          <ZoneTabs zones={chips} label={chipLabel} />
        </div>

        {cats.map((cat) => (
          <section className="catsec" id={cat.id} key={cat.id}>
            <h2 className="catsec__title">{cat.title}</h2>
            <div className="lrow-list">
              {cat.cards.map((c) => (
                <ListingRow key={c.href + c.name} {...c} />
              ))}
            </div>
          </section>
        ))}
      </section>

      {info && (
        <section className="info">
          <div className="info__container">
            <h2 className="section__title">{info.title}</h2>
            <div className="info__facts">
              {info.facts.map((f) => (
                <div className="info__fact" key={f.label}>
                  <span>{f.label}</span>
                  <strong>{f.value}</strong>
                </div>
              ))}
            </div>
            <div className="info__lists">
              {info.cols.map((c) => (
                <div className="info__col" key={c.title}>
                  <h3>{c.title}</h3>
                  <ul className={`info__list ${c.cls}`}>
                    {c.items.map((it, i) => <li key={i}>{it}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {closing && (
        <section className="closing-band">
          <p className="closing-band__text">{closing.text}</p>
          <div className="closing-band__actions">
            {closing.buttons.map((b) => (
              <a href={b.href} className={b.cls} key={b.href}>{b.text}</a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
