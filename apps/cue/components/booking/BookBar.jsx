'use client';

import { useEffect, useState } from 'react';
import Price from '@/components/Price';
import { BAR_SHELL, BAR_ON, BAR_DIVIDER, BarChat } from '@/components/ui/stickyBar';

// Sticky price + CTA on mobile, rendered by the page that actually sells
// something (TourPage/AttractionPage pass their bookItem). Wayan, Sep 2026:
// - chat leftmost, then the price, then the CTA on the right
// - no guest count in here
// - hidden whenever the booking form is on screen, so its "Book now" and the
//   card's own CTA are never both visible - same rule initBookBar had.
//
// It stays mounted while hidden (slides out instead of unmounting) so the
// reserved body padding doesn't flip; the shell's marker classes are what
// <body> and ChatFab read - see components/ui/stickyBar.jsx.
export default function BookBar({ item, priceFallback }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!item) return;
    // The card holds the second Book button, so the whole card counts as "the
    // form is on screen", not just the button at its bottom.
    const targets = document.querySelectorAll('.booksidebar, .bookcard__cta');
    if (!targets.length) return;

    const onScreen = new Set();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) onScreen.add(e.target);
        else onScreen.delete(e.target);
      }
      setHidden(onScreen.size > 0);
    });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [item]);

  if (!item) return null;

  const scrollToCard = (e) => {
    e.preventDefault();
    const card = document.querySelector('.booksidebar');
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div
      className={`${BAR_SHELL} ${hidden ? '' : `${BAR_ON} `}[transition:translate_var(--dur-slow)_var(--ease),opacity_var(--dur)_var(--ease)] ${
        hidden ? 'translate-y-[150%] opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
      }`}
      inert={hidden || undefined}
    >
      <BarChat />
      <span className={BAR_DIVIDER} aria-hidden="true" />
      <div className="flex-1 min-w-0 text-[1.1rem] font-semibold text-amber leading-none">
        <Price name={item} fallback={priceFallback} />
      </div>
      <a
        href="#booking"
        className="flex-none py-[0.55rem] px-[1.4rem] rounded-pill bg-cta text-white font-semibold no-underline whitespace-nowrap hover:bg-cta-d"
        onClick={scrollToCard}
      >
        Book now
      </a>
    </div>
  );
}
