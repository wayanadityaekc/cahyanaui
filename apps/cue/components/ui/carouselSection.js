// Section chrome for the two card carousels that sit side by side at the bottom
// of a tour page: "Destinations you'll visit on this tour" and "You might also
// like". Wayan wants them identical, so the strings live here once instead of
// being inlined in both components and drifting apart (CLAUDE.md: shared style
// goes in a JS module, components keep their own import).
//
// Pair these with GRID_RELATED - desktop 4-up grid, mobile slider - so both
// carousels lay out the same way at every width.
export const CAROUSEL_SECTION =
  'relative max-w-[1200px] mx-auto py-[var(--space-5)] px-[var(--space-3)] text-left ' +
  'max-[768px]:pt-8 max-[768px]:px-[1.1rem] max-[768px]:pb-[2.4rem] ' +
  'before:content-[""] before:absolute before:top-0 before:left-1/2 before:[transform:translateX(-50%)] ' +
  'before:w-[min(1100px,90%)] before:h-px before:bg-[rgba(34,32,28,0.4)]';

// The 48x3 gold bar under this heading is gone with every other one (Sep 2026,
// Wayan: "kita gak pakai garis itu lagi"). It was an in-flow block with mt-2, so
// it carried 11px of the gap down to the cards (8px mt-2 + the 3px bar itself).
// pb-[11px] - that exact sum, not a rounded rem - puts it back INSIDE
// the box - a margin there collapses away and the section came out 11px shorter
// (measured), padding cannot.
export const CAROUSEL_TITLE =
  'font-body font-semibold text-h3 leading-[var(--lh-heading)] text-green m-0 pb-[11px]';
