// Renders the block schema in content/schema/prose.js. Used by guide article
// bodies (TW-B1 #334) and, going forward, legal pages (TW-B2 #335).
// Every block still carries its ORIGINAL pre-migration class name - converting
// those to Tailwind utilities belongs to a later, separate issue (see
// content/schema/prose.js header). This component only moves the markup out
// of a raw HTML string into data + real elements.
import { SECTION_TITLE, SECTION_TITLE_SUB, ST_LEFT } from '@/components/ui/sectionTitle';
import { infoList, PROSE_LINK } from '@/components/ui/infoClasses';
import InfoBoxes, { InfoBox, InfoBoxList } from '@/components/ui/InfoBoxes';
import InfoFacts from '@/components/ui/InfoFacts';
import { unlinkHiddenTours } from '@/lib/routes';

// headingVariant tunes the `--sub` article headings per context (the old
// `.guide-article-page` / `.company-page .guide-article` descendant overrides):
//   'legal'   (default) = centered + underline (base .section__title--sub)
//   'guide'   = left-aligned + underline shifted left
//   'company' = left-aligned (Terms-style in Our Company). It used to also switch
//               the underline off; no section title has one any more.
const SUB_VARIANT = {
  legal: SECTION_TITLE_SUB,
  guide: `${SECTION_TITLE_SUB} ${ST_LEFT}`,
  company: `${SECTION_TITLE_SUB} !text-left`,
};

// One box of a 'boxes' row: { title, variant?, paras?, list? }. Split out so a
// row item can also be a STACK of these in one column (see the boxes case).
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
    // A --sub heading carries mt-[2.75rem] to separate it from the prose above.
    // After a 'boxes' row that is a second gap on top of the row's own mb-8: the
    // two collapse to 44px and the charter page came out with a visible dead band
    // between its explainer columns and "Charter or guided tour?" (measured). The
    // row already spaces itself, so drop the heading's own top margin there.
    const afterBoxes = i > 0 && blocks[i - 1] && blocks[i - 1].type === 'boxes';
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
          : <h2 className={`${SUB_VARIANT[headingVariant] || SUB_VARIANT.legal}${afterBoxes ? ' !mt-0' : ''}`} key={i} dangerouslySetInnerHTML={{ __html: unlinkHiddenTours(b.html) }} />;
      case 'para':
        return <p className={PROSE_LINK} key={i} dangerouslySetInnerHTML={{ __html: unlinkHiddenTours(b.html) }} />;
      case 'list':
        return (
          <ul className={`${infoList(b.variant)} ${PROSE_LINK}`} key={i}>
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
            {b.items.map((box, k) =>
              // An item may hold a STACK of blocks instead of one, which puts two
              // blocks in the same grid cell (Sep 2026, Wayan picked option a for
              // levelling the charter row: "Charter or guided tour?" moved out of
              // its own full-width heading and under "How the day works"). The gap
              // between the two matches the grid's own column gap.
              box.stack ? (
                // display:contents below the grid's own breakpoint, so the stacked
                // blocks become grid items in their own right once the row is a
                // single column - which lets the trailing ones take order-last and
                // keep the phone's reading order (the two main blocks first, the
                // closing note after them) exactly as it was before the stack
                // existed. On desktop the wrapper is a real flex column again.
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
      case 'back':
        // margin-top stays inline: `.guide-article p` (0,1,1) outweighs a mt-* utility
        // (0,1,0), same as the pre-migration inline style; [&_a]: replaces .guide-crumb-back.
        return <p style={{ marginTop: '2rem' }} className="[&_a]:text-gold [&_a]:no-underline [&_a]:font-medium" key={i} dangerouslySetInnerHTML={{ __html: unlinkHiddenTours(b.html) }} />;
      default:
        return null;
    }
  });
}
