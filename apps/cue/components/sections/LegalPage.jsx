export default function LegalPage({ data }) {
  return (
    <>
      <section
        className={data.heroClass}
        style={{ backgroundImage: data.heroStyle.replace(/^background-image:\s*/, '').replace(/;$/, '') }}
      >
        <div className="subhero__content">
          <h1 className="subhero__title">{data.title}</h1>
          <p className="subhero__text">{data.text}</p>
        </div>
      </section>
      <section className="info">
        <div
          className="info__container guide-article"
          dangerouslySetInnerHTML={{ __html: data.bodyHtml }}
        />
      </section>
    </>
  );
}
