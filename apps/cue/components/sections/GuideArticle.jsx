import JsonLd from '@/components/JsonLd';
import { CARD, CARD_WRAP } from '@/components/ui/detailCardClasses';
import GuideCatNav from '@/components/sections/GuideCatNav';
import { TOUR_LAYOUT_BOOK, TOUR_LAYOUT_MAIN, TOUR_LAYOUT_SIDE } from '@/components/ui/tourLayoutClasses';
import GuideMore from '@/components/sections/GuideMore';
import Prose from '@/components/prose/Prose';
import DetailHero from '@/components/sections/DetailHero';
import { guideCard, readMinutes, guideCategory } from '@/lib/guideMeta';

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
        cta="Our tours"
        ctaHref="/tour.html"
      />

      <div className={TOUR_LAYOUT_BOOK}>
        <div className={TOUR_LAYOUT_MAIN}>
          <div className={CARD_WRAP}>
            <div className={CARD}>
              <GuideCatNav tabs={data.tabs} variant="mobile" />
              <div className={PROSE}>
                <Prose blocks={data.body} headingVariant="guide" />
              </div>
            </div>
          </div>
        </div>
        <div className={TOUR_LAYOUT_SIDE}>
          <GuideCatNav tabs={data.tabs} variant="desktop" />
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
