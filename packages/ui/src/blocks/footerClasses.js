/**
 * Footer class strings. Kept beside the shell so a site can add a column type
 * the shell does not model (CUE's press logos, its payment chips) and still
 * have it match the columns either side of it.
 *
 * leading-[normal] on the <footer> is the same fix as on the navbar: a site
 * whose <body> sets 1.6 leaks it in here and every row renders ~5px taller
 * than CUE's (a column item 20.5px vs 15px, the bottom bar 41.5px vs 36px).
 *
 * Icon sizes are deliberately small (social circles 22px). The footer is the
 * last thing anyone reads, not somewhere to pull attention.
 */
export const FOOT_ROOT = 'px-6 pt-10 pb-5 leading-[normal] text-green';

// ONE grid row. What makes this footer compact is that nothing gets a
// full-width band of its own, and there is exactly ONE hairline in it - the bar
// above the copyright.
//
// FIVE COLUMNS ON DESKTOP, dropping to two below 900px with the brand block
// spanning the full width. These are the numbers the villa site ships; a
// tablet at 768 does have the width for five, and holding them that far is
// worth measuring if the footer ever feels tall - but that is a change to
// make on purpose, not one to smuggle in here.
export const FOOT_GRID =
  'grid max-w-[1100px] mx-auto gap-x-8 gap-y-9 ' +
  'grid-cols-[1.5fr_0.9fr_1.2fr_0.9fr_1fr] ' +
  'max-[900px]:grid-cols-2 max-[900px]:gap-y-8';

export const FOOT_CONTACT_ITEM = 'flex items-center gap-[0.55rem] text-[0.8rem] text-green opacity-90 no-underline';
export const FOOT_CONTACT_LINK = `${FOOT_CONTACT_ITEM} hover:opacity-100 hover:text-gold`;
export const FOOT_CONTACT_SVG = 'w-4 h-4 shrink-0 text-gold';

export const FOOT_COL_H = 'mb-[0.9rem] font-body text-h3 font-semibold tracking-normal text-gold';
export const FOOT_COL_LI = 'mb-[0.55rem] text-[0.8rem] opacity-[0.85]';
export const FOOT_COL_A = 'no-underline text-green hover:text-gold';

export const FOOT_SOCIAL_A =
  'group flex items-center justify-center w-[22px] h-[22px] rounded-[50%] text-green bg-[rgba(0,0,0,0.06)] hover:text-white hover:bg-gold';

export const FOOT_BOTTOM =
  'max-w-[1100px] mx-auto mt-9 pt-5 [border-top:1px_solid_rgba(0,0,0,0.12)] [border-color:rgba(0,0,0,0.12)] ' +
  'flex flex-wrap items-center justify-between gap-x-6 gap-y-2 ' +
  'max-[700px]:flex-col max-[700px]:text-center';

export const FOOT_BOTTOM_TEXT = 'text-small opacity-70';

// A mark that carries its own colour (Airbnb) cannot use the shared gold hover:
// its red on gold is unreadable. The circle takes the brand colour instead and
// the mark goes white - and the mark is FILLED, so the override is `fill`, not
// `color`.
export const FOOT_SOCIAL_A_AIRBNB =
  'group flex items-center justify-center w-[22px] h-[22px] rounded-[50%] bg-[rgba(0,0,0,0.06)] hover:bg-[#FF5A5F]';
export const FOOT_SOCIAL_ICON_AIRBNB = 'block w-[13px] h-[13px] group-hover:[fill:#fff]';
