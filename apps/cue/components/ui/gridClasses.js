// Card-grid engine -> utilities (B-FINAL, overriding the "keep as scoped CSS" note).
// One string per context, each self-contained: the `[&>*]:` child sizing replaces
// the old `.experience__grid > *` direct-child rules, breakpoints mirror the @media.
// Base 5-col grid was always overridden per context, so it isn't reproduced.

// FULL-BLEED DI HP (Sep 2026, Wayan: "buat slidernya full width screen kayak di
// slider guide, ubah semua"). Track-nya keluar dari padding kiri-kanan container
// dan lari ke dua tepi layar; kartu pertama tetep di-inset 1rem.
//
// Pakai `calc(50% - 50vw)`, BUKAN `-mx-6` kayak versi lama slider guide: padding
// container-nya beda-beda (24px di homepage & halaman guide, ~18px di dalam layout
// booking, 49px di dalam panel charter), jadi angka mati bakal nyisain celah di
// sebagian tempat dan kelewatan di sebagian lain. `50%` di margin ngukur ke LEBAR
// CONTAINING BLOCK, jadi rumus ini otomatis pas asal container-nya ke-center -
// dan semua container di web ini ke-center.
//
// CUMA DI HP (`max-[992px]`), sama kayak slider guide dulu: di desktop sebagian
// grid ini malah jadi grid (GRID_XPLORE/GRID_GUIDEMORE) dan sebagian lagi sengaja
// dipatok selebar container (kartu 4-up GRID_CAROUSEL_4UP/GRID_GUIDEHUB).
//
// `pr-4` itu SATU-SATUNYA yang beda dari slider guide yang lama: tanpa itu kartu
// terakhir nempel mentok ke tepi kanan pas di-scroll habis, keliatan kepotong.
export const BLEED_MOBILE =
  'max-[992px]:[margin-inline:calc(50%_-_50vw)] max-[992px]:pl-4 max-[992px]:pr-4 ' +
  'max-[992px]:[scroll-padding-left:1rem]';

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
  'max-[992px]:[&>*]:flex-[0_0_70%] max-[992px]:[&>*]:[scroll-snap-align:start] max-[576px]:[&>*]:flex-[0_0_88%]' + ' ' + BLEED_MOBILE;

// .related .experience__grid--home4 (detail-page "You might also like"):
// Wayan (14 Sep 2026) wanted this reusing the homepage card sizing - desktop
// is now a fixed 4-column grid (Related.jsx always renders exactly 4 picks or
// nothing, so no wrap/auto-fill needed, unlike GRID_XPLORE) with the SAME
// container width + gap as GRID_XPLORE, giving pixel-identical card width;
// mobile mirrors GRID_XPLORE's slider steps too (was a related-only 80% card).
export const GRID_RELATED =
  'max-w-[1200px] mx-auto mt-[1.6rem] pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ' +
  'min-[993px]:grid min-[993px]:grid-cols-4 min-[993px]:gap-[1.4rem] min-[993px]:overflow-visible min-[993px]:[&>*]:flex-none ' +
  'max-[992px]:flex max-[992px]:overflow-x-auto max-[992px]:overflow-y-hidden max-[992px]:[scroll-snap-type:x_mandatory] max-[992px]:[touch-action:pan-x_pan-y] max-[992px]:gap-[1.4rem] max-[768px]:gap-[0.9rem] ' +
  'max-[992px]:[&>*]:flex-[0_0_70%] max-[992px]:[&>*]:[scroll-snap-align:start] max-[576px]:[&>*]:flex-[0_0_88%]' + ' ' + BLEED_MOBILE;

// .guide-more .experience__grid--home4 (guide "you might also like" / "see our tours"):
// like xplore (desktop grid wrap, mobile slider) but base gap + 80% mobile card (not .home).
export const GRID_GUIDEMORE =
  'max-w-[1200px] mx-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ' +
  'min-[993px]:grid min-[993px]:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] min-[993px]:gap-[1.4rem] min-[993px]:overflow-visible min-[993px]:[&>*]:flex-none ' +
  'max-[992px]:flex max-[992px]:overflow-x-auto max-[992px]:overflow-y-hidden max-[992px]:[scroll-snap-type:x_mandatory] max-[992px]:[touch-action:pan-x_pan-y] max-[992px]:gap-4 ' +
  'max-[992px]:[&>*]:flex-[0_0_70%] max-[992px]:[&>*]:[scroll-snap-align:start] max-[576px]:[&>*]:flex-[0_0_80%]' + ' ' + BLEED_MOBILE;

