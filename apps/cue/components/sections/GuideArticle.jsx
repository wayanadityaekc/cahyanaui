import JsonLd from '@/components/JsonLd';
import GuideMore from '@/components/sections/GuideMore';
import Prose from '@/components/prose/Prose';

// Tailwind-native (migrasi Fase 2): tab kategori sticky HP. Base hidden (desktop
// pakai sidebar), muncul jadi bar sticky di <=992px. [@media(max-width:992px)]
// dipakai biar match @media (max-width:992px) persis (inklusif 992).
const CATTABS =
  'hidden [@media(max-width:992px)]:flex [@media(max-width:992px)]:gap-[1.6rem] [@media(max-width:992px)]:overflow-x-auto [@media(max-width:992px)]:[scrollbar-width:none] [@media(max-width:992px)]:[&::-webkit-scrollbar]:hidden [@media(max-width:992px)]:sticky [@media(max-width:992px)]:top-[var(--header-h,52.8px)] [@media(max-width:992px)]:z-20 [@media(max-width:992px)]:bg-white [@media(max-width:992px)]:[border-bottom:1px_solid_var(--line)] [@media(max-width:992px)]:py-[0.7rem] [@media(max-width:992px)]:px-[1.3rem] [@media(max-width:992px)]:[margin:0_-1.3rem_1.5rem]';
const cattab = (active) =>
  `flex-[0_0_auto] font-body text-small bg-transparent border-none py-[0.4rem] px-[0.15rem] whitespace-nowrap no-underline [transition:color_var(--dur-fast)_ease,border-color_var(--dur-fast)_ease] ${active ? 'font-semibold text-green [border-bottom:2px_solid_var(--color-gold)]' : 'font-medium text-muted [border-bottom:2px_solid_transparent] hover:text-green'}`;

// Guide chrome (migrasi TW-B3 #336): hero tags, article+sidebar layout, category
// sidebar (desktop). Sidebar di-derive dari data.tabs (item + is-active identik) -
// dulu raw HTML string `sideHtml` per halaman.
const HERO_TAGS = 'flex gap-2 justify-center flex-wrap mt-[0.6rem]';
const HERO_TAG =
  'inline-block py-[0.3rem] px-[0.8rem] rounded-pill text-label font-medium tracking-[0.08em] uppercase bg-[rgba(255,255,255,0.16)] text-white [border:1px_solid_rgba(255,255,255,0.35)]';
const LAYOUT = 'max-w-[var(--container)] mx-auto py-[var(--space-5)] px-[var(--container-x)] flex items-start gap-10 [@media(max-width:992px)]:flex-col';
const LAYOUT_MAIN = 'flex-[1_1_auto] min-w-0';
const LAYOUT_SIDE = 'flex-[0_0_260px] sticky top-[6.5rem] [@media(max-width:992px)]:hidden';
const SIDEBAR = '[border:1px_solid_var(--line)] rounded-lg py-[1.2rem] px-[1.1rem] bg-white';
const SIDEBAR_TITLE = 'font-body font-semibold text-h3 text-green mb-[0.8rem]';
const SIDEBAR_LIST = 'list-none [&_li+li]:mt-[0.35rem]';
const sidebarLink = (active) =>
  `block py-2 px-[0.6rem] rounded-sm no-underline text-small ${active ? 'bg-cream text-amber font-semibold' : 'text-green font-medium'}`;

export default function GuideArticle({ data }) {
  return (
    <div className="guide-article-page">
      <JsonLd page={data.__page} />
      <section className="lhero" style={{ backgroundImage: data.heroStyle.replace(/^background-image:\s*/, '').replace(/;$/, '') }}>
        <div className="lhero__inner">
          <h1 className="lhero__title">{data.title}</h1>
          <p className="lhero__sub">{data.sub}</p>
          <div className={HERO_TAGS}>
            {data.tags.map((t) => <span className={HERO_TAG} key={t}>{t}</span>)}
          </div>
        </div>
      </section>

      <nav className={CATTABS}>
        {data.tabs.map((t) => (
          <a className={cattab(t.active)} href={t.href} key={t.href}>{t.label}</a>
        ))}
      </nav>

      <div className={LAYOUT}>
        <div className={LAYOUT_MAIN}>
          <section className="info">
            <div className="info__container guide-article">
              <Prose blocks={data.body} />
            </div>
          </section>
        </div>
        {/* wrapper div preserves pre-migration DOM (sideHtml was injected via a
            wrapping <div dangerouslySetInnerHTML>) so element count / layout = 0-diff */}
        <div>
          <aside className={LAYOUT_SIDE}>
            <div className={SIDEBAR}>
              <p className={SIDEBAR_TITLE}>Categories</p>
              <ul className={SIDEBAR_LIST}>
                {data.tabs.map((t) => (
                  <li key={t.href}><a className={sidebarLink(t.active)} href={t.href}>{t.label}</a></li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>

      {data.more.map((m, i) => (
        m.kind
          ? <GuideMore block={m} key={i} />
          : <section className={m.cls} key={i} dangerouslySetInnerHTML={{ __html: m.html }} />
      ))}
    </div>
  );
}
