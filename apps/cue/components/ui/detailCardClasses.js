// The card + sticky pill track every detail page's content sits in. Extracted from
// DetailTabs so the guide articles can use the exact same shell (Sep 2026, Wayan:
// "tab nya buat seperti tab tour, layout kontenya juga, se mirip mungkin").
//
// CARD: white panel with the inset edge shadow, centred, narrower padding on small
// phones. STRIP: the sticky wrapper - its pt-[10px] bakes the breathing room in as
// OPAQUE padding (bg-white) rather than an empty gap, so nothing peeks through once
// the strip is stuck. TRACK: one elongated pill holding the segments (Wayan, 14 Sep
// 2026: "1 box memanjang dengan border radius, bukan pill kecil-kecil") - same
// pattern as BookingForm's Standard/Exclusive toggle. w-full + flex-1 segments so the
// opaque track spans the whole row; a narrower row would let content scroll through
// beside it.
export const CARD =
  'bg-white rounded-xl px-6 pt-6 pb-8 [box-shadow:inset_0_8px_11px_-10px_rgba(34,32,28,0.3),inset_7px_0_9px_-9px_rgba(34,32,28,0.1),inset_-7px_0_9px_-9px_rgba(34,32,28,0.1)] max-[560px]:px-4 max-[560px]:pt-5 max-[560px]:pb-[1.6rem] max-[560px]:rounded-lg';
export const CARD_WRAP = 'max-w-[1000px] mt-5 mx-auto max-[560px]:mt-4';
export const STRIP = 'sticky top-[var(--header-h,52.8px)] min-[769px]:top-[var(--header-h,57.6px)] z-20 pt-[10px] bg-white';
export const TRACK = 'mb-6 flex w-full gap-1 p-1 rounded-pill bg-[rgba(34,32,28,0.08)]';
export const segment = (on) =>
  `flex-1 text-center whitespace-nowrap font-body text-small font-semibold border-none rounded-pill py-[0.55rem] px-2 cursor-pointer transition-[background-color,color,scale] duration-[var(--dur-fast)] ease-[ease] ${on ? 'bg-gold text-white' : 'bg-transparent text-muted hover:text-green'}`;
// Link variant of the track. The tour's 4 segments are short words, so they share the
// row with flex-1; the guide's 5 category names ("About the Island", "People & Culture")
// do not fit a 390px screen that way and get clipped, so this variant sizes each segment
// to its own text and lets the row scroll sideways. Same track, same active pill.
// no-underline because these are <a>, and the site underlines links by default.
export const TRACK_SCROLL =
  TRACK + ' overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden';
export const segmentLink = (on) => segment(on).replace('flex-1', 'flex-none') + ' no-underline px-[0.9rem]';

// Section inside the card: spacing + a hairline between siblings.
export const SEC =
  'pt-6 [scroll-margin-top:120px] [&+&]:mt-6 [&+&]:[border-top:1px_solid_var(--line)] [&_.stops]:p-0 [&_.stop]:max-w-none';
export const SEC_H = 'text-h2 font-semibold text-gold m-0 mb-4';
