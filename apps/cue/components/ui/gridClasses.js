// Card-grid and slider class strings, one self-contained string per context.

// Mobile full-bleed slider track via calc(50% - 50vw), not -mx-6, so it fits any centred container padding.
export const BLEED_MOBILE =
  'max-[992px]:[margin-inline:calc(50%_-_50vw)] max-[992px]:pl-4 max-[992px]:pr-4 ' +
  'max-[992px]:[scroll-padding-left:1rem]';

// Homepage Explore/Destinations section container; vertical spacing comes from --section-gap margins.
export const XPLORE_SECTION = 'max-w-[var(--container)] mx-auto px-[var(--container-x)] text-left';

// Homepage Explore/Destinations: auto-fill grid on desktop, slider on mobile (88% card under 576px).
export const GRID_XPLORE =
  'max-w-[1200px] mx-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ' +
  // desktop (>=993): grid wrap
  'min-[993px]:grid min-[993px]:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] min-[993px]:gap-[1.4rem] min-[993px]:overflow-visible min-[993px]:[&>*]:flex-none ' +
  // mobile (<=992): slider
  'max-[992px]:flex max-[992px]:overflow-x-auto max-[992px]:overflow-y-hidden max-[992px]:[scroll-snap-type:x_mandatory] max-[992px]:[touch-action:pan-x_pan-y] max-[992px]:gap-[1.4rem] max-[768px]:gap-[0.9rem] ' +
  'max-[992px]:[&>*]:flex-[0_0_70%] max-[992px]:[&>*]:[scroll-snap-align:start] max-[576px]:[&>*]:flex-[0_0_88%]' + ' ' + BLEED_MOBILE;

// Detail-page 'You might also like': fixed 4 columns on desktop, same width/gap as GRID_XPLORE; slider on mobile.
export const GRID_RELATED =
  'max-w-[1200px] mx-auto mt-[1.6rem] pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ' +
  'min-[993px]:grid min-[993px]:grid-cols-4 min-[993px]:gap-[1.4rem] min-[993px]:overflow-visible min-[993px]:[&>*]:flex-none ' +
  'max-[992px]:flex max-[992px]:overflow-x-auto max-[992px]:overflow-y-hidden max-[992px]:[scroll-snap-type:x_mandatory] max-[992px]:[touch-action:pan-x_pan-y] max-[992px]:gap-[1.4rem] max-[768px]:gap-[0.9rem] ' +
  'max-[992px]:[&>*]:flex-[0_0_70%] max-[992px]:[&>*]:[scroll-snap-align:start] max-[576px]:[&>*]:flex-[0_0_88%]' + ' ' + BLEED_MOBILE;

// Guide 'more' cards: capped at the homepage grid width but not centred (mx-auto would misalign the left edge).
export const GRID_GUIDEMORE =
  'max-w-[calc(var(--container)_-_2_*_var(--container-x))] pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ' +
  'min-[993px]:grid min-[993px]:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] min-[993px]:gap-[1.4rem] min-[993px]:overflow-visible min-[993px]:[&>*]:flex-none ' +
  'max-[992px]:flex max-[992px]:overflow-x-auto max-[992px]:overflow-y-hidden max-[992px]:[scroll-snap-type:x_mandatory] max-[992px]:[touch-action:pan-x_pan-y] max-[992px]:gap-4 ' +
  'max-[992px]:[&>*]:flex-[0_0_70%] max-[992px]:[&>*]:[scroll-snap-align:start] max-[576px]:[&>*]:flex-[0_0_88%]' + ' ' + BLEED_MOBILE;

// Guide hub category row: fixed quarter-width cards on desktop that scroll sideways instead of wrapping.
export const GRID_GUIDEHUB =
  'flex max-w-[1200px] mx-auto pb-4 overflow-x-auto overflow-y-hidden ' +
  '[scroll-snap-type:x_mandatory] [touch-action:pan-x_pan-y] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ' +
  'gap-[1.4rem] [&>*]:[scroll-snap-align:start] ' +
  'min-[993px]:[&>*]:flex-[0_0_calc((100%-4.2rem)/4)] max-[992px]:[&>*]:flex-[0_0_70%] max-[576px]:[&>*]:flex-[0_0_80%]' + ' ' + BLEED_MOBILE;

// Slider at every width (guide home), with the shared mobile full-bleed.
export const GRID_SLIDER =
  'flex max-w-[1200px] mx-auto pb-4 overflow-x-auto overflow-y-hidden ' +
  '[scroll-snap-type:x_mandatory] [touch-action:pan-x_pan-y] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ' +
  'min-[993px]:gap-[1.5rem] max-[992px]:gap-4 ' + BLEED_MOBILE + ' ' +
  '[&>*]:[scroll-snap-align:start] min-[993px]:[&>*]:flex-[0_0_300px] max-[992px]:[&>*]:flex-[0_0_70%] max-[576px]:[&>*]:flex-[0_0_80%]';

// Tour-page carousels: each card is one quarter of the container on desktop, extra cards slide.
export const GRID_CAROUSEL_4UP =
  'flex max-w-[1200px] mx-auto mt-[1.6rem] pb-4 overflow-x-auto overflow-y-hidden ' +
  '[scroll-snap-type:x_mandatory] [touch-action:pan-x_pan-y] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ' +
  'min-[993px]:gap-[1.4rem] min-[993px]:[&>*]:flex-[0_0_calc((100%_-_3_*_1.4rem)_/_4)] ' +
  'max-[992px]:gap-[1.4rem] max-[768px]:gap-[0.9rem] ' +
  'max-[992px]:[&>*]:flex-[0_0_70%] max-[576px]:[&>*]:flex-[0_0_88%] [&>*]:[scroll-snap-align:start]' + ' ' + BLEED_MOBILE;

// Homepage reviews: slider at every width with fixed-width cards, so the section height doesn't grow.
export const GRID_REVIEWS =
  'flex max-w-[1200px] mx-auto pb-4 items-stretch overflow-x-auto overflow-y-hidden ' +
  '[scroll-snap-type:x_mandatory] [touch-action:pan-x_pan-y] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ' +
  'min-[993px]:gap-[1.4rem] max-[992px]:gap-4 ' + BLEED_MOBILE + ' ' +
  '[&>*]:[scroll-snap-align:start] [&>*]:flex-none [&>*]:w-[300px] max-[576px]:[&>*]:w-[82%]';

