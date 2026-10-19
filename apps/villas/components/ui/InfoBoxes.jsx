import LoadFallback from '@/components/ui/LoadFallback';

export const BOX_GRID =
  'grid grid-cols-2 gap-[var(--space-4)] mb-[var(--space-4)] ' +
  'max-[768px]:grid-cols-1 max-[768px]:gap-[var(--space-3)]';

const BOX_TEXT = '[&>p]:m-0 [&>p]:mb-4 [&>p]:leading-[var(--lh-body)] [&>p]:text-body [&>p:last-child]:mb-0';
const BOX_FRAMED = `${BOX_TEXT} [border:1px_solid_var(--line)] rounded-[var(--r-md)] p-[1.1rem_1.2rem]`;
const BOX_NO = `${BOX_FRAMED} bg-cream`;

export const BOX_TITLE = 'font-body text-h3 font-semibold text-gold mb-[0.7rem]';

const ROWS_BASE =
  'list-none m-0 p-0 [&_li]:font-body [&_li]:text-body [&_li]:font-normal ' +
  '[&_li]:leading-[var(--lh-body)] [&_li]:py-2 [&_a]:text-gold [&_a]:font-medium';

const ROWS_RULED =
  '[&_li]:[border-bottom:1px_solid_var(--line)] [&_li:last-child]:[border-bottom:none] ' + '[&_li:last-child]:pb-0';

export function InfoBoxList({ items = [], variant = '', render = null }) {
  if (!items.length) return <LoadFallback />;
  const ruled = variant === 'yes' || variant === 'no';
  return (
    <ul className={`${ROWS_BASE} ${ruled ? `${ROWS_RULED} ` : ''}${variant === 'no' ? 'text-muted' : 'text-ink'}`}>
      {items.map((item, i) => (
        <li key={i}>{render ? render(item) : item}</li>
      ))}
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
