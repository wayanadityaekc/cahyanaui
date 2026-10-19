import { SECTION_TITLE, SECTION_TITLE_SUB, ST_LEFT } from '@/components/ui/sectionTitle';
import { pickInfoListClasses } from '@/components/ui/infoClasses';
import InfoBoxes, { InfoBox, InfoBoxList } from '@/components/ui/InfoBoxes';
import LoadFallback from '@/components/ui/LoadFallback';

const SUB_VARIANT = {
  legal: SECTION_TITLE_SUB,
  guide: `${SECTION_TITLE_SUB} ${ST_LEFT}`,
  company: `${SECTION_TITLE_SUB} ${ST_LEFT}`,
};

export default function Prose({ blocks = [], headingVariant = 'legal' }) {
  if (!blocks.length) return <LoadFallback />;
  return blocks.map((block, index) => {
    if (block.type === 'crumb') {
      return (
        <p
          className="text-label text-muted mb-[1.25rem] [&_a]:text-gold [&_a]:no-underline [&_a]:font-medium"
          key={index}
          dangerouslySetInnerHTML={{ __html: String(block.html) }}
        />
      );
    }
    if (block.type === 'lead') {
      return (
        <figure className="mb-6" key={index}>
          <img
            className="block w-full h-auto aspect-[4/3] object-cover"
            src={block.src}
            alt={block.alt}
            loading={block.loading}
            width={block.width}
            height={block.height}
          />
          <figcaption
            className="mt-2 text-[length:var(--fs-label)] italic text-center text-muted"
            dangerouslySetInnerHTML={{ __html: String(block.caption) }}
          />
        </figure>
      );
    }
    if (block.type === 'heading') {
      return block.sub === false ? (
        <h2 className={SECTION_TITLE} key={index} dangerouslySetInnerHTML={{ __html: String(block.html) }} />
      ) : (
        <h2
          className={SUB_VARIANT[headingVariant] || SUB_VARIANT.legal}
          key={index}
          dangerouslySetInnerHTML={{ __html: String(block.html) }}
        />
      );
    }
    if (block.type === 'para') {
      return <p key={index} dangerouslySetInnerHTML={{ __html: String(block.html) }} />;
    }
    if (block.type === 'list') {
      return (
        <ul className={pickInfoListClasses(block.variant)} key={index}>
          {block.items.map((item, indexItem) => (
            <li key={indexItem} dangerouslySetInnerHTML={{ __html: String(item) }} />
          ))}
        </ul>
      );
    }
    if (block.type === 'boxes') {
      return (
        <InfoBoxes key={index}>
          {block.items.map((box, boxIndex) => (
            <InfoBox key={boxIndex} title={box.title} variant={box.variant}>
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
      return (
        <p
          style={{ marginTop: '2rem' }}
          className="[&_a]:text-gold [&_a]:no-underline [&_a]:font-medium"
          key={index}
          dangerouslySetInnerHTML={{ __html: String(block.html) }}
        />
      );
    }
    return null;
  });
}
