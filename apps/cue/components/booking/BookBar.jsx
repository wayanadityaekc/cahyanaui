'use client';

import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import Price from '@/components/Price';
import { WHATSAPP_NUMBER } from '@/lib/constants';

// Sticky price + CTA on mobile, rendered by the page that actually sells
// something (TourPage/AttractionPage pass their bookItem). Wayan, Sep 2026:
// - chat stays leftmost, then the price, then the CTA on the right
// - no guest count in here any more
// - rounded and floating just clear of the bottom edge, not edge-to-edge
// - hidden whenever the booking form is on screen, so its "Book now" and the
//   card's own CTA are never both visible - same rule initBookBar had.
//
// It stays mounted while hidden (slides out instead of unmounting) so the
// reserved body padding doesn't flip; `bookbar-on` is the marker ChatFab reads
// to know the bar is actually showing, and `bookbar` the one <body> reads for
// that padding.
export default function BookBar({ item }) {
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
      className={`bookbar ${hidden ? '' : 'bookbar-on '}fixed left-2 right-2 bottom-1.5 z-[95] hidden max-md:flex items-center gap-3 py-[0.4rem] pl-4 pr-[0.4rem] bg-white border border-line rounded-[var(--r-xl)] shadow-xl [transition:translate_var(--dur-slow)_var(--ease),opacity_var(--dur)_var(--ease)] ${
        hidden ? 'translate-y-[150%] opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
      }`}
      inert={hidden || undefined}
    >
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener"
        className="flex-none flex flex-col items-center gap-[2px] text-green no-underline"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-[18px] h-[18px]" strokeWidth={1.8} />
        <span className="text-[0.6rem] font-medium leading-none">Chat</span>
      </a>
      <span className="w-px self-stretch bg-line flex-none" aria-hidden="true" />
      <div className="flex-1 min-w-0 text-[1.1rem] font-semibold text-amber leading-none">
        <Price name={item} fallback="" />
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
