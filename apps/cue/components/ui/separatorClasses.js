// Every line in the site that says "these two things are apart" is drawn from here
// (WO7 fix 1). Colour is ALWAYS the --line token; a hard-coded hex hairline is a bug
// (the audit found 11 different near-line shades before this file existed).
//
// Written out in full, never interpolated - Tailwind only generates class strings it
// can read in the source.

// Standalone rule. shadcn: `h-px w-full bg-border` / `w-px h-full bg-border`.
export const SEP_H = 'block shrink-0 h-px w-full bg-line';
export const SEP_V = 'block shrink-0 w-px h-full bg-line';

// A line under a list row, none under the last one. shadcn: `border-b last:border-b-0`.
export const ROW_RULE = '[border-bottom:1px_solid_var(--line)] last:[border-bottom:none]';

// A line ABOVE every row after the first (for rows that are siblings without a
// wrapper list). Same visual result as ROW_RULE, opposite side.
export const ROW_RULE_TOP = '[&+&]:[border-top:1px_solid_var(--line)]';

// Header / footer edge of a panel or modal section.
export const RULE_BOTTOM = '[border-bottom:1px_solid_var(--line)]';
export const RULE_TOP = '[border-top:1px_solid_var(--line)]';
