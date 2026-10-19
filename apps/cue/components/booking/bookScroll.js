const MAX_SCROLL_OFFSET_PX = 160;
const SCROLL_OFFSET_HEIGHT_RATIO = 0.5;

export const BOOK_ON_SCREEN = '.booksidebar, .bookcard__cta, .booknowrow';

export function scrollToBookCard(event) {
  if (event) event.preventDefault();
  const card = document.querySelector('.booksidebar');
  if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function ENOUGH({ height }) {
  return Math.min(MAX_SCROLL_OFFSET_PX, height * SCROLL_OFFSET_HEIGHT_RATIO);
}

export function observeBookCtas(self, onChange) {
  const targets = [...document.querySelectorAll(BOOK_ON_SCREEN)].filter(
    (candidate) => candidate !== self && !(self && self.contains(candidate)),
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
  targets.forEach((target) => observer.observe(target));
  return () => observer.disconnect();
}
