// Every Book button that hides the sticky bar/inline row when on screen; add any new Book affordance here.
export const BOOK_ON_SCREEN = '.booksidebar, .bookcard__cta, .booknowrow';

// Centre the card, not 'start', so the sticky header does not cover its top.
export function scrollToBookCard(e) {
  if (e) e.preventDefault();
  const card = document.querySelector('.booksidebar');
  if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// A target counts as on screen only when 160px (or half its height if shorter) is visible, not a sliver.
function ENOUGH({ height }) { return Math.min(160, height * 0.5); }

// Reports whether any other Book target is usably on screen, ignoring the caller itself.
export function observeBookCtas(self, onChange) {
  const targets = [...document.querySelectorAll(BOOK_ON_SCREEN)].filter((t) => t !== self && !(self && self.contains(t)));
  if (!targets.length) return undefined;
  const onScreen = new Set();
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRect.height >= ENOUGH(entry.boundingClientRect)) onScreen.add(entry.target);
        else onScreen.delete(entry.target);
      });
      onChange(onScreen.size > 0);
    },
    // Several thresholds so the callback re-fires as the visible slice grows, not only at the edge.
    { threshold: [0, 0.05, 0.1, 0.2, 0.35, 0.5, 0.75, 1] },
  );
  targets.forEach((t) => observer.observe(t));
  return () => observer.disconnect();
}
