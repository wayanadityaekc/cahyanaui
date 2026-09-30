// Booking-detail 2-column layout; keep the tour-layout--book marker class, the check-detail gate requires it.
export const TOUR_LAYOUT_BOOK =
  'tour-layout--book relative z-[2] mt-0 pt-[1.6rem] px-[max(var(--container-x),calc((100%_-_1280px)_/_2))] pb-12 ' +
  'bg-surface-raised rounded-none [box-shadow:none] min-[993px]:flex min-[993px]:items-start min-[993px]:gap-[2.2rem]';
export const TOUR_LAYOUT_MAIN = 'min-[993px]:flex-[1_1_auto] min-[993px]:min-w-0';
export const TOUR_LAYOUT_SIDE =
  'min-[993px]:flex-[0_0_34%] min-[993px]:max-w-[380px] min-[993px]:sticky min-[993px]:top-[104px] ' +
  'min-[993px]:mt-[var(--side-offset,0)] max-[992px]:mt-[1.2rem]';
