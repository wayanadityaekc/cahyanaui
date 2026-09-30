import LoadFallback from '@/components/ui/LoadFallback';

// mb matches the column gap so stacked rows of boxes are spaced like the columns.
export const BOX_GRID =
  'grid grid-cols-2 gap-[var(--space-4)] mb-[var(--space-4)] ' +
  'max-[768px]:grid-cols-1 max-[768px]:gap-[var(--space-3)]';

// Paragraph rhythm - every box gets this, framed or not.
const BOX_TEXT =
  '[&>p]:m-0 [&>p]:mb-4 [&>p]:leading-[var(--lh-body)] [&>p]:text-body [&>p:last-child]:mb-0';
// Only the included/excluded pair gets a frame; other boxes are plain columns so text lines up with the card edge.
const BOX_FRAMED =
  `${BOX_TEXT} [border:1px_solid_var(--line)] rounded-[var(--r-md)] p-[1.1rem_1.2rem]`;
// variant 'no' is cream so the included/not-included pair reads as two states at a glance.
const BOX_NO = `${BOX_FRAMED} bg-cream`;

export const BOX_TITLE = 'font-body text-h3 font-semibold text-gold mb-[0.7rem]';

// Rows have no marker; 'no' uses the site's muted token, not the old #8a8578 that read as disabled.
const ROWS_BASE =
  'list-none m-0 p-0 [&_li]:font-body [&_li]:text-body [&_li]:font-normal ' +
  '[&_li]:leading-[var(--lh-body)] [&_li]:py-2 [&_a]:text-gold [&_a]:font-medium';

// Hairlines between rows only on the included/excluded pair (via variant); on other lists they looked like a table.
const ROWS_RULED =
  '[&_li]:[border-bottom:1px_solid_var(--line)] [&_li:last-child]:[border-bottom:none] ' +
  '[&_li:last-child]:pb-0';

export function InfoBoxList({ items = [], variant = '', render = null }) {
  if (!items.length) return <LoadFallback />;
  const ruled = variant === 'yes' || variant === 'no';
  return (
    <ul className={`${ROWS_BASE} ${ruled ? ROWS_RULED + ' ' : ''}${variant === 'no' ? 'text-muted' : 'text-ink'}`}>
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

// Included/Not included boxes, shared by the charter and transfer blocks so there is one shape to change.
export default function InfoBoxes({ children }) {
  return <div className={BOX_GRID}>{children}</div>;
}
