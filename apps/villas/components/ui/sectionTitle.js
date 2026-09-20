// Shared section-heading utility strings, mirroring CUE's `.section__title`:
// font-head, weight 500, -0.01em tracking, centred, gold, --lh-heading.
//
// NO UNDERLINE. CUE dropped the little centred gold bar that used to sit under
// its section headings, so the `after:` pseudo-element that drew it is gone
// from here too rather than left behind commented out. ST_LEFT existed only to
// re-anchor that bar when a heading was left-aligned; with no bar to re-anchor
// it is now just the alignment, kept under the same name so the call sites do
// not all have to change.

// Everything except font-size + margin, so the --sub variant can swap the size
// and add its own top gap.
const ST_CORE = 'font-head font-medium tracking-[-0.01em] text-center text-gold leading-[var(--lh-heading)]';

// .section__title
export const SECTION_TITLE = `${ST_CORE} mb-8 text-h2`;

// .section__title--sub — smaller (h3), extra top gap.
export const SECTION_TITLE_SUB = `${ST_CORE} mb-8 text-h3 mt-[2.75rem]`;

// Left-align variant. Append after the base string.
export const ST_LEFT = '!text-left';
