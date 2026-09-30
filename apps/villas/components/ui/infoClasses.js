// Shared "info" section strings mirroring the old .info CSS; detail variant: .info:has(>.info__container:not(.guide-article)).
export const INFO_SECTION_DETAIL = 'py-9 px-6 bg-cream';
// .info section, guide-article variant.
export const INFO_SECTION_ARTICLE = 'py-9 px-6 bg-surface-raised';

// .info__container:not(.guide-article) — white card.
export const INFO_CARD =
  'max-w-[var(--container-mid)] mx-auto bg-surface-raised p-[2.5rem_2rem] ' +
  'max-[576px]:p-[1.75rem_1.25rem] ' +
  '[&>p]:m-0 [&>p]:mb-4 [&>p]:leading-[var(--lh-body)] [&>p]:text-body [&>p:last-child]:mb-0';

// Article variant: the narrow, left-aligned .guide-article reading column, merged in so consumers skip that class.
export const INFO_CONTAINER_ARTICLE =
  'mx-auto max-w-[var(--container-read)] text-left ' +
  '[&_p]:leading-[var(--lh-body)] [&_p]:m-0 [&_p]:mb-4 [&_p]:text-ink [&_p]:text-body';

// .info__facts — spec strip (4-col desktop / 2-col mobile), 1px divider lines via bg+gap.
export const INFO_FACTS =
  'grid grid-cols-4 max-[768px]:grid-cols-2 gap-px bg-line [border:1px_solid_var(--line)] rounded-[var(--r-md)] overflow-hidden mb-10';
// .info__fact
export const INFO_FACT =
  'flex flex-col items-center justify-center min-h-[84px] py-[1.05rem] px-4 text-center bg-[#fdfcfa] ' +
  '[&>span]:text-label [&>span]:uppercase [&>span]:tracking-[0.14em] [&>span]:text-muted ' +
  '[&_strong]:block [&_strong]:mt-[0.3rem] [&_strong]:font-body [&_strong]:text-strong';
// .info__lists / .info__col
export const INFO_LISTS = 'grid grid-cols-2 max-[768px]:grid-cols-1 gap-10 max-[768px]:gap-6';
export const INFO_COL_H3 = 'mb-4 font-body text-h3';

// .info__list + radio-bullet ::before. Variant --yes (filled) / --no (empty + muted text).
const LIST_BASE =
  'list-none [&_li]:font-body [&_li]:text-body [&_li]:font-normal [&_li]:leading-[var(--lh-body)] ' +
  '[&_li]:relative [&_li]:py-2 [&_li]:pr-0 [&_li]:pl-[1.95rem] ' +
  "[&_li]:before:content-[''] [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.7rem] " +
  '[&_li]:before:w-[14px] [&_li]:before:h-[14px] [&_li]:before:rounded-[50%] [&_li]:before:box-border';
export const INFO_LIST_YES =
  `${LIST_BASE} [&_li]:text-ink [&_li]:before:[border:1.5px_solid_var(--color-green)] ` +
  '[&_li]:before:[background:radial-gradient(circle_at_center,var(--color-green)_0_3.5px,transparent_4px)]';
export const INFO_LIST_NO =
  `${LIST_BASE} [&_li]:text-[#8a8578] [&_li]:before:[border:1.5px_solid_#cfc9ba] [&_li]:before:bg-transparent`;
// Pick a checklist variant from a 'yes'/'no' hint (or a legacy 'info__list--no' string).
export function infoList(variant) { return (String(variant).includes('no') ? INFO_LIST_NO : INFO_LIST_YES); }
