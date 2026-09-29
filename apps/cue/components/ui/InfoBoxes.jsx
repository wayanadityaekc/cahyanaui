// Shared included/not-included boxes and explanation columns (charter, transfer, airport, detail pages, listings).

// Two-column box grid, stacked under 768px; bottom margin equals the column gap so stacked rows space evenly.
export const BOX_GRID =
  'grid grid-cols-2 gap-[var(--space-4)] mb-[var(--space-4)] ' +
  'max-[768px]:grid-cols-1 max-[768px]:gap-[var(--space-3)]';

// Paragraph rhythm - every box gets this, framed or not.
import { PROSE_LINK } from '@/components/ui/infoClasses';

const BOX_TEXT =
  `[&>p]:m-0 [&>p]:mb-4 [&>p]:leading-[var(--lh-body)] [&>p]:text-body [&>p:last-child]:mb-0 ${PROSE_LINK}`;
// Frame (border, radius, padding) is only for the included/excluded pair; other boxes are plain columns.
const BOX_FRAMED =
  `${BOX_TEXT} [border:1px_solid_var(--line)] rounded-[var(--r-md)] p-[1.1rem_1.2rem]`;
// The 'no' variant is tinted cream so the pair reads as two states.
const BOX_NO = `${BOX_FRAMED} bg-cream`;

export const BOX_TITLE = 'font-body text-h3 font-semibold text-gold mb-[0.7rem]';

// Rows have no marker; the 'no' variant uses the --color-muted token, not the old #8a8578.
const ROWS_BASE =
  'list-none m-0 p-0 [&_li]:font-body [&_li]:text-body [&_li]:font-normal ' +
  '[&_li]:leading-[var(--lh-body)] [&_li]:py-2 ' + PROSE_LINK;

// Row hairlines only when a variant is set (the included/excluded pair); other lists stay unruled.
const ROWS_RULED =
  '[&_li]:[border-bottom:1px_solid_var(--line)] [&_li:last-child]:[border-bottom:none] ' +
  '[&_li:last-child]:pb-0';

export function InfoBoxList({ items, variant, render }) {
  const ruled = variant === 'yes' || variant === 'no';
  return (
    <ul className={`${ROWS_BASE} ${ruled ? `${ROWS_RULED} ` : ''}${variant === 'no' ? 'text-muted' : 'text-ink'}`}>
      {items.map((item, i) => <li key={i}>{render ? render(item) : item}</li>)}
    </ul>
  );
}

export function InfoBox({ title, variant, children }) {
  const cls = variant === 'no' ? BOX_NO : variant === 'yes' ? BOX_FRAMED : BOX_TEXT;
  return (
    <div className={cls}>
      {title && <h3 className={BOX_TITLE}>{title}</h3>}
      {children}
    </div>
  );
}

export default function InfoBoxes({ children }) {
  return <div className={BOX_GRID}>{children}</div>;
}
