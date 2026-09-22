import JsonLd from '@/components/JsonLd';
import GuideCatNav from '@/components/sections/GuideCatNav';
import { RAIL_PAGE_BOX, RAIL_FRAME_CARD, RAIL_MAIN_CARD, RAIL_READ } from '@/components/ui/railClasses';
import GuideMore from '@/components/sections/GuideMore';
import Prose from '@/components/prose/Prose';
import DetailHero from '@/components/sections/DetailHero';
import { guideCard, readMinutes, guideCategory } from '@/lib/guideMeta';

// The gap under the hero is the number it always was, at every width: the old
// layout paid 1.6rem of padding plus the card wrapper's margin, and that margin
// was 1.25rem normally but 1rem under 560px. Measured: dropping the 560px step
// pushed the first line down 4px on a phone.
const BOX = `${RAIL_PAGE_BOX} pt-[2.85rem] max-[560px]:pt-[2.6rem]`;

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

      {/* The rail shell Our Company and My Trips use: category rail on the left,
          article on the right. Below 993px the rail hides itself and the frame is
          the same white card the page always had - the rail is desktop-only. */}
      <div className={BOX}>
        <div className={RAIL_FRAME_CARD}>
          <GuideCatNav tabs={data.tabs} variant="desktop" />
          <main className={RAIL_MAIN_CARD}>
            <GuideCatNav tabs={data.tabs} variant="mobile" />
            <div className={RAIL_READ}>
              <Prose blocks={data.body} headingVariant="guide" />
            </div>
          </main>
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
