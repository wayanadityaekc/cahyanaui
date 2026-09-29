// Shared listing layout strings: category section wrapper and its grid of ListingRow cards.

// Category section: width matches the wide container minus page padding, so the grid lines up; do not add --container-x.
export const CATSEC =
  'relative max-w-[calc(var(--container)-2*var(--container-x))] mx-auto pt-[var(--space-5)] pb-[var(--space-2)] text-left scroll-mt-[120px]';

// .lrow-list — mobile: single column stack; desktop (>=769): 4-col grid.
export const LROW_LIST =
  'flex flex-col gap-[14px] min-[769px]:grid min-[769px]:grid-cols-[repeat(4,1fr)] min-[769px]:gap-[18px]';
