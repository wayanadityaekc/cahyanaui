import { SECTION_TITLE, SECTION_TITLE_SUB, ST_LEFT } from '@/components/ui/sectionTitle';
import { infoList } from '@/components/ui/infoClasses';
import InfoBoxes, { InfoBox, InfoBoxList } from '@/components/ui/InfoBoxes';

// Heading style per context: 'legal' (default) centered, 'guide' and 'company' left-aligned.
const SUB_VARIANT = {
  legal: SECTION_TITLE_SUB,
  guide: `${SECTION_TITLE_SUB} ${ST_LEFT}`,
  // 'company' used to also switch off the underline; with no underline left it is just the left variant.
  company: `${SECTION_TITLE_SUB} ${ST_LEFT}`,
};

// Port of CUE's Prose: renders the article/legal block schema as real elements (unlinkHiddenTours dropped).
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
      // Default is a sub-section heading; `sub: false` gives a main section heading for detail-page info bodies.
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
      // Row of bordered boxes; item = { title, variant?, paras?, list? }, variant 'no' tints cream.
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
      // margin-top stays inline: `.guide-article p` (0,1,1) would beat an mt-* utility (0,1,0).
      return <p style={{ marginTop: '2rem' }} className="[&_a]:text-gold [&_a]:no-underline [&_a]:font-medium" key={i} dangerouslySetInnerHTML={{ __html: String(block.html) }} />;
    }
    return null;
  });
}
