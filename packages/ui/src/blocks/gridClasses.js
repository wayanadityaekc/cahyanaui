
export const BLEED_MOBILE =
  'max-[992px]:[margin-inline:calc(50%_-_50vw)] max-[992px]:pl-4 max-[992px]:pr-4 ' +
  'max-[992px]:[scroll-padding-left:1rem]';


export const MOBILE_SLIDER =
  'max-[992px]:flex max-[992px]:overflow-x-auto max-[992px]:overflow-y-hidden ' +
  'max-[992px]:[scroll-snap-type:x_mandatory] max-[992px]:[touch-action:pan-x_pan-y] ' +
  '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden ' +
  'max-[992px]:gap-2 max-[768px]:gap-2 ' +
  'max-[992px]:[&>*]:flex-[0_0_70%] max-[992px]:[&>*]:[scroll-snap-align:start] ' +
  'max-[576px]:[&>*]:flex-[0_0_88%] ' + BLEED_MOBILE;

const D = 'min-[993px]:grid min-[993px]:gap-2 min-[993px]:overflow-visible min-[993px]:[&>*]:flex-none';

export const GRID_CARDS =
  `max-w-[1200px] mx-auto pb-4 ${D} min-[993px]:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] ${MOBILE_SLIDER}`;

export const GRID_PAIR =
  `max-w-[1200px] mx-auto grid grid-cols-1 gap-2 max-[768px]:gap-2 ${D} min-[993px]:grid-cols-2`;
export const GRID_TRIO = `max-w-[1200px] mx-auto pb-4 ${D} min-[993px]:grid-cols-3 ${MOBILE_SLIDER}`;
export const GRID_QUAD = `max-w-[1200px] mx-auto pb-4 ${D} min-[993px]:grid-cols-4 ${MOBILE_SLIDER}`;

export const GRID_SLIDER = GRID_CARDS;

export const GRID_CAROUSEL_4UP = `mt-[1.6rem] ${GRID_QUAD}`;

export const GRID_GUIDEHUB = GRID_QUAD;

export const GRID_GUIDEMORE =
  'max-w-[calc(var(--container)_-_2_*_var(--container-x))] pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ' +
  'min-[993px]:grid min-[993px]:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] min-[993px]:gap-2 min-[993px]:overflow-visible min-[993px]:[&>*]:flex-none ' +
  'max-[992px]:flex max-[992px]:overflow-x-auto max-[992px]:overflow-y-hidden max-[992px]:[scroll-snap-type:x_mandatory] max-[992px]:[touch-action:pan-x_pan-y] max-[992px]:gap-4 ' +
  `max-[992px]:[&>*]:flex-[0_0_70%] max-[992px]:[&>*]:[scroll-snap-align:start] max-[576px]:[&>*]:flex-[0_0_88%] ${BLEED_MOBILE}`;

export const CAROUSEL_TITLE = 'font-body font-semibold text-h3 leading-[var(--lh-heading)] text-green m-0 pb-[11px]';
