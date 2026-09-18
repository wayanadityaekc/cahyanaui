// Shared section-heading utility strings (B-FINAL): mirror of the old `.section__title`
// primitive (base rule + the later "Tier display" override that set font-head/500/
// -0.01em) and its centered `::after` underline. Used across every page's section
// headings. Context variants (left-align, lhead 1.5rem, aphead margin, tour-layout
// JS transform, --sub) are applied at the usage site with `!`/`after:` overrides.
//
// Net of `.section__title` (base 152) + tier (1758): font-head, weight 500,
// tracking -0.01em, center, gold, lh-heading, mb 2rem, size fs-h2; underline ::after
// = centered 48x3 gold bar 10px below.

// Everything except font-size + margin (so --sub can swap size/add margin-top).
const ST_CORE =
  'relative font-head font-medium tracking-[-0.01em] text-center text-gold leading-[var(--lh-heading)] ' +
  "after:content-[''] after:absolute after:left-1/2 after:bottom-[-10px] after:[transform:translateX(-50%)] " +
  'after:w-12 after:h-[3px] after:rounded-[2px] after:bg-gold';

// .section__title
export const SECTION_TITLE = `${ST_CORE} mb-8 text-h2`;

// .section__title.section__title--sub — same underline, smaller (h3), extra top gap.
export const SECTION_TITLE_SUB = `${ST_CORE} mb-8 text-h3 mt-[2.75rem]`;

// Left-align variant (guide-home / reviews / guide-article sub): kill the centered
// underline offset. Append after the base string.
export const ST_LEFT = '!text-left after:!left-0 after:![transform:none]';
