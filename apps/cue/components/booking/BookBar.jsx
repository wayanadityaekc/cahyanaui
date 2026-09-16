'use client';

import { MessageCircle } from 'lucide-react';
import Price from '@/components/Price';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import { WHATSAPP_NUMBER } from '@/lib/constants';

// Sticky booking bar, mobile only. Rendered by the page that actually sells
// something (TourPage/AttractionPage pass their bookItem), NOT by the layout -
// Wayan, Sep 2026: "book bar complete beserta button hanya ada di page yang ada
// tombol book now aja". Pages without an item get ChatFab instead, which is
// global. The `bookbar` class is the marker both of those hang off: ChatFab
// hides itself and <body> reserves its bottom padding via :has(.bookbar).
export default function BookBar({ item }) {
  const { displayGuests } = useTripPrefs();

  if (!item) return null;

  const scrollToCard = (e) => {
    e.preventDefault();
    const card = document.querySelector('.booksidebar');
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="bookbar fixed inset-x-0 bottom-0 z-[95] hidden max-md:flex items-center gap-3 py-[0.4rem] pl-4 pr-[0.4rem] bg-white border-t border-line shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
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
      <div className="flex-1 min-w-0 leading-tight">
        <div className="text-muted text-small">{displayGuests} {displayGuests === 1 ? 'guest' : 'guests'}</div>
        <div className="text-[1.1rem] font-semibold text-amber"><Price name={item} fallback="" /></div>
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
