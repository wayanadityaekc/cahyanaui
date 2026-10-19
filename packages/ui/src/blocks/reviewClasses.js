import { BLEED_MOBILE } from './gridClasses.js';

export const REVIEW_SLIDER =
  `max-w-[1200px] mx-auto pb-4 min-[993px]:grid min-[993px]:grid-cols-3 min-[993px]:gap-[1.4rem] min-[993px]:items-stretch ` +
  `max-[992px]:flex max-[992px]:items-stretch max-[992px]:overflow-x-auto max-[992px]:overflow-y-hidden ` +
  `max-[992px]:[scroll-snap-type:x_mandatory] max-[992px]:[touch-action:pan-x_pan-y] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ` +
  `max-[992px]:gap-4 ${BLEED_MOBILE} ` +
  `max-[992px]:[&>*]:[scroll-snap-align:start] max-[992px]:[&>*]:flex-none max-[992px]:[&>*]:w-[300px] max-[576px]:[&>*]:w-[82%]`;

export const REVIEW_GRID = 'grid grid-cols-3 max-[768px]:grid-cols-1 gap-5 max-w-[1100px] mx-auto mt-6';

export const REVIEW_EMPTY =
  'col-[1/-1] flex flex-col items-center gap-[1.1rem] py-10 px-6 text-center ' +
  '[border:1px_dashed_var(--line)] rounded-md text-muted';

export const REVIEW_CARD = {
  frame: 'relative [border:1px_solid_var(--line)] [box-shadow:var(--shadow-md)]',
  card:
    'flex flex-col gap-2 w-full h-[248px] px-[1.3rem] pt-[1.4rem] pb-[2.3rem] text-left font-body cursor-pointer ' +
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
  const starCount = Math.max(1, Math.min(5, parseInt(rating, 10) || 0));
  return { n: starCount, stars: '★'.repeat(starCount) + '☆'.repeat(5 - starCount) };
}
