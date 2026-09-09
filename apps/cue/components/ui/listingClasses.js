// Shared listing-layout utility strings (B-FINAL): the category section wrapper +
// its row/grid of ListingRow cards, used by ListingPage and AllPrograms. Mirror 1:1
// of the old `.catsec` / `.lrow-list` CSS. The old `.catsec .experience__grid--home4`
// grid rules were dead (listing switched to `.lrow-list`), removed with the family.

// .catsec — category section: relative, container-width (minus 2x page padding so the
// grid lines up with the wide container), centered, vertical rhythm, left-aligned.
// (The old `@media(max-width:768px) .catsec{padding:1.8rem 0 0.8rem}` was source-order
// dead — the later base `.catsec` rule overrode it at equal specificity — so it never
// applied; padding is always space-5/space-2. Not reproduced.)
export const CATSEC =
  'relative max-w-[calc(var(--container)-2*var(--container-x))] mx-auto pt-[var(--space-5)] pb-[var(--space-2)] text-left scroll-mt-[120px]';

// .lrow-list — mobile: single column stack; desktop (>=769): 4-col grid.
export const LROW_LIST =
  'flex flex-col gap-[14px] min-[769px]:grid min-[769px]:grid-cols-[repeat(4,1fr)] min-[769px]:gap-[18px]';
