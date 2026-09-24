// Booking-detail 2-column layout (B-FINAL). Consumed by TourPage + AttractionPage.
// The `tour-layout--book` marker class is KEPT (check-detail gate requires it). The
// tour-layout always sits immediately after the .tour-hero section, so the base
// "sheet rise" (negative margin / top radius / shadow) is always overridden off by
// `.tour-hero + .tour-layout--book` — the effective (sheet-off) values are baked here,
// and that adjacency rule + the .tour-layout* CSS are removed.
export const TOUR_LAYOUT_BOOK =
  'tour-layout--book relative z-[2] mt-0 pt-[1.6rem] px-[max(var(--container-x),calc((100%_-_1280px)_/_2))] pb-12 ' +
  'bg-white rounded-none [box-shadow:none] min-[993px]:flex min-[993px]:items-start min-[993px]:gap-[2.2rem]';
export const TOUR_LAYOUT_MAIN = 'min-[993px]:flex-[1_1_auto] min-[993px]:min-w-0';
export const TOUR_LAYOUT_SIDE =
  'min-[993px]:flex-[0_0_34%] min-[993px]:max-w-[380px] min-[993px]:sticky min-[993px]:top-[104px] ' +
  'min-[993px]:mt-[var(--side-offset,0)] max-[992px]:mt-[1.2rem]';
