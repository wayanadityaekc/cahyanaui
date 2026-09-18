// Included / Not included and the explanation blocks under it, as BOXES.
//
// Sep 2026, Wayan picked option B from the marker sheet: the per-row marker is
// gone entirely. The old radio bullet (filled circle / empty circle) borrowed the
// shape of a form control and sat in the middle of a reading column; here the box
// itself says "this is a group", so nothing has to be repeated on every row. Rows
// are separated by a hairline instead.
//
// SHARED ON PURPOSE (Wayan: "biar bisa di pakai juga di page transfer"): the
// charter details body (via the Prose 'boxes' block) and the transfer/airport
// "Good to know" block render THIS component, so there is one shape to change,
// not two that drift apart. Anything that needs the boxes gets them from here.
//
// Desktop = two columns, mobile = stacked rows. 768 is the same breakpoint the
// old two-column checklist used (INFO_LISTS / DetailTinfo), kept so these blocks
// still turn at the width the rest of the site turns at.

// mb matches the column gap on purpose: when two rows of boxes sit under each
// other (charter), the space between the rows reads the same as the space
// between the columns instead of the rows touching.
export const BOX_GRID =
  'grid grid-cols-2 gap-[var(--space-4)] mb-[var(--space-4)] ' +
  'max-[768px]:grid-cols-1 max-[768px]:gap-[var(--space-3)]';

const BOX_BASE =
  '[border:1px_solid_var(--line)] rounded-[var(--r-md)] p-[1.1rem_1.2rem] ' +
  '[&>p]:m-0 [&>p]:mb-4 [&>p]:leading-[var(--lh-body)] [&>p]:text-body [&>p:last-child]:mb-0';
// variant 'no' = the "not included" half: cream so the pair reads as two states
// at a glance, which is the job the empty circle used to do.
const BOX_NO = `${BOX_BASE} bg-cream`;

export const BOX_TITLE = 'font-body text-h3 font-semibold text-gold mb-[0.7rem]';

// Hairline-separated rows, no marker. The muted colour on the 'no' variant is the
// SAME muted token the rest of the site uses - deliberately not the old washed-out
// #8a8578, which read as disabled rather than as information.
const ROWS_BASE =
  'list-none m-0 p-0 [&_li]:font-body [&_li]:text-body [&_li]:font-normal ' +
  '[&_li]:leading-[var(--lh-body)] [&_li]:py-2 ' +
  '[&_li]:[border-bottom:1px_solid_var(--line)] [&_li:last-child]:[border-bottom:none] ' +
  '[&_li:last-child]:pb-0 [&_a]:text-gold [&_a]:font-medium';

export function InfoBoxList({ items, variant, render }) {
  return (
    <ul className={`${ROWS_BASE} ${variant === 'no' ? 'text-muted' : 'text-ink'}`}>
      {items.map((item, i) => <li key={i}>{render ? render(item) : item}</li>)}
    </ul>
  );
}

export function InfoBox({ title, variant, children }) {
  return (
    <div className={variant === 'no' ? BOX_NO : BOX_BASE}>
      {title && <h3 className={BOX_TITLE}>{title}</h3>}
      {children}
    </div>
  );
}

export default function InfoBoxes({ children }) {
  return <div className={BOX_GRID}>{children}</div>;
}
