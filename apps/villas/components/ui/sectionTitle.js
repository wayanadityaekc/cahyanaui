// Heading strings mirroring CUE's .section__title, no underline bar; everything except font-size and margin.
const ST_CORE = 'font-head font-medium tracking-[-0.01em] text-center text-gold leading-[var(--lh-heading)]';

// .section__title
export const SECTION_TITLE = `${ST_CORE} mb-8 text-h2`;

// .section__title--sub — smaller (h3), extra top gap.
export const SECTION_TITLE_SUB = `${ST_CORE} mb-8 text-h3 mt-[2.75rem]`;

// Left-align variant, append after the base string (it once re-anchored the dropped underline bar).
export const ST_LEFT = '!text-left';
