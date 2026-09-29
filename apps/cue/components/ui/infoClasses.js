// Shared detail-page info class strings; context-specific styling is applied at the usage site.

// .info section — vertical rhythm = --section-gap (36px), px 1.5rem. bg per context.
export const INFO_SECTION_DETAIL = 'py-9 px-6 bg-cream';       // .info:has(>.info__container:not(.guide-article))
export const INFO_SECTION_ARTICLE = 'py-9 px-6 bg-white';      // .info (guide-article child)

// .info__container:not(.guide-article) — white card.
export const INFO_CARD =
  'max-w-[var(--container-mid)] mx-auto bg-white rounded-[var(--r-lg)] p-[2.5rem_2rem] ' +
  'max-[576px]:p-[1.75rem_1.25rem] ' +
  '[&>p]:m-0 [&>p]:mb-4 [&>p]:leading-[var(--lh-body)] [&>p]:text-body [&>p:last-child]:mb-0';

// Paragraph rhythm inside the details card (FormHero: charter, transfer, airport).
export const INFO_CARD_BODY =
  '[&_p]:leading-[var(--lh-body)] [&_p]:m-0 [&_p]:mb-4 [&_p]:text-ink [&_p]:text-body';

// Narrow left-aligned reading column with body paragraph styling; currently unused.
export const INFO_CONTAINER_ARTICLE =
  'mx-auto max-w-[var(--container-read)] text-left ' +
  '[&_p]:leading-[var(--lh-body)] [&_p]:m-0 [&_p]:mb-4 [&_p]:text-ink [&_p]:text-body';

// Body-copy link colour; Preflight is off, so unstyled links render browser blue. Underline kept on purpose.
export const PROSE_LINK = '[&_a]:text-gold [&_a]:font-medium';

// .info__lists / .info__col
export const INFO_LISTS = 'grid grid-cols-2 max-[768px]:grid-cols-1 gap-10 max-[768px]:gap-6';
export const INFO_COL_H3 = 'mb-4 font-body text-h3';

// Dot-bullet list for Prose list blocks and About's promise list; include/exclude pairs use InfoBoxes instead.
const LIST_BASE =
  'list-none [&_li]:font-body [&_li]:text-body [&_li]:font-normal [&_li]:leading-[var(--lh-body)] ' +
  '[&_li]:relative [&_li]:py-2 [&_li]:pr-0 [&_li]:pl-[1.1rem] ' +
  "[&_li]:before:content-[''] [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.98rem] " +
  // rounded-[50%], not rounded-full: Preflight is off.
  '[&_li]:before:w-[5px] [&_li]:before:h-[5px] [&_li]:before:rounded-[50%]';
export const INFO_LIST_YES = `${LIST_BASE} [&_li]:text-ink [&_li]:before:bg-gold`;
// Kept, though nothing renders it today: a muted dot for a muted list.
export const INFO_LIST_NO = `${LIST_BASE} [&_li]:text-muted [&_li]:before:bg-muted`;
export function infoList(v) { return (String(v).includes('no') ? INFO_LIST_NO : INFO_LIST_YES); }
