// Card-grid engine -> utilities (B-FINAL, overriding the "keep as scoped CSS" note).
// One string per context, each self-contained: the `[&>*]:` child sizing replaces
// the old `.experience__grid > *` direct-child rules, breakpoints mirror the @media.
// Base 5-col grid was always overridden per context, so it isn't reproduced.

// .xplore .experience__grid--home4 (homepage Explore + Destinations):
// desktop = grid wrap (auto-fill), mobile = slider. On the homepage so >* is 88% @576.
export const GRID_XPLORE =
  'max-w-[1200px] mx-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ' +
  // desktop (>=993): grid wrap
  'min-[993px]:grid min-[993px]:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] min-[993px]:gap-[1.4rem] min-[993px]:overflow-visible min-[993px]:[&>*]:flex-none ' +
  // mobile (<=992): slider
  'max-[992px]:flex max-[992px]:overflow-x-auto max-[992px]:overflow-y-hidden max-[992px]:[scroll-snap-type:x_mandatory] max-[992px]:[touch-action:pan-x_pan-y] max-[992px]:gap-[1.4rem] max-[768px]:gap-[0.9rem] ' +
  'max-[992px]:[&>*]:flex-[0_0_70%] max-[992px]:[&>*]:[scroll-snap-align:start] max-[576px]:[&>*]:flex-[0_0_88%]';
