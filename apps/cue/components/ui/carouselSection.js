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

export const CAROUSEL_TITLE =
  "font-body font-semibold text-h3 leading-[var(--lh-heading)] text-green m-0 " +
  "[&::after]:content-[''] [&::after]:block [&::after]:w-12 [&::after]:h-[3px] [&::after]:rounded-[2px] [&::after]:bg-gold [&::after]:mt-2";