// GuideHub category grid (guide hub page, Sep 2026 - Wayan): FIXED 4 columns visible
// on desktop, always sized as 1/4 of the container regardless of how many cards a
// category has today - a 5th+ card overflows and is reached by scrolling sideways
// (snap), it does NOT wrap to a new row. Mobile: same slider pattern as GRID_SLIDER
// (70/80% card, swipe).
export const GRID_GUIDEHUB =
  'flex max-w-[1200px] mx-auto pb-4 overflow-x-auto overflow-y-hidden ' +
  '[scroll-snap-type:x_mandatory] [touch-action:pan-x_pan-y] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ' +
  'gap-[1.4rem] [&>*]:[scroll-snap-align:start] ' +
  'min-[993px]:[&>*]:flex-[0_0_calc((100%-4.2rem)/4)] max-[992px]:[&>*]:flex-[0_0_70%] max-[576px]:[&>*]:flex-[0_0_80%]' + ' ' + BLEED_MOBILE;

// .experience__grid--slider (GuideHub + GuideHome sliders): slider every breakpoint,
// with the mobile full-bleed (-mx-6 + pl-4) the --slider @992 rule adds.
export const GRID_SLIDER =
  'flex max-w-[1200px] mx-auto pb-4 overflow-x-auto overflow-y-hidden ' +
  '[scroll-snap-type:x_mandatory] [touch-action:pan-x_pan-y] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ' +
  'min-[993px]:gap-[1.5rem] max-[992px]:gap-4 ' + BLEED_MOBILE + ' ' +
  '[&>*]:[scroll-snap-align:start] min-[993px]:[&>*]:flex-[0_0_300px] max-[992px]:[&>*]:flex-[0_0_70%] max-[576px]:[&>*]:flex-[0_0_80%]';

// Tour-page carousels ("Destinations you'll visit" + "You might also like").
// A slider at every width, but on desktop each card is sized to exactly one
// column of the old 4-up grid - calc((100% - 3 gaps) / 4) - so four fill the
// container and anything past that slides instead of wrapping to a second row
// (Wayan, Sep 2026). Mobile sizing is GRID_RELATED's, unchanged.
export const GRID_CAROUSEL_4UP =
  'flex max-w-[1200px] mx-auto mt-[1.6rem] pb-4 overflow-x-auto overflow-y-hidden ' +
  '[scroll-snap-type:x_mandatory] [touch-action:pan-x_pan-y] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ' +
  'min-[993px]:gap-[1.4rem] min-[993px]:[&>*]:flex-[0_0_calc((100%_-_3_*_1.4rem)_/_4)] ' +
  'max-[992px]:gap-[1.4rem] max-[768px]:gap-[0.9rem] ' +
  'max-[992px]:[&>*]:flex-[0_0_70%] max-[576px]:[&>*]:flex-[0_0_88%] [&>*]:[scroll-snap-align:start]' + ' ' + BLEED_MOBILE;

// Charter builder's plan cards. Slider on the phone, plain 3-up grid from 769px
// (Wayan, Sep 2026: "untuk mobile ... bisa di slide ke kanan kiri ... di desktop
// tampil biasa gak isi slider").
//
// Cards are a FULL 100% on the phone - no sliver of the next one showing (Wayan:
// "kelihatan 1 card emang bener-bener satu card"). That costs the peek that used
// to hint at the other plans, so CharterBuilder pairs this with explicit left and
// right arrows; without them there is nothing on screen saying more cards exist.
//
// 100% of the track's content box, and the track carries no horizontal padding,
// so one scroll step is exactly one card and a card's edges line up with the rest
// of the panel's content. That is also why this slider takes no BLEED_MOBILE: it
// lives INSIDE the white builder panel, and bleeding it to the viewport would run
// the cards past the panel's own edge and shadow.
//
// items-stretch at every width. A flex row is as tall as its tallest child either
// way, so the slack from the Extended card's extra field exists regardless: the
// only question is where it lands. Stretched, it sits INSIDE the shorter card as
// breathing room above the price, with the button on the card's bottom edge where
// it belongs. Unstretched, the card stops early and the slack becomes an orphan
// gap between the card and the text under the slider, which reads as a bug.
export const GRID_PLANS =
  'flex items-stretch gap-[var(--space-2)] overflow-x-auto overflow-y-hidden ' +
  '[scroll-snap-type:x_mandatory] [touch-action:pan-x_pan-y] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ' +
  '[&>*]:flex-[0_0_100%] [&>*]:[scroll-snap-align:start] ' +
  'min-[769px]:grid min-[769px]:grid-cols-3 min-[769px]:overflow-visible ' +
  'min-[769px]:[&>*]:flex-none';
