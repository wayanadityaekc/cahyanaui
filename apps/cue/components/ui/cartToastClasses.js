// Shared "Added to My Trips" toast utility string (B-FINAL full-Tailwind). 1:1 mirror
// of the old `.cart-toast` base rule. Note: the React port shows/hides the toast by
// conditional render (`{toast && ...}`), never by toggling a `.show` class, so the old
// `.cart-toast.show` and `.cart-toast svg` rules were dead (never matched) and are not
// reproduced. The base keeps opacity-0 exactly as before — see BookCta/BookSidebar.
export const CART_TOAST =
  'fixed left-1/2 bottom-6 [transform:translateX(-50%)_translateY(20px)] inline-flex ' +
  'items-center gap-2 bg-green text-white py-[0.7rem] px-[1.2rem] rounded-[var(--r-pill)] ' +
  'text-[1rem] font-semibold shadow-[var(--shadow-lg)] opacity-0 pointer-events-none ' +
  '[transition:opacity_var(--dur)_ease,transform_var(--dur)_ease] z-[300]';
