// One sticky bottom bar, shared by the two pages that need one: BookBar on a
// detail page (price + Book now) and SectionSwitcher on a listing (category +
// arrows). Same shell so a guest sees one bar in one place whichever page they
// are on, and only ever one thing stuck to the bottom of the screen.
//
// Chat is NOT in here any more (Sep 2026, Wayan): it moved to the navbar, where
// it is visible on every page and every width without taking a slot at the
// bottom of the screen. The floating chat button went with it.
//
// SHAPE: flush to the bottom edge, full width, rounded TOP corners only -
// GetYourGuide's pattern, and the third step of the same request ("nempel bawah,
// jangan ngambang tinggi" -> "kira-kira 95% nempel" -> "tempelin di bawah,
// persis kayak GYG"). Notes on what that changes:
//   - No side/bottom inset, so only the top border is on screen; the sides and
//     bottom ones would be drawn off the viewport.
//   - The shadow points UP (negative Y). `--shadow-xl` casts downward, which a
//     bar sitting on the bottom edge hides entirely - same reason the old CSS
//     kept a directional shadow for this bar (see CLAUDE.md, shadow tokens).
//   - `env(safe-area-inset-bottom)` via max(): on an iPhone the home indicator
//     sits in that strip, and a flush bar would otherwise put the CTA under it.
//     It reads 0 everywhere else, so the bar keeps its normal padding there.
//
// `stickybar` is the marker <body> reads to reserve the bar's height.
export const BAR_MARK = 'stickybar';

// UP TO WHICH WIDTH the bar shows is the one thing the two consumers differ on, so
// it is named rather than baked into the shell (Wayan, Sep 2026: "Lebarin bro").
//   - BAR_UPTO_LG (992px) = BookBar. A detail page has no other Book affordance in
//     the 769-992 band: the booking card stacks BELOW the whole tab block there,
//     and it is the same 992 boundary BookNowRow uses, so the two hand over cleanly.
//   - BAR_UPTO_MD (767px) = SectionSwitcher. Widening THIS one would be a bug: the
//     listing pages' segmented tablist is only hidden under 769px, so from 769 up
//     the switcher and the tablist would both be on screen.
// Everything else - shape, colour, border, upward shadow, safe-area padding - stays
// shared, so both bars still look like one bar in one place.
//
// TAILWIND v4 GOTCHA, measured: a `max-[N]` variant compiles to
// `@media not all and (min-width: N)`, which is width STRICTLY LESS THAN N - it does
// NOT include N. `max-[992px]` left the bar missing at exactly 992px even though
// `matchMedia('(max-width: 992px)')` reported true. So the number here is the first
// width the bar should NOT appear at, i.e. one past the intended last one. Same
// reason `max-md` covers up to 767 and the listing tablist (`max-[768px]:hidden`)
// takes over cleanly at 768.
export const BAR_UPTO_MD = 'hidden max-md:flex';
export const BAR_UPTO_LG = 'hidden max-[993px]:flex';

export const BAR_SHELL =
  `${BAR_MARK} fixed inset-x-0 bottom-0 z-[95] items-center gap-3 ` +
  'pt-[0.55rem] pl-[1.1rem] pr-[0.9rem] pb-[max(0.55rem,env(safe-area-inset-bottom))] ' +
  'bg-white [border-top:1px_solid_var(--color-line)] rounded-t-[var(--r-xl)] ' +
  '[box-shadow:0_-6px_22px_rgba(0,0,0,0.08)]';
