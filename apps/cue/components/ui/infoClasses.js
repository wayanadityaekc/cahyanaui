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

// Paragraph rhythm inside the white detail card. Was a local BODY_TEXT const in
// CharterSection ("Our Company's reading style"); exported here (Sep 2026) so the
// transfer and airport cards read identically instead of each page deciding.
export const INFO_CARD_BODY =
  '[&_p]:leading-[var(--lh-body)] [&_p]:m-0 [&_p]:mb-4 [&_p]:text-ink [&_p]:text-body';

// .info__container article variant = the .guide-article reading column (narrow read
// width, left-aligned, bare <p> styling for Prose 'para' blocks). Merged in so the
// separate .guide-article class isn't needed on the 3 consumers.
export const INFO_CONTAINER_ARTICLE =
  'mx-auto max-w-[var(--container-read)] text-left ' +
  '[&_p]:leading-[var(--lh-body)] [&_p]:m-0 [&_p]:mb-4 [&_p]:text-ink [&_p]:text-body';

// Inline links inside body copy. Preflight is OFF, so an <a> with no styling
// keeps the browser default - bright blue #0000EE with an underline. That is
// what every guide article and the charter page were shipping inside their
// paragraphs and lists: 112 links across 15 pages, measured. Only the crumb,
// the back link and InfoBoxList had ever been given a colour.
//
// One string, imported by everything that prints body HTML, so the three
// places cannot drift apart again. Underline is left alone on purpose: inside
// a paragraph it is the thing that marks the link as a link.
export const PROSE_LINK = '[&_a]:text-gold [&_a]:font-medium';

// .info__lists / .info__col
export const INFO_LISTS = 'grid grid-cols-2 max-[768px]:grid-cols-1 gap-10 max-[768px]:gap-6';
export const INFO_COL_H3 = 'mb-4 font-body text-h3';

// Bullet lists in body copy. The marker is a small DOT (Sep 2026, Wayan: "gas
// ganti marker bulatan itu bro").
//
// It used to be a 14px ring with a filled centre - the shape of a radio button,
// which is exactly why Wayan had already thrown it out of the include/exclude
// pair ("minjem bentuk radio button"). It survived here because these lists were
// never part of that pass, so guide articles, the legal pages and About were
// still printing a row of form controls down the side of a reading column. A
// 5px dot is the same bullet the rest of the site's generic lists use.
//
// Only two things render this now: Prose's { type: 'list' } block and About's
// promise list. Everything else that once did (the include/exclude pairs) moved
// to InfoBoxes and carries no marker at all.
const LIST_BASE =
  'list-none [&_li]:font-body [&_li]:text-body [&_li]:font-normal [&_li]:leading-[var(--lh-body)] ' +
  '[&_li]:relative [&_li]:py-2 [&_li]:pr-0 [&_li]:pl-[1.1rem] ' +
  "[&_li]:before:content-[''] [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.98rem] " +
  // rounded-[50%], not rounded-full: Preflight is off.
  '[&_li]:before:w-[5px] [&_li]:before:h-[5px] [&_li]:before:rounded-[50%]';
export const INFO_LIST_YES = `${LIST_BASE} [&_li]:text-ink [&_li]:before:bg-gold`;
// Kept, though nothing renders it today: a muted dot for a muted list.
export const INFO_LIST_NO = `${LIST_BASE} [&_li]:text-muted [&_li]:before:bg-muted`;
export const infoList = (v) => (String(v).includes('no') ? INFO_LIST_NO : INFO_LIST_YES);
