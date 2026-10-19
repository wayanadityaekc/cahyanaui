
export const BLEED_MOBILE =
  'max-[992px]:[margin-inline:calc(50%_-_50vw)] max-[992px]:pl-4 max-[992px]:pr-4 ' +
  'max-[992px]:[scroll-padding-left:1rem]';

export const XPLORE_SECTION = 'max-w-[var(--container)] mx-auto px-[var(--container-x)] text-left';

export const GRID_XPLORE =
  `max-w-[1200px] mx-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ` +
  `min-[993px]:grid min-[993px]:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] min-[993px]:gap-[1.4rem] min-[993px]:overflow-visible min-[993px]:[&>*]:flex-none ` +
  `max-[992px]:flex max-[992px]:overflow-x-auto max-[992px]:overflow-y-hidden max-[992px]:[scroll-snap-type:x_mandatory] max-[992px]:[touch-action:pan-x_pan-y] max-[992px]:gap-[1.4rem] max-[768px]:gap-[0.9rem] ` +
  `max-[992px]:[&>*]:flex-[0_0_70%] max-[992px]:[&>*]:[scroll-snap-align:start] max-[576px]:[&>*]:flex-[0_0_88%]` + ` ${  BLEED_MOBILE}`;

export const GRID_RELATED =
  `max-w-[1200px] mx-auto mt-[1.6rem] pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ` +
  `min-[993px]:grid min-[993px]:grid-cols-4 min-[993px]:gap-[1.4rem] min-[993px]:overflow-visible min-[993px]:[&>*]:flex-none ` +
  `max-[992px]:flex max-[992px]:overflow-x-auto max-[992px]:overflow-y-hidden max-[992px]:[scroll-snap-type:x_mandatory] max-[992px]:[touch-action:pan-x_pan-y] max-[992px]:gap-[1.4rem] max-[768px]:gap-[0.9rem] ` +
  `max-[992px]:[&>*]:flex-[0_0_70%] max-[992px]:[&>*]:[scroll-snap-align:start] max-[576px]:[&>*]:flex-[0_0_88%]` + ` ${  BLEED_MOBILE}`;

export const GRID_GUIDEMORE =
  `max-w-[calc(var(--container)_-_2_*_var(--container-x))] pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ` +
  `min-[993px]:grid min-[993px]:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] min-[993px]:gap-[1.4rem] min-[993px]:overflow-visible min-[993px]:[&>*]:flex-none ` +
  `max-[992px]:flex max-[992px]:overflow-x-auto max-[992px]:overflow-y-hidden max-[992px]:[scroll-snap-type:x_mandatory] max-[992px]:[touch-action:pan-x_pan-y] max-[992px]:gap-4 ` +
  `max-[992px]:[&>*]:flex-[0_0_70%] max-[992px]:[&>*]:[scroll-snap-align:start] max-[576px]:[&>*]:flex-[0_0_88%]` + ` ${  BLEED_MOBILE}`;

export const GRID_GUIDEHUB =
  `flex max-w-[1200px] mx-auto pb-4 overflow-x-auto overflow-y-hidden ` +
  `[scroll-snap-type:x_mandatory] [touch-action:pan-x_pan-y] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ` +
  `gap-[1.4rem] [&>*]:[scroll-snap-align:start] ` +
  `min-[993px]:[&>*]:flex-[0_0_calc((100%-4.2rem)/4)] max-[992px]:[&>*]:flex-[0_0_70%] max-[576px]:[&>*]:flex-[0_0_80%]` + ` ${  BLEED_MOBILE}`;

export const GRID_SLIDER =
  `flex max-w-[1200px] mx-auto pb-4 overflow-x-auto overflow-y-hidden ` +
  `[scroll-snap-type:x_mandatory] [touch-action:pan-x_pan-y] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ` +
  `min-[993px]:gap-[1.5rem] max-[992px]:gap-4 ${  BLEED_MOBILE  } ` +
  `[&>*]:[scroll-snap-align:start] min-[993px]:[&>*]:flex-[0_0_300px] max-[992px]:[&>*]:flex-[0_0_70%] max-[576px]:[&>*]:flex-[0_0_80%]`;

export const GRID_CAROUSEL_4UP =
  `flex max-w-[1200px] mx-auto mt-[1.6rem] pb-4 overflow-x-auto overflow-y-hidden ` +
  `[scroll-snap-type:x_mandatory] [touch-action:pan-x_pan-y] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ` +
  `min-[993px]:gap-[1.4rem] min-[993px]:[&>*]:flex-[0_0_calc((100%_-_3_*_1.4rem)_/_4)] ` +
  `max-[992px]:gap-[1.4rem] max-[768px]:gap-[0.9rem] ` +
  `max-[992px]:[&>*]:flex-[0_0_70%] max-[576px]:[&>*]:flex-[0_0_88%] [&>*]:[scroll-snap-align:start]` + ` ${  BLEED_MOBILE}`;

export const GRID_REVIEWS =
  `flex max-w-[1200px] mx-auto pb-4 items-stretch overflow-x-auto overflow-y-hidden ` +
  `[scroll-snap-type:x_mandatory] [touch-action:pan-x_pan-y] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ` +
  `min-[993px]:gap-[1.4rem] max-[992px]:gap-4 ${  BLEED_MOBILE  } ` +
  `[&>*]:[scroll-snap-align:start] [&>*]:flex-none [&>*]:w-[300px] max-[576px]:[&>*]:w-[82%]`;

