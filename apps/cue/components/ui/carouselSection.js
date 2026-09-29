// Section chrome shared by the two tour-page card carousels; pair with GRID_RELATED.
export const CAROUSEL_SECTION =
  'relative max-w-[1200px] mx-auto py-[var(--space-5)] px-[var(--space-3)] text-left ' +
  'max-[768px]:pt-8 max-[768px]:px-[1.1rem] max-[768px]:pb-[2.4rem] ' +
  'before:content-[""] before:absolute before:top-0 before:left-1/2 before:[transform:translateX(-50%)] ' +
  'before:w-[min(1100px,90%)] before:h-px before:bg-[rgba(34,32,28,0.4)]';

// pb-[11px] replaces the removed title bar's space; must be padding, a margin here collapses.
export const CAROUSEL_TITLE =
  'font-body font-semibold text-h3 leading-[var(--lh-heading)] text-green m-0 pb-[11px]';
