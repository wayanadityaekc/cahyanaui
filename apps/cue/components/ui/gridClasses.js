// Card-grid engine -> utilities (B-FINAL, overriding the "keep as scoped CSS" note).
// One string per context, each self-contained: the `[&>*]:` child sizing replaces
// the old `.experience__grid > *` direct-child rules, breakpoints mirror the @media.
// Base 5-col grid was always overridden per context, so it isn't reproduced.

// Homepage Explore/Destinations SECTION container (was `.xplore` + `.home .xplore`):
// centered container, uniform side padding, left-aligned content. Vertical padding is 0
// (the old .home .xplore rule zeroed it; the homepage --section-gap margins do the spacing).
export const XPLORE_SECTION = 'max-w-[var(--container)] mx-auto px-[var(--container-x)] text-left';

// .xplore .experience__grid--home4 (homepage Explore + Destinations):
// desktop = grid wrap (auto-fill), mobile = slider. On the homepage so >* is 88% @576.
export const GRID_XPLORE =
  'max-w-[1200px] mx-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ' +
  // desktop (>=993): grid wrap
  'min-[993px]:grid min-[993px]:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] min-[993px]:gap-[1.4rem] min-[993px]:overflow-visible min-[993px]:[&>*]:flex-none ' +
  // mobile (<=992): slider
  'max-[992px]:flex max-[992px]:overflow-x-auto max-[992px]:overflow-y-hidden max-[992px]:[scroll-snap-type:x_mandatory] max-[992px]:[touch-action:pan-x_pan-y] max-[992px]:gap-[1.4rem] max-[768px]:gap-[0.9rem] ' +
  'max-[992px]:[&>*]:flex-[0_0_70%] max-[992px]:[&>*]:[scroll-snap-align:start] max-[576px]:[&>*]:flex-[0_0_88%]';

// .related .experience__grid--home4 (detail-page "You might also like"):
// slider at every breakpoint (300px desktop, 70/80% mobile), + margin-top 1.6rem.
export const GRID_RELATED =
  'flex max-w-[1200px] mx-auto mt-[1.6rem] pb-4 overflow-x-auto overflow-y-hidden ' +
  '[scroll-snap-type:x_mandatory] [touch-action:pan-x_pan-y] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ' +
  'min-[993px]:gap-[1.5rem] max-[992px]:gap-4 [&>*]:[scroll-snap-align:start] ' +
  'min-[993px]:[&>*]:flex-[0_0_300px] max-[992px]:[&>*]:flex-[0_0_70%] max-[576px]:[&>*]:flex-[0_0_80%]';

// .guide-more .experience__grid--home4 (guide "you might also like" / "see our tours"):
// like xplore (desktop grid wrap, mobile slider) but base gap + 80% mobile card (not .home).
export const GRID_GUIDEMORE =
  'max-w-[1200px] mx-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ' +
  'min-[993px]:grid min-[993px]:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] min-[993px]:gap-[1.4rem] min-[993px]:overflow-visible min-[993px]:[&>*]:flex-none ' +
  'max-[992px]:flex max-[992px]:overflow-x-auto max-[992px]:overflow-y-hidden max-[992px]:[scroll-snap-type:x_mandatory] max-[992px]:[touch-action:pan-x_pan-y] max-[992px]:gap-4 ' +
  'max-[992px]:[&>*]:flex-[0_0_70%] max-[992px]:[&>*]:[scroll-snap-align:start] max-[576px]:[&>*]:flex-[0_0_80%]';

// .experience__grid--slider (GuideHub + GuideHome sliders): slider every breakpoint,
// with the mobile full-bleed (-mx-6 + pl-4) the --slider @992 rule adds.
export const GRID_SLIDER =
  'flex max-w-[1200px] mx-auto pb-4 overflow-x-auto overflow-y-hidden ' +
  '[scroll-snap-type:x_mandatory] [touch-action:pan-x_pan-y] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ' +
  'min-[993px]:gap-[1.5rem] max-[992px]:gap-4 max-[992px]:-mx-6 max-[992px]:pl-4 max-[992px]:[scroll-padding-left:1rem] ' +
  '[&>*]:[scroll-snap-align:start] min-[993px]:[&>*]:flex-[0_0_300px] max-[992px]:[&>*]:flex-[0_0_70%] max-[576px]:[&>*]:flex-[0_0_80%]';
