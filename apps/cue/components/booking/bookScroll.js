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

// A sliver does not count. Measured: the sticky bar used to stand down the moment
// the booking card touched the viewport - even by 19px of its bottom edge - which
// left scroll bands with NO Book button anywhere: the bar had hidden, and the card's
// own button was still off screen. One band at each end of the card.
//
// So a target counts as "on screen" only once enough of it is visible to be usable:
// 160px, or half the element when it is shorter than that (the inline price row is
// only ~79px tall, so a flat 160 would never let it count).
const ENOUGH = (rect) => Math.min(160, rect.height * 0.5);

// One observer, shared wiring: report whether anything matching `selector` is on
// screen, ignoring the element that asked (a bar must not hide because of itself).
export function observeBookCtas(self, onChange) {
  const targets = [...document.querySelectorAll(BOOK_ON_SCREEN)].filter((t) => t !== self && !(self && self.contains(t)));
  if (!targets.length) return undefined;
  const onScreen = new Set();
  const io = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        if (en.isIntersecting && en.intersectionRect.height >= ENOUGH(en.boundingClientRect)) onScreen.add(en.target);
        else onScreen.delete(en.target);
      }
      onChange(onScreen.size > 0);
    },
    // Several thresholds so the callback fires as the visible slice grows, not just
    // when the edge crosses: with the default single threshold of 0 the observer
    // would never re-fire while the card slides further in.
    { threshold: [0, 0.05, 0.1, 0.2, 0.35, 0.5, 0.75, 1] },
  );
  targets.forEach((t) => io.observe(t));
  return () => io.disconnect();
}
