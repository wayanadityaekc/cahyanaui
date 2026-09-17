import JsonLd from '@/components/JsonLd';
import { CARD, CARD_WRAP, STRIP, TRACK_SCROLL, segmentLink } from '@/components/ui/detailCardClasses';
import { TOUR_LAYOUT_BOOK, TOUR_LAYOUT_MAIN, TOUR_LAYOUT_SIDE } from '@/components/ui/tourLayoutClasses';
import GuideMore from '@/components/sections/GuideMore';
import Prose from '@/components/prose/Prose';
import DetailHero from '@/components/sections/DetailHero';
import { guideCard, readMinutes, guideCategory } from '@/lib/guideMeta';

// Category nav, now wearing the tour pages' pill track (Sep 2026, Wayan: "tab nya
// buat seperti tab tour"). Still phone-only and still the 5 hub categories - on
// desktop the sidebar carries them, exactly as before; only the styling changed,
// from a row of plain underlined tabs to the shared segmented control.
// [@media(max-width:992px)] (not md:) to match the sidebar's own breakpoint exactly.
const CATTABS = 'hidden [@media(max-width:992px)]:block ' + STRIP;
// Guide chrome (migrasi TW-B3 #336): article+sidebar layout, category
// sidebar (desktop). Sidebar di-derive dari data.tabs (item + is-active identik) -
// dulu raw HTML string `sideHtml` per halaman.
const SIDEBAR = '[border:1px_solid_var(--line)] rounded-lg py-[1.2rem] px-[1.1rem] bg-white';
const SIDEBAR_TITLE = 'font-body font-semibold text-h3 text-green mb-[0.8rem]';
const SIDEBAR_LIST = 'list-none [&_li+li]:mt-[0.35rem]';
const sidebarLink = (active) =>
  `block py-2 px-[0.6rem] rounded-sm no-underline text-small ${active ? 'bg-cream text-amber font-semibold' : 'text-green font-medium'}`;
// The prose keeps a readable measure inside the wide card: it starts at the card's
// left edge (so it lines up with a tour page's content) but stops well short of the
// right one. --container-read is the width CLAUDE.md pins for reading columns - a
// full 950px line at 12.8px would run ~145 characters.
const PROSE = 'max-w-[var(--container-read)]';

export default function GuideArticle({ data }) {
  const slug = (data.__page || '').replace(/^guide\//, '');
  const card = guideCard(slug) || {};
  const hooks = [
    { label: 'Category', value: guideCategory(data.tabs) },
    { label: 'Topic', value: card.tag },
    { label: 'Read', value: `~${readMinutes(data.body)} min` },
  ].filter((h) => h.value);

  return (
    <div className="guide-article-page">
      <JsonLd page={data.__page} />
      {/* Same split hero the tour and attraction pages open with (Sep 2026, Wayan:
          "ubah semua page articles, pakai layout seperti tour destination dan
          experience, biar punya ciri khasnya"). It replaces the old dark full-bleed
          banner with the centered title.

          The photo comes from this guide's HUB CARD, not from data.heroStyle: 14 of
          the 15 guides only ever had a gradient there, and the split hero needs a real
          image. The card photo is the one already representing this guide everywhere
          else on the site, so nothing is invented.

          The three facts replace the tag pills the old banner carried - category and
          topic say the same thing the pills did, and reading time is counted from the
          article's own words. */}
      <DetailHero
        heroBg={card.img}
        title={data.title}
        desc={data.sub}
        hooks={hooks}
        cta="See our tours"
        ctaHref="/tour.html"
      />

      <div className={TOUR_LAYOUT_BOOK}>
        <div className={TOUR_LAYOUT_MAIN}>
          <div className={CARD_WRAP}>
            <div className={CARD}>
              <nav className={CATTABS} aria-label="Guide categories">
                <div className={TRACK_SCROLL}>
                  {data.tabs.map((t) => (
                    <a className={segmentLink(t.active)} href={t.href} key={t.href} aria-current={t.active || undefined}>{t.label}</a>
                  ))}
                </div>
              </nav>
              <div className={PROSE}>
                <Prose blocks={data.body} headingVariant="guide" />
              </div>
            </div>
          </div>
        </div>
        <div className={TOUR_LAYOUT_SIDE}>
          <aside className="[@media(max-width:992px)]:hidden">
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
