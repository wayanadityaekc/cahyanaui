import { SECTION_TITLE, SECTION_TITLE_SUB, ST_LEFT } from '@/components/ui/sectionTitle';
import { infoList, PROSE_LINK } from '@/components/ui/infoClasses';
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
  );
}

export default function Prose({ blocks, headingVariant = 'legal' }) {
  return blocks.map((b, i) => {
    const afterBoxes = i > 0 && blocks[i - 1] && blocks[i - 1].type === 'boxes';
    if (b.type === 'crumb') {
      return <Breadcrumb items={b.items} className="mb-2" key={i} />;
    }
    if (b.type === 'heading') {
      return b.sub === false
        ? <h2 className={SECTION_TITLE} key={i} dangerouslySetInnerHTML={{ __html: unlinkHiddenTours(b.html) }} />
        : <h2 className={`${SUB_VARIANT[headingVariant] || SUB_VARIANT.legal}${afterBoxes ? ' !mt-0' : ''}`} key={i} dangerouslySetInnerHTML={{ __html: unlinkHiddenTours(b.html) }} />;
    }
    if (b.type === 'para') {
      return <p className={`${BODY_P} ${PROSE_LINK}`} key={i} dangerouslySetInnerHTML={{ __html: unlinkHiddenTours(b.html) }} />;
    }
    if (b.type === 'list') {
      return (
        <ul className={`${infoList(b.variant)} ${PROSE_LINK}`} key={i}>
          {b.items.map((item, j) => <li key={j} dangerouslySetInnerHTML={{ __html: unlinkHiddenTours(item) }} />)}
        </ul>
      );
    }
    if (b.type === 'facts') {
      return <InfoFacts key={i} items={b.items} />;
    }
    if (b.type === 'boxes') {
      return (
        <InfoBoxes key={i}>
          {b.items.map((box, k) =>
            box.stack ? (
              <div className="flex flex-col gap-[var(--space-4)] max-[768px]:contents" key={k}>
                {box.stack.map((sub, stackIndex) => (
                  <div className={stackIndex === 0 ? undefined : 'max-[768px]:order-last'} key={stackIndex}>
                    <Box box={sub} />
                  </div>
                ))}
              </div>
            ) : (
              <Box box={box} key={k} />
            ),
          )}
        </InfoBoxes>
      );
    }
    if (b.type === 'back') {
      return <p style={{ marginTop: '2rem' }} className={`${BODY_P} [&_a]:text-gold [&_a]:no-underline [&_a]:font-medium`} key={i} dangerouslySetInnerHTML={{ __html: unlinkHiddenTours(b.html) }} />;
    }
    return null;
  });
}
