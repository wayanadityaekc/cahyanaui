// Renders the block schema in content/schema/prose.js. Used by guide article
// bodies (TW-B1 #334) and, going forward, legal pages (TW-B2 #335).
// Every block still carries its ORIGINAL pre-migration class name - converting
// those to Tailwind utilities belongs to a later, separate issue (see
// content/schema/prose.js header). This component only moves the markup out
// of a raw HTML string into data + real elements.
import { SECTION_TITLE, SECTION_TITLE_SUB, ST_LEFT } from '@/components/ui/sectionTitle';
import { infoList } from '@/components/ui/infoClasses';
import InfoBoxes, { InfoBox, InfoBoxList } from '@/components/ui/InfoBoxes';
import InfoFacts from '@/components/ui/InfoFacts';
import { unlinkHiddenTours } from '@/lib/routes';

// headingVariant tunes the `--sub` article headings per context (the old
// `.guide-article-page` / `.company-page .guide-article` descendant overrides):
//   'legal'   (default) = centered + underline (base .section__title--sub)
//   'guide'   = left-aligned + underline shifted left
//   'company' = left-aligned + underline removed (Terms-style in Our Company)
const SUB_VARIANT = {
  legal: SECTION_TITLE_SUB,
  guide: `${SECTION_TITLE_SUB} ${ST_LEFT}`,
  company: `${SECTION_TITLE_SUB} !text-left after:!content-none`,
};

export default function Prose({ blocks, headingVariant = 'legal' }) {
  return blocks.map((b, i) => {
    switch (b.type) {
      case 'crumb':
        return <p className="text-label text-muted mb-[1.25rem] [&_a]:text-gold [&_a]:no-underline [&_a]:font-medium" key={i} dangerouslySetInnerHTML={{ __html: unlinkHiddenTours(b.html) }} />;
      case 'lead':
        return (
          <figure className="mb-6" key={i}>
            <img
              className="block w-full h-auto aspect-[4/3] object-cover rounded-lg shadow-[0_8px_24px_rgba(31,61,43,0.1)]"
              src={b.src} alt={b.alt} loading={b.loading} width={b.width} height={b.height}
            />
            <figcaption
              className="mt-2 text-[length:var(--fs-label)] italic text-center text-muted"
              dangerouslySetInnerHTML={{ __html: unlinkHiddenTours(b.caption) }}
            />
          </figure>
        );
      case 'heading':
        // Default = sub-section heading (.section__title--sub), unchanged for all
        // guide/legal callers. `sub: false` = a main section heading (plain
        // .section__title), used by the detail-page info bodies (TW-B4 #337:
        // charter/airport "How a Charter Day Works" etc.). Class kept as-is -
        // .section__title base is B-FINAL's to convert.
        return b.sub === false
          ? <h2 className={SECTION_TITLE} key={i} dangerouslySetInnerHTML={{ __html: unlinkHiddenTours(b.html) }} />
          : <h2 className={SUB_VARIANT[headingVariant] || SUB_VARIANT.legal} key={i} dangerouslySetInnerHTML={{ __html: unlinkHiddenTours(b.html) }} />;
      case 'para':
        return <p key={i} dangerouslySetInnerHTML={{ __html: unlinkHiddenTours(b.html) }} />;
      case 'list':
        return (
          <ul className={infoList(b.variant)} key={i}>
            {b.items.map((item, j) => <li key={j} dangerouslySetInnerHTML={{ __html: unlinkHiddenTours(item) }} />)}
          </ul>
        );
      case 'facts':
        // The spec strip that opens the transfer / airport details card
        // (Sep 2026). A block type rather than page markup so those two pages
        // compose their card the same way the charter page does.
        return <InfoFacts key={i} items={b.items} />;
      case 'boxes':
        // Option B boxes (Sep 2026): a row of bordered boxes instead of marker
        // lists / loose headings. Each item is { title, variant?, paras?, list? };
        // variant 'no' tints it cream. Desktop two columns, mobile stacked.
        return (
          <InfoBoxes key={i}>
            {b.items.map((box, k) => (
              <InfoBox key={k} title={box.title} variant={box.variant}>
                {(box.paras || []).map((html, p) => (
                  <p key={p} dangerouslySetInnerHTML={{ __html: unlinkHiddenTours(html) }} />
                ))}
                {box.list && (
                  <InfoBoxList
                    items={box.list}
                    variant={box.variant}
                    render={(item) => <span dangerouslySetInnerHTML={{ __html: unlinkHiddenTours(item) }} />}
                  />
                )}
              </InfoBox>
            ))}
          </InfoBoxes>
        );
      case 'back':
        // margin-top stays inline: `.guide-article p` (0,1,1) outweighs a mt-* utility
        // (0,1,0), same as the pre-migration inline style; [&_a]: replaces .guide-crumb-back.
        return <p style={{ marginTop: '2rem' }} className="[&_a]:text-gold [&_a]:no-underline [&_a]:font-medium" key={i} dangerouslySetInnerHTML={{ __html: unlinkHiddenTours(b.html) }} />;
      default:
        return null;
    }
  });
}
