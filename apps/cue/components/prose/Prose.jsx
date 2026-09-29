// Renders the block schema from content/schema/prose.js (guide, legal and detail info bodies).
import { SECTION_TITLE, SECTION_TITLE_SUB, ST_LEFT } from '@/components/ui/sectionTitle';
import { infoList, PROSE_LINK } from '@/components/ui/infoClasses';
import InfoBoxes, { InfoBox, InfoBoxList } from '@/components/ui/InfoBoxes';
import InfoFacts from '@/components/ui/InfoFacts';
import { unlinkHiddenTours } from '@/lib/routes';
import Breadcrumb from '@/components/ui/Breadcrumb';

// Paragraph body type on the element, so a wrapper's own [&_p] rule (higher specificity) still wins.
const BODY_P = 'm-0 mb-4 text-body leading-[var(--lh-body)] text-ink';

// --sub heading style per context: legal centered, guide and company left-aligned.
const SUB_VARIANT = {
  legal: SECTION_TITLE_SUB,
  guide: `${SECTION_TITLE_SUB} ${ST_LEFT}`,
  company: `${SECTION_TITLE_SUB} !text-left`,
};

// One box of a 'boxes' row: { title, variant?, paras?, list? }; also used inside a stack.
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
    // A --sub heading right after a 'boxes' row drops its top margin; the row already spaces itself.
    const afterBoxes = i > 0 && blocks[i - 1] && blocks[i - 1].type === 'boxes';
    if (b.type === 'crumb') {
      // Legal sections render the shared <Breadcrumb> from a structured trail.
      return <Breadcrumb items={b.items} className="mb-2" key={i} />;
    }
    if (b.type === 'heading') {
      // Default is a --sub heading; sub: false renders a main section heading (detail info bodies).
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
      // Fact chip strip opening the transfer / airport details card.
      return <InfoFacts key={i} items={b.items} />;
    }
    if (b.type === 'boxes') {
      // Row of bordered boxes; items { title, variant?, paras?, list? }, variant 'no' tints cream; 2 cols desktop.
      return (
        <InfoBoxes key={i}>
          {b.items.map((box, k) =>
            // An item may be a stack of boxes sharing one grid cell, spaced like the grid's column gap.
            box.stack ? (
              // display:contents on phones so stacked boxes become grid items and trailing ones go order-last.
              <div className="flex flex-col gap-[var(--space-4)] max-[768px]:contents" key={k}>
                {box.stack.map((sub, s2) => (
                  <div className={s2 === 0 ? undefined : 'max-[768px]:order-last'} key={s2}>
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
      // Inline margin-top so it beats BODY_P's m-0 and any ancestor [&_p] rule.
      return <p style={{ marginTop: '2rem' }} className={`${BODY_P} [&_a]:text-gold [&_a]:no-underline [&_a]:font-medium`} key={i} dangerouslySetInnerHTML={{ __html: unlinkHiddenTours(b.html) }} />;
    }
    return null;
  });
}
