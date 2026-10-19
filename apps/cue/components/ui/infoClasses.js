export const INFO_SECTION_DETAIL = 'py-9 px-6 bg-cream';
export const INFO_SECTION_ARTICLE = 'py-9 px-6 bg-white';

export const INFO_CARD =
  'max-w-[var(--container-mid)] mx-auto bg-white rounded-[var(--r-lg)] p-[2.5rem_2rem] ' +
  'max-[576px]:p-[1.75rem_1.25rem] ' +
  '[&>p]:m-0 [&>p]:mb-4 [&>p]:leading-[var(--lh-body)] [&>p]:text-body [&>p:last-child]:mb-0';

export const INFO_CARD_BODY = '[&_p]:leading-[var(--lh-body)] [&_p]:m-0 [&_p]:mb-4 [&_p]:text-ink [&_p]:text-body';

export const INFO_CONTAINER_ARTICLE =
  'mx-auto max-w-[var(--container-read)] text-left ' +
  '[&_p]:leading-[var(--lh-body)] [&_p]:m-0 [&_p]:mb-4 [&_p]:text-ink [&_p]:text-body';

export const PROSE_LINK = '[&_a]:text-gold [&_a]:font-medium';

export const INFO_LISTS = 'grid grid-cols-2 max-[768px]:grid-cols-1 gap-10 max-[768px]:gap-6';
export const INFO_COL_H3 = 'mb-4 font-body text-h3';

const LIST_BASE =
  'list-none [&_li]:font-body [&_li]:text-body [&_li]:font-normal [&_li]:leading-[var(--lh-body)] ' +
  '[&_li]:relative [&_li]:py-2 [&_li]:pr-0 [&_li]:pl-[1.1rem] ' +
  "[&_li]:before:content-[''] [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.98rem] " +
  '[&_li]:before:w-[5px] [&_li]:before:h-[5px] [&_li]:before:rounded-[50%]';
export const INFO_LIST_YES = `${LIST_BASE} [&_li]:text-ink [&_li]:before:bg-gold`;
export const INFO_LIST_NO = `${LIST_BASE} [&_li]:text-muted [&_li]:before:bg-muted`;
export function infoList(value) {
  return String(value).includes('no') ? INFO_LIST_NO : INFO_LIST_YES;
}
