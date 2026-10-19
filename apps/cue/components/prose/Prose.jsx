import { SECTION_TITLE, SECTION_TITLE_SUB, ST_LEFT } from '@/components/ui/sectionTitle';
import { pickInfoList, PROSE_LINK } from '@/components/ui/infoClasses';
import InfoBoxes, { InfoBox, InfoBoxList } from '@/components/ui/InfoBoxes';
import InfoFacts from '@/components/ui/InfoFacts';
import { unlinkHiddenTours } from '@/lib/routes';
import Breadcrumb from '@/components/ui/Breadcrumb';

const BODY_P = 'm-0 mb-4 text-body leading-[var(--lh-body)] text-ink';

const SUB_VARIANT = {
  legal: SECTION_TITLE_SUB,
  guide: `${SECTION_TITLE_SUB} ${ST_LEFT}`,
  company: `${SECTION_TITLE_SUB} !text-left`,
};

function Box({ box }) {
  return (
    <InfoBox title={box.title} variant={box.variant}>
      {(box.paras || []).map((html, paragraphIndex) => (
        <p key={paragraphIndex} dangerouslySetInnerHTML={{ __html: unlinkHiddenTours(html) }} />
      ))}
      {box.list && (
        <InfoBoxList
          items={box.list}
          variant={box.variant}
          render={(item) => <span dangerouslySetInnerHTML={{ __html: unlinkHiddenTours(item) }} />}
        />
      )}
    </InfoBox>
  );
}

export default function Prose({ blocks, headingVariant = 'legal' }) {
  return blocks.map((block, index) => {
    const afterBoxes = index > 0 && blocks[index - 1] && blocks[index - 1].type === 'boxes';
    if (block.type === 'crumb') {
      return <Breadcrumb items={block.items} className="mb-2" key={index} />;
    }
    if (block.type === 'heading') {
      return block.sub === false ? (
        <h2 className={SECTION_TITLE} key={index} dangerouslySetInnerHTML={{ __html: unlinkHiddenTours(block.html) }} />
      ) : (
        <h2
          className={`${SUB_VARIANT[headingVariant] || SUB_VARIANT.legal}${afterBoxes ? ' !mt-0' : ''}`}
          key={index}
          dangerouslySetInnerHTML={{ __html: unlinkHiddenTours(block.html) }}
        />
      );
    }
    if (block.type === 'para') {
      return (
        <p
          className={`${BODY_P} ${PROSE_LINK}`}
          key={index}
          dangerouslySetInnerHTML={{ __html: unlinkHiddenTours(block.html) }}
        />
      );
    }
    if (block.type === 'list') {
      return (
        <ul className={`${pickInfoList(block.variant)} ${PROSE_LINK}`} key={index}>
          {block.items.map((item, indexItem) => (
            <li key={indexItem} dangerouslySetInnerHTML={{ __html: unlinkHiddenTours(item) }} />
          ))}
        </ul>
      );
    }
    if (block.type === 'facts') {
      return <InfoFacts key={index} items={block.items} />;
    }
    if (block.type === 'boxes') {
      return (
        <InfoBoxes key={index}>
          {block.items.map((box, itemIndex) =>
            box.stack ? (
              <div className="flex flex-col gap-[var(--space-4)] max-[768px]:contents" key={itemIndex}>
                {box.stack.map((sub, stackIndex) => (
                  <div className={stackIndex === 0 ? undefined : 'max-[768px]:order-last'} key={stackIndex}>
                    <Box box={sub} />
                  </div>
                ))}
              </div>
            ) : (
              <Box box={box} key={itemIndex} />
            ),
          )}
        </InfoBoxes>
      );
    }
    if (block.type === 'back') {
      return (
        <p
          style={{ marginTop: '2rem' }}
          className={`${BODY_P} [&_a]:text-gold [&_a]:no-underline [&_a]:font-medium`}
          key={index}
          dangerouslySetInnerHTML={{ __html: unlinkHiddenTours(block.html) }}
        />
      );
    }
    return null;
  });
}
