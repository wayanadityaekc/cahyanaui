import JsonLd from '@/components/JsonLd';
export default function GuideArticle({ data }) {
  return (
    <div className="guide-article-page">
      <JsonLd page={data.__page} />
      <section className="lhero" style={{ backgroundImage: data.heroStyle.replace(/^background-image:\s*/, '').replace(/;$/, '') }}>
        <div className="lhero__inner">
          <h1 className="lhero__title">{data.title}</h1>
          <p className="lhero__sub">{data.sub}</p>
          <div className="guide-hero-tags">
            {data.tags.map((t) => <span className="guide-tag" key={t}>{t}</span>)}
          </div>
        </div>
      </section>

      <nav className="guide-cattabs">
        {data.tabs.map((t) => (
          <a className={`guide-cattab${t.active ? ' is-active' : ''}`} href={t.href} key={t.href}>{t.label}</a>
        ))}
      </nav>

      <div className="guide-layout">
        <div className="guide-layout__main">
          <section className="info">
            <div className="info__container guide-article" dangerouslySetInnerHTML={{ __html: data.articleHtml }} />
          </section>
        </div>
        {data.sideHtml && <div dangerouslySetInnerHTML={{ __html: data.sideHtml }} />}
      </div>

      {data.more.map((m, i) => (
        <section className={m.cls} key={i} dangerouslySetInnerHTML={{ __html: m.html }} />
      ))}
    </div>
  );
}
