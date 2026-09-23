import JsonLd from '@/components/JsonLd';
import GuideCatNav from '@/components/sections/GuideCatNav';
import RailLayout from '@/components/ui/RailLayout';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { guideCrumbs } from '@/lib/crumbs';
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
  // One trail, rendered on screen AND emitted as JSON-LD.
  const crumbs = guideCrumbs(data.tabs, data.title);
  const slug = (data.__page || '').replace(/^guide\//, '');
  const card = guideCard(slug) || {};
  const hooks = [
    { label: 'Category', value: guideCategory(data.tabs) },
    { label: 'Topic', value: card.tag },
    { label: 'Read', value: `~${readMinutes(data.body)} min` },
  ].filter((h) => h.value);

  return (
    <div className="guide-article-page">
      <JsonLd page={data.__page} crumbs={crumbs} />
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
        title={data.heading || data.title}
        desc={data.sub}
        hooks={hooks}
        crumb={crumbs}
        cta="Our tours"
        ctaHref="/tour.html"
      />

      {/* The SAME component Our Company and My Trips render: category rail on the
          left, content on the right, one page box around it. The categories go in
          as link items, so the rows are the rail's rows rather than a second copy
          of them. Below 993px the rail hides itself, the frame stays the white
          card this page always had, and the phone control is the dropdown - so
          the rail is desktop-only, as asked. */}
      <div className={BOX}>
        <RailLayout
          label="Bali Guide"
          items={data.tabs.map((t) => ({ id: t.href, href: t.href, label: t.label }))}
          active={(data.tabs.find((t) => t.active) || data.tabs[0] || {}).href}
          frameClass={RAIL_FRAME_CARD}
          mainClass={RAIL_MAIN_CARD}
          mobileNav={<GuideCatNav tabs={data.tabs} />}
        >
          <div className={RAIL_READ}>
            <Prose blocks={data.body.filter((b) => b.type !== 'crumb')} headingVariant="guide" />
          </div>
        </RailLayout>
      </div>

      {data.more.map((m, i) => (
        m.kind
          ? <GuideMore block={m} key={i} />
          : <section className={m.cls} key={i} dangerouslySetInnerHTML={{ __html: m.html }} />
      ))}
    </div>
  );
}
