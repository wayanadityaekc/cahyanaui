// Every separator line is the --line token; strings are written in full so Tailwind can see them.

// Standalone rule.
export const SEP_H = 'block shrink-0 h-px w-full bg-line';
export const SEP_V = 'block shrink-0 w-px h-full bg-line';

// A line under a list row, none under the last one.
export const ROW_RULE = '[border-bottom:1px_solid_var(--line)] last:[border-bottom:none]';

// A line above every row after the first, for sibling rows without a wrapper list.
export const ROW_RULE_TOP = '[&+&]:[border-top:1px_solid_var(--line)]';

// Header / footer edge of a panel or sheet.
export const RULE_BOTTOM = '[border-bottom:1px_solid_var(--line)]';
export const RULE_TOP = '[border-top:1px_solid_var(--line)]';
