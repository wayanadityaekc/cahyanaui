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

// Gap under the hero; keep the 560px step or the first line shifts on phones.
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
      {/* Split hero shared with tour/attraction pages; photo comes from the guide's hub card, not heroStyle. */}
      <DetailHero
        heroBg={card.img}
        title={data.heading || data.title}
        desc={data.sub}
        hooks={hooks}
        crumb={crumbs}
        cta="Our tours"
        ctaHref="/tour.html"
      />

      {/* Same RailLayout as Our Company/My Trips; categories are link items, desktop-only rail, phones get the dropdown. */}
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
