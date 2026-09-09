// Shared detail-page "info" utility strings (B-FINAL full-Tailwind). Mirror of the
// live `.info*` CSS. Dead vanilla-era bits (info__facts--hero, info__fact--price,
// info__cta, is-exclusive/data-only ticket toggle, info__fact .price) are dropped,
// not reproduced (0 renders). Context (detail cream card vs guide-article reading
// column vs booking-sidebar transparent) is applied at the usage site.

// .info section — vertical rhythm = --section-gap (36px), px 1.5rem. bg per context.
export const INFO_SECTION_DETAIL = 'py-9 px-6 bg-cream';       // .info:has(>.info__container:not(.guide-article))
export const INFO_SECTION_ARTICLE = 'py-9 px-6 bg-white';      // .info (guide-article child)

// .info__container:not(.guide-article) — white card.
export const INFO_CARD =
  'max-w-[var(--container-mid)] mx-auto bg-white rounded-[var(--r-lg)] p-[2.5rem_2rem] ' +
  '[box-shadow:0_10px_30px_rgba(31,61,43,0.06)] max-[576px]:p-[1.75rem_1.25rem] ' +
  '[&>p]:m-0 [&>p]:mb-4 [&>p]:leading-[var(--lh-body)] [&>p]:text-body [&>p:last-child]:mb-0';

// .info__container base (guide-article variant keeps its own .guide-article class for width).
export const INFO_CONTAINER_ARTICLE = 'mx-auto';

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
export const infoList = (v) => (String(v).includes('no') ? INFO_LIST_NO : INFO_LIST_YES);
