// One sticky bottom bar, shared by the two pages that need one: BookBar on a
// detail page (price + Book now) and SectionSwitcher on a listing (category +
// arrows). Same shell so a guest sees one bar in one place whichever page they
// are on, and only ever one thing stuck to the bottom of the screen.
//
// Chat is NOT in here any more (Sep 2026, Wayan): it moved to the navbar, where
// it is visible on every page and every width without taking a slot at the
// bottom of the screen. The floating chat button went with it.
//
// `stickybar` is the marker <body> reads to reserve the bar's height.
export const BAR_MARK = 'stickybar';

export const BAR_SHELL =
  `${BAR_MARK} fixed left-2 right-2 bottom-1.5 z-[95] hidden max-md:flex items-center gap-3 py-[0.4rem] pl-4 pr-[0.4rem] bg-white border border-line rounded-[var(--r-xl)] shadow-xl`;
