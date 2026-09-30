// CUE's Prose (components/prose/Prose.jsx there), block for block. The only
// thing dropped is unlinkHiddenTours, which resolves CUE's own hidden tour
// routes and has no meaning on this site.
//
// Renders the block schema used by article bodies and the Our Company legal/FAQ
// bodies (TW-B1 #334) and, going forward, legal pages (TW-B2 #335).
// Every block still carries its ORIGINAL pre-migration class name - converting
// those to Tailwind utilities belongs to a later, separate issue (see
// content/schema/prose.js header). This component only moves the markup out
// of a raw HTML string into data + real elements.
import { SECTION_TITLE, SECTION_TITLE_SUB, ST_LEFT } from '@/components/ui/sectionTitle';
import { infoList } from '@/components/ui/infoClasses';
import InfoBoxes, { InfoBox, InfoBoxList } from '@/components/ui/InfoBoxes';

// headingVariant tunes the `--sub` article headings per context (the old
// `.guide-article-page` / `.company-page .guide-article` descendant overrides):
//   'legal'   (default) = centered (base .section__title--sub)
//   'guide'   = left-aligned
//   'company' = left-aligned (Terms-style in Our Company)
const SUB_VARIANT = {
  legal: SECTION_TITLE_SUB,
  guide: `${SECTION_TITLE_SUB} ${ST_LEFT}`,
  // 'company' used to also switch the underline off; there is no underline
  // to switch off any more, so it is simply the left-aligned variant.
  company: `${SECTION_TITLE_SUB} ${ST_LEFT}`,
};

export default function Prose({ blocks, headingVariant = 'legal' }) {
  return blocks.map((block, i) => {
    if (block.type === 'crumb') {
      return <p className="text-label text-muted mb-[1.25rem] [&_a]:text-gold [&_a]:no-underline [&_a]:font-medium" key={i} dangerouslySetInnerHTML={{ __html: String(block.html) }} />;
    }
    if (block.type === 'lead') {
      return (
        <figure className="mb-6" key={i}>
          <img
            className="block w-full h-auto aspect-[4/3] object-cover"
            src={block.src} alt={block.alt} loading={block.loading} width={block.width} height={block.height}
          />
          <figcaption
            className="mt-2 text-[length:var(--fs-label)] italic text-center text-muted"
            dangerouslySetInnerHTML={{ __html: String(block.caption) }}
          />
        </figure>
      );
    }
    if (block.type === 'heading') {
      // Default = sub-section heading (.section__title--sub), unchanged for all
      // guide/legal callers. `sub: false` = a main section heading (plain
      // .section__title), used by the detail-page info bodies (TW-B4 #337:
      // charter/airport "How a Charter Day Works" etc.). Class kept as-is -
      // .section__title base is B-FINAL's to convert.
      return block.sub === false
        ? <h2 className={SECTION_TITLE} key={i} dangerouslySetInnerHTML={{ __html: String(block.html) }} />
        : <h2 className={SUB_VARIANT[headingVariant] || SUB_VARIANT.legal} key={i} dangerouslySetInnerHTML={{ __html: String(block.html) }} />;
    }
    if (block.type === 'para') {
      return <p key={i} dangerouslySetInnerHTML={{ __html: String(block.html) }} />;
    }
    if (block.type === 'list') {
      return (
        <ul className={infoList(block.variant)} key={i}>
          {block.items.map((item, j) => <li key={j} dangerouslySetInnerHTML={{ __html: String(item) }} />)}
        </ul>
      );
    }
    if (block.type === 'boxes') {
      // Option B boxes (Sep 2026): a row of bordered boxes instead of marker
      // lists / loose headings. Each item is { title, variant?, paras?, list? };
      // variant 'no' tints it cream. Desktop two columns, mobile stacked.
      return (
        <InfoBoxes key={i}>
          {block.items.map((box, k) => (
            <InfoBox key={k} title={box.title} variant={box.variant}>
              {(box.paras || []).map((html, paraIndex) => (
                <p key={paraIndex} dangerouslySetInnerHTML={{ __html: String(html) }} />
              ))}
              {box.list && (
                <InfoBoxList
                  items={box.list}
                  variant={box.variant}
                  render={(item) => <span dangerouslySetInnerHTML={{ __html: String(item) }} />}
                />
              )}
            </InfoBox>
          ))}
        </InfoBoxes>
      );
    }
    if (block.type === 'back') {
      // margin-top stays inline: `.guide-article p` (0,1,1) outweighs a mt-* utility
      // (0,1,0), same as the pre-migration inline style; [&_a]: replaces .guide-crumb-back.
      return <p style={{ marginTop: '2rem' }} className="[&_a]:text-gold [&_a]:no-underline [&_a]:font-medium" key={i} dangerouslySetInnerHTML={{ __html: String(block.html) }} />;
    }
    return null;
  });
}
