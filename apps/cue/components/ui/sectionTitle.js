// Shared section-heading utility strings (B-FINAL): mirror of the old `.section__title`
// primitive (base rule + the later "Tier display" override that set font-head/500/
// -0.01em). Used across every page's section headings. Context variants (left-align,
// lhead 1.5rem, aphead margin, tour-layout JS transform, --sub) are applied at the
// usage site with `!` overrides.
//
// NO UNDERLINE BAR (Sep 2026, Wayan: "hilangin garis di bawah semua title section
// bro ... semua page yang ada itu hapus aja bro kita gak pakai garis itu lagi").
// Every section title used to carry a 48x3 gold `::after` bar 10px below it. It is
// gone everywhere, along with the two other places that drew their own version of
// it - see ui/carouselSection.js and ui/itnClasses.js. `relative` went with it: it
// was only ever there to be the bar's containing block.

// Everything except font-size + margin (so --sub can swap size/add margin-top).
const ST_CORE = 'font-head font-medium tracking-[-0.01em] text-center text-gold leading-[var(--lh-heading)]';

// .section__title
export const SECTION_TITLE = `${ST_CORE} mb-8 text-h2`;

// .section__title.section__title--sub — smaller (h3), extra top gap.
export const SECTION_TITLE_SUB = `${ST_CORE} mb-8 text-h3 mt-[2.75rem]`;

// Left-align variant (guide-home / reviews / guide-article sub). It used to also
// shove the centred underline back to the left edge; with no underline left it is
// just the alignment. Append after the base string.
export const ST_LEFT = '!text-left';
