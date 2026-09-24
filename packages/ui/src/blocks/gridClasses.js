// Card-grid / slider engine. One self-contained utility string per context: the
// `[&>*]:` child sizing does the job CUE's old `.experience__grid > *`
// direct-child CSS rules did, and the breakpoints mirror CUE's @media exactly,
// so a card row on either site lands on the same geometry.
//
// These are CLASS STRINGS, not a <Grid> component, on purpose. A row of cards
// is a `div` with one className; wrapping that in a component buys nothing and
// costs a layer between the page and its own layout. Components earn their
// keep where there is behaviour or a shape to hold together - see Card,
// NavbarShell, StickyBar.
//
// Page-specific tracks do NOT belong here. CUE has several
// (GRID_XPLORE / GRID_GUIDEHUB / GRID_GUIDEMORE / GRID_RELATED) that are tied
// to sections only it has; those stay in the app that uses them.

// FULL-BLEED ON MOBILE. The track breaks out of the container's side padding
// and runs to both screen edges; the first card stays inset by 1rem.
//
// The formula is `margin-inline: calc(50% - 50vw)`, NOT a fixed negative margin
// like `-mx-6`: container padding differs per context (1.5rem desktop, 1rem
// mobile here, and narrower again inside a panel), so a hard number leaves a gap
// in some places and overshoots in others. The `50%` measures against the
// CONTAINING BLOCK's width, so this lands flush anywhere, as long as the
// container is centred - and every container on this site is.
//
// MOBILE ONLY (`max-[992px]`), matching CUE: on desktop some of these tracks are
// meant to be a wrapping grid and others are deliberately pinned to the
// container width so the cards sit 4-up.
//
// `pr-4` is not decoration: without it the last card butts flush against the
// right screen edge when the track is scrolled to the end and reads as cut off.
//
// WATCH OUT for `100vw`: if the browser paints a classic scrollbar, `50vw` is
// wider than half of innerWidth and the page grows sideways. Anything using this
// must be checked with `document.scrollWidth - innerWidth === 0` at every width.
export const BLEED_MOBILE =
  'max-[992px]:[margin-inline:calc(50%_-_50vw)] max-[992px]:pl-4 max-[992px]:pr-4 ' +
  'max-[992px]:[scroll-padding-left:1rem]';


// The MOBILE half of every card row on this site, on its own so a page can
// keep whatever desktop grid it already had and still get CUE's phone
// behaviour. Below 992px a row of cards becomes a full-bleed, snapping,
// swipeable track with the next card peeking in at the right edge — that peek
// is the whole point, it is what tells a guest there is more to the side.
//
// `touch-action: pan-x pan-y` and not `pan-x` alone: with pan-x only, a
// vertical swipe that starts on a card sticks instead of scrolling the page.
export const MOBILE_SLIDER =
  'max-[992px]:flex max-[992px]:overflow-x-auto max-[992px]:overflow-y-hidden ' +
  'max-[992px]:[scroll-snap-type:x_mandatory] max-[992px]:[touch-action:pan-x_pan-y] ' +
  '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden ' +
  'max-[992px]:gap-[1.4rem] max-[768px]:gap-[0.9rem] ' +
  'max-[992px]:[&>*]:flex-[0_0_70%] max-[992px]:[&>*]:[scroll-snap-align:start] ' +
  'max-[576px]:[&>*]:flex-[0_0_88%] ' + BLEED_MOBILE;

// Desktop halves. Each is paired with MOBILE_SLIDER below; they are kept apart
// because `grid-cols-*` and the slider's `flex` both set display, and a page
// that wrote its own `sm:grid-cols-2` (min-width 640) would overlap the
// slider's band (max-width 992) and fight it between 640 and 992px. Every
// desktop rule here starts at 993 so the two never both apply.
const D = 'min-[993px]:grid min-[993px]:gap-[1.4rem] min-[993px]:overflow-visible min-[993px]:[&>*]:flex-none';

// Wrapping grid — auto-fill, NOT auto-fit. With fewer cards than a full row,
// auto-fill leaves the spare columns empty; auto-fit collapses them and
// stretches the cards that are there, which is wrong for a row that happens to
// be short today.
export const GRID_CARDS =
  `max-w-[1200px] mx-auto pb-4 ${D} min-[993px]:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] ${MOBILE_SLIDER}`;

// Fixed-column rows, for a set whose count is known and meant to stay put.
// A SHORT set — two items — so this one STACKS on a phone instead of sliding
// (Wayan, Sep 2026: "buat card villa jadi row menurun, jangan kolom kesamping,
// karna itu terlalu sempit dan villa baru ada 2").
//
// The swipe track is the right call for a row of six destinations, where the
// peeking card says "there is more along here" and no single card matters
// more than the others. With two villas it works against itself: each card
// gets ~88% of a 390px screen instead of the full width, and half the entire
// inventory sits behind a gesture the guest has to discover. Stacked, both
// villas are simply there, each as wide as the screen allows.
//
// Desktop is unchanged: two columns from 993px.
export const GRID_PAIR =
  `max-w-[1200px] mx-auto grid grid-cols-1 gap-[1.4rem] max-[768px]:gap-[0.9rem] ${D} min-[993px]:grid-cols-2`;
export const GRID_TRIO = `max-w-[1200px] mx-auto pb-4 ${D} min-[993px]:grid-cols-3 ${MOBILE_SLIDER}`;
export const GRID_QUAD = `max-w-[1200px] mx-auto pb-4 ${D} min-[993px]:grid-cols-4 ${MOBILE_SLIDER}`;

// A slider at EVERY width: fixed 300px cards on desktop, 70/80% on mobile.
// `touch-action: pan-x pan-y` (not pan-x alone) so a vertical swipe still
// scrolls the page instead of sticking on the track.
export const GRID_SLIDER =
  'flex max-w-[1200px] mx-auto pb-4 overflow-x-auto overflow-y-hidden ' +
  '[scroll-snap-type:x_mandatory] [touch-action:pan-x_pan-y] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ' +
  'min-[993px]:gap-[1.5rem] max-[992px]:gap-4 ' + BLEED_MOBILE + ' ' +
  '[&>*]:[scroll-snap-align:start] min-[993px]:[&>*]:flex-[0_0_300px] max-[992px]:[&>*]:flex-[0_0_70%] max-[576px]:[&>*]:flex-[0_0_80%]';

// Slider at every width, but on desktop each card is sized to exactly one column
// of a 4-up grid - calc((100% - 3 gaps) / 4) - so four fill the container and a
// fifth slides into view instead of wrapping onto a second row.
export const GRID_CAROUSEL_4UP =
  'flex max-w-[1200px] mx-auto mt-[1.6rem] pb-4 overflow-x-auto overflow-y-hidden ' +
  '[scroll-snap-type:x_mandatory] [touch-action:pan-x_pan-y] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ' +
  'min-[993px]:gap-[1.4rem] min-[993px]:[&>*]:flex-[0_0_calc((100%_-_3_*_1.4rem)_/_4)] ' +
  'max-[992px]:gap-[1.4rem] max-[768px]:gap-[0.9rem] ' +
  'max-[992px]:[&>*]:flex-[0_0_70%] max-[576px]:[&>*]:flex-[0_0_88%] [&>*]:[scroll-snap-align:start] ' +
  BLEED_MOBILE;
