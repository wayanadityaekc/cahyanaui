export const BOOK_ON_SCREEN = '.booksidebar, .bookcard__cta, .booknowrow';

export function scrollToBookCard(e) {
  if (e) e.preventDefault();
  const card = document.querySelector('.booksidebar');
  if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function ENOUGH({ height }) {
  return Math.min(160, height * 0.5);
}

export function observeBookCtas(self, onChange) {
  const targets = [...document.querySelectorAll(BOOK_ON_SCREEN)].filter(
    (t) => t !== self && !(self && self.contains(t)),
  );
  if (!targets.length) return undefined;
  const onScreen = new Set();
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRect.height >= ENOUGH(entry.boundingClientRect))
          onScreen.add(entry.target);
        else onScreen.delete(entry.target);
      });
      onChange(onScreen.size > 0);
    },
    { threshold: [0, 0.05, 0.1, 0.2, 0.35, 0.5, 0.75, 1] },
  );
  targets.forEach((t) => observer.observe(t));
  return () => observer.disconnect();
}
