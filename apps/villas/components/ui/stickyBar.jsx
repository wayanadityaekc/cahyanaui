// The one thing allowed to stick to the bottom of the screen on mobile.
//
// Ported from CUE's components/ui/stickyBar.jsx, which exists so that every
// page needing a bottom bar draws the SAME shell - a guest sees one bar, in one
// place, whatever page they are on, and never two things stacked at the bottom
// edge. Same rule here: anything that wants a bottom bar imports BAR_SHELL, it
// does not hand-roll its own.
//
// SHAPE DIFFERS FROM CUE ON PURPOSE. CUE's bar is flush to the bottom edge, full
// width, top corners only (the GetYourGuide pattern). This site keeps the
// floating rounded card that was already decided for the villa detail page -
// same system, not the identical look. Consequences of the floating form, which
// are the reverse of CUE's:
//   - It has all four borders and a full radius on screen, so --shadow-xl
//     (which casts DOWNWARD) is the right elevation here; CUE has to point its
//     shadow up because a flush bar hides everything below it.
//   - `bottom-4` already clears the iPhone home indicator, so there is no
//     env(safe-area-inset-bottom) here. Switch to the flush shell and that has
//     to come back, or the CTA lands under the indicator.
//
// `stickybar` is the marker class, kept identical to CUE's: it is the hook a
// page uses to reserve room at the bottom so the last of the content is not
// covered, and the hook a test harness uses to assert only ONE bar is mounted.
export const BAR_MARK = 'stickybar';

// The bar's resting position and look. Visibility is the caller's business: it
// pairs this with a `translate-y-0` / `translate-y-[150%]` toggle.
//
// NOTE the plain `transition-transform` keyword rather than an arbitrary
// `transition-[transform]`. In Tailwind v4, `translate-y-*` compiles to the
// STANDALONE `translate:` property, not to `transform:` - so a transition that
// names only `transform` animates nothing and the bar jumps. The keyword form
// expands to `transform,translate,scale,rotate`, which covers it. This has bitten
// CUE in five places; there it is now held down by a CI gate (check-motion).
export const BAR_SHELL =
  `${BAR_MARK} fixed left-4 right-4 bottom-4 z-40 lg:hidden ` +
  'transition-transform duration-300 ease-out';

// The card inside the shell: surface, border, elevation, and the row layout.
// rounded-lg, not rounded-xl: the bar previously used Tailwind's default
// `rounded-2xl` (16px). Defining --radius-* in @theme does not clear Tailwind's
// own radius scale, so rounded-2xl kept resolving to the stock 16px while
// rounded-xl resolves to this project's --r-xl (22px). --r-lg IS 16px, so
// rounded-lg is both on-token and pixel-identical to what shipped. Same story
// for the shadow: shadow-xl already resolved to our --shadow-xl, spelled out
// here so the whole shell reads from tokens.
export const BAR_CARD =
  'bg-white rounded-lg [border:1px_solid_var(--line)] [box-shadow:var(--shadow-xl)] ' +
  'flex items-center justify-between gap-3 px-4 py-3';
