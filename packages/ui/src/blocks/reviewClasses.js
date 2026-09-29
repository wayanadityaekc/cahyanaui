import { BLEED_MOBILE } from './gridClasses.js';

// Review row that slides sideways at every width: 300px cards on desktop, 82% of the screen on small phones.
export const REVIEW_SLIDER =
  'flex max-w-[1200px] mx-auto pb-4 items-stretch overflow-x-auto overflow-y-hidden ' +
  '[scroll-snap-type:x_mandatory] [touch-action:pan-x_pan-y] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ' +
  'min-[993px]:gap-[1.4rem] max-[992px]:gap-4 ' + BLEED_MOBILE + ' ' +
  '[&>*]:[scroll-snap-align:start] [&>*]:flex-none [&>*]:w-[300px] max-[576px]:[&>*]:w-[82%]';

// The full-list layout (an all-reviews page): three columns, one on phones.
export const REVIEW_GRID = 'grid grid-cols-3 max-[768px]:grid-cols-1 gap-5 max-w-[1100px] mx-auto mt-6';

// Empty state: a dashed box, so it reads as "a place reviews will go", not as a broken card.
export const REVIEW_EMPTY =
  'col-[1/-1] flex flex-col items-center gap-[1.1rem] py-10 px-6 text-center ' +
  '[border:1px_dashed_var(--line)] rounded-md text-muted';

// Card parts. Fixed height so every card in a row is the same box; the message clamps at three lines.
export const REVIEW_CARD = {
  frame: 'relative [border:1px_solid_var(--line)] [box-shadow:var(--shadow-md)]',
  card: 'flex flex-col gap-2 w-full h-[248px] px-[1.3rem] pt-[1.4rem] pb-[2.3rem] text-left font-body cursor-pointer ' +
    'focus:outline-none focus-visible:[box-shadow:var(--focus-ring)]',
  head: 'flex items-center gap-2',
  name: 'font-semibold text-small text-green',
  meta: 'text-label text-muted',
  stars: 'text-amber tracking-[2px] max-[992px]:text-[0.85rem]',
  text: 'm-0 text-body text-green line-clamp-3',
  more: 'mt-auto text-label text-gold-d font-medium',
  logo: 'absolute right-[1.3rem] bottom-[1.1rem] h-[18px] w-auto object-contain',
};

export function starText(rating) {
  const n = Math.max(1, Math.min(5, parseInt(rating, 10) || 0));
  return { n, stars: '★'.repeat(n) + '☆'.repeat(5 - n) };
}
