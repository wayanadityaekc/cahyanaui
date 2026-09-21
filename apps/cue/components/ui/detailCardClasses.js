// The card + sticky pill track every detail page's content sits in. Extracted from
// DetailTabs so the guide articles can use the exact same shell (Sep 2026, Wayan:
// "tab nya buat seperti tab tour, layout kontenya juga, se mirip mungkin").
//
// CARD: white panel, centred, narrower padding on small phones. It now wears the
// SAME edge as the inline price row above it (Wayan, Sep 2026: "container kontenya
// style kayak container harga, radius nya dan hilangin shadownya") - --r-md corners
// and a hairline --color-line border, no shadow. The inset edge shadow it used to
// carry is gone, and so is the separate smaller radius under 560px: one radius at
// every width, matching the row.
//
// STRIP: the sticky wrapper - its pt-[10px] bakes the breathing room in as
// OPAQUE padding (bg-white) rather than an empty gap, so nothing peeks through once
// the strip is stuck. TRACK: one elongated pill holding the segments (Wayan, 14 Sep
// 2026: "1 box memanjang dengan border radius, bukan pill kecil-kecil") - same
// pattern as BookingForm's Standard/Exclusive toggle. w-full + flex-1 segments so the
// opaque track spans the whole row; a narrower row would let content scroll through
// beside it.
export const CARD =
  'bg-white rounded-md [border:1px_solid_var(--color-line)] px-6 pt-6 pb-8 ' +
  'max-[560px]:px-4 max-[560px]:pt-5 max-[560px]:pb-[1.6rem]';
export const CARD_WRAP = 'max-w-[1000px] mt-5 mx-auto max-[560px]:mt-4';
export const STRIP = 'sticky top-[var(--header-h,52.8px)] min-[769px]:top-[var(--header-h,57.6px)] z-20 pt-[10px] bg-white';
export const TRACK = 'mb-6 flex w-full gap-1 p-1 rounded-md bg-[rgba(34,32,28,0.08)]';
export const segment = (on) =>
  `flex-1 text-center whitespace-nowrap font-body text-small font-semibold border-none rounded-sm py-[0.55rem] px-2 cursor-pointer transition-[background-color,color,scale] duration-[var(--dur-fast)] ease-[ease] ${on ? 'bg-gold text-white' : 'bg-transparent text-muted hover:text-green'}`;
// Section inside the card: spacing + a hairline between siblings.
export const SEC =
  'pt-6 [scroll-margin-top:120px] [&+&]:mt-6 [&+&]:[border-top:1px_solid_var(--line)] [&_.stops]:p-0 [&_.stop]:max-w-none';
export const SEC_H = 'text-h2 font-semibold text-gold m-0 mb-4';
