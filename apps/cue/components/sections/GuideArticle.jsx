import JsonLd from '@/components/JsonLd';
import GuideMore from '@/components/sections/GuideMore';

// Tailwind-native (migrasi Fase 2): tab kategori sticky HP. Base hidden (desktop
// pakai sidebar), muncul jadi bar sticky di <=992px. [@media(max-width:992px)]
// dipakai biar match @media (max-width:992px) persis (inklusif 992).
const CATTABS =
  'hidden [@media(max-width:992px)]:flex [@media(max-width:992px)]:gap-[1.6rem] [@media(max-width:992px)]:overflow-x-auto [@media(max-width:992px)]:[scrollbar-width:none] [@media(max-width:992px)]:[&::-webkit-scrollbar]:hidden [@media(max-width:992px)]:sticky [@media(max-width:992px)]:top-[var(--header-h,52.8px)] [@media(max-width:992px)]:z-20 [@media(max-width:992px)]:bg-white [@media(max-width:992px)]:[border-bottom:1px_solid_var(--line)] [@media(max-width:992px)]:py-[0.7rem] [@media(max-width:992px)]:px-[1.3rem] [@media(max-width:992px)]:[margin:0_-1.3rem_1.5rem]';
const cattab = (active) =>
  `flex-[0_0_auto] font-body text-small bg-transparent border-none py-[0.4rem] px-[0.15rem] whitespace-nowrap no-underline [transition:color_var(--dur-fast)_ease,border-color_var(--dur-fast)_ease] ${active ? 'font-semibold text-green [border-bottom:2px_solid_var(--color-gold)]' : 'font-medium text-muted [border-bottom:2px_solid_transparent] hover:text-green'}`;

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

      <nav className={CATTABS}>
        {data.tabs.map((t) => (
          <a className={cattab(t.active)} href={t.href} key={t.href}>{t.label}</a>
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
        m.kind
          ? <GuideMore block={m} key={i} />
          : <section className={m.cls} key={i} dangerouslySetInnerHTML={{ __html: m.html }} />
      ))}
    </div>
  );
}
