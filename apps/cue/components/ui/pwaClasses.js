// App mode, in two strings. Everything that changes when the site is opened from
// the home screen is built from these, so the condition lives in one place.
//
// THE STRINGS ARE WRITTEN OUT IN FULL, AND THEY HAVE TO BE. Tailwind scans source
// TEXT, so a class assembled by interpolation is never generated - the first cut
// of this file built them from a `PHONE` constant and neither one compiled: the
// bar stayed display:none in app mode and the navbar never handed anything over,
// with no error anywhere. The same trap is already written down in CLAUDE.md for
// GRID_COLS / GRID_COLS_HALF. If a third variant is ever needed, copy the line.
//
// Both are scoped to phone width on purpose. A desktop PWA install (Chrome can do
// it) keeps the full navbar and gets no bottom bar: the navbar is not short of
// room there, and moving its icons away would leave nothing in their place.
// `max-[993px]` is width < 993, i.e. up to and including 992 - the same boundary
// BookBar uses (see the Tailwind v4 note in stickyBar.jsx).

// Shown ONLY in app mode on a phone.
export const APP_ONLY = 'hidden standalone:max-[993px]:flex';

// Hidden in app mode on a phone - used by the navbar icons whose job the bottom
// bar takes over. In a browser tab nothing changes.
//
// `!hidden`, NOT `hidden`: this string is added NEXT TO the display utility the
// element already carries (the navbar icons are `inline-flex`), and two display
// utilities have identical specificity - the winner would be decided by Tailwind's
// compile order rather than by intent. That is the trap CLAUDE.md records twice
// already (BTN_SM next to old geometry, rail w-[248px] next to w-[200px]).
export const APP_HIDE = 'standalone:max-[993px]:!hidden';
