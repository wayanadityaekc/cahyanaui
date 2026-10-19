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

const BOX = `${RAIL_PAGE_BOX} pt-[2.85rem] max-[560px]:pt-[2.6rem]`;

export default function GuideArticle({ data }) {
  const crumbs = guideCrumbs(data.tabs, data.title);
  const slug = (data.__page || '').replace(/^guide\//, '');
  const card = guideCard(slug) || {};
  const hooks = [
    { label: 'Category', value: guideCategory(data.tabs) },
    { label: 'Topic', value: card.tag },
    { label: 'Read', value: `~${readMinutes(data.body)} min` },
  ].filter((detail) => detail.value);

  return (
    <div className="guide-article-page">
      <JsonLd page={data.__page} crumbs={crumbs} />
      <DetailHero
        heroBg={card.img}
        title={data.heading || data.title}
        desc={data.sub}
        hooks={hooks}
        crumb={crumbs}
        cta="Our tours"
        ctaHref="/tour.html"
      />

      <div className={BOX}>
        <RailLayout
          label="Bali Guide"
          items={data.tabs.map((tab) => ({ id: tab.href, href: tab.href, label: tab.label }))}
          active={(data.tabs.find((tab) => tab.active) || data.tabs[0] || {}).href}
          frameClass={RAIL_FRAME_CARD}
          mainClass={RAIL_MAIN_CARD}
          mobileNav={<GuideCatNav tabs={data.tabs} />}
        >
          <div className={RAIL_READ}>
            <Prose blocks={data.body.filter((block) => block.type !== 'crumb')} headingVariant="guide" />
          </div>
        </RailLayout>
      </div>

      {data.more.map((moreBlock, index) =>
        moreBlock.kind ? (
          <GuideMore block={moreBlock} key={index} />
        ) : (
          <section className={moreBlock.cls} key={index} dangerouslySetInnerHTML={{ __html: moreBlock.html }} />
        ),
      )}
    </div>
  );
}
