// 'Added to My Trips' toast shell; shown by conditional render, and the base stays opacity-0 (see BookCta/BookSidebar).
export const CART_TOAST =
  'fixed left-1/2 bottom-6 [transform:translateX(-50%)_translateY(20px)] inline-flex ' +
  'items-center gap-2 bg-green text-white py-[0.7rem] px-[1.2rem] rounded-md ' +
  'text-[1rem] font-semibold opacity-0 pointer-events-none ' +
  '[transition:opacity_var(--dur)_ease,transform_var(--dur)_ease] z-[300]';
