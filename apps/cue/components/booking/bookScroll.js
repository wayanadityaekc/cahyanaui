// Shared between BookBar (sticky, mobile) and BookNowRow (inline, under the hero
// chips). Both point at the same booking card and both have to disappear whenever
// any OTHER Book button is on screen - Wayan's rule, Sep 2026: "gaada booking now
// button double". Keeping the selector and the scroll in one place is what stops
// the two from drifting: add a third Book affordance later and it only has to be
// named here.
export const BOOK_ON_SCREEN = '.booksidebar, .bookcard__cta, .booknowrow';

// `block: 'center'` rather than 'start': the sticky header would otherwise cover
// the top of the card, and centring it puts the price and the date field in view
// together.
export function scrollToBookCard(e) {
  if (e) e.preventDefault();
  const card = document.querySelector('.booksidebar');
  if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// One observer, shared wiring: report whether anything matching `selector` is on
// screen, ignoring the element that asked (a bar must not hide because of itself).
export function observeBookCtas(self, onChange) {
  const targets = [...document.querySelectorAll(BOOK_ON_SCREEN)].filter((t) => t !== self && !(self && self.contains(t)));
  if (!targets.length) return undefined;
  const onScreen = new Set();
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (en.isIntersecting) onScreen.add(en.target);
      else onScreen.delete(en.target);
    }
    onChange(onScreen.size > 0);
  });
  targets.forEach((t) => io.observe(t));
  return () => io.disconnect();
}
