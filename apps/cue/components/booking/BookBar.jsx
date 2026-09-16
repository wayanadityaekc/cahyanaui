'use client';

import { MessageCircle } from 'lucide-react';
import Price from '@/components/Price';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import { useBookBarItem } from '@/state/BookBarProvider';
import { WHATSAPP_NUMBER } from '@/lib/constants';

// Global sticky bar (Sep 2026, Wayan: "muncul di setiap halaman dan setiap
// saat") - mounted once in app/layout.jsx, always visible on mobile, no more
// scroll-gated show/hide. Two content modes depending on whether the current
// page registered a bookable item (BookBarRegister, via BookBarProvider):
// a tour/attraction page shows guests+price+Book now; everywhere else falls
// back to a generic "Plan your trip" CTA. Chat stays in both modes.
export default function BookBar() {
  const { displayGuests } = useTripPrefs();
  const { item } = useBookBarItem();

  const scrollToCard = (e) => {
    e.preventDefault();
    const card = document.querySelector('.booksidebar');
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[95] hidden max-md:flex items-center gap-3 py-[0.4rem] pl-4 pr-[0.4rem] bg-white border-t border-line shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
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
      {item ? (
        <>
          <div className="flex-1 min-w-0 leading-tight">
            <div className="text-muted text-small">{displayGuests} {displayGuests === 1 ? 'guest' : 'guests'}</div>
            <div className="text-[1.1rem] font-semibold text-amber"><Price name={item} fallback="" /></div>
          </div>
          <a href="#booking" className="flex-none py-[0.55rem] px-[1.4rem] rounded-pill bg-cta text-white font-semibold no-underline whitespace-nowrap hover:bg-cta-d" onClick={scrollToCard}>Book now</a>
        </>
      ) : (
        <a href="/tour.html" className="flex-1 min-w-0 py-[0.55rem] px-4 rounded-pill bg-cta text-white font-semibold no-underline text-center whitespace-nowrap hover:bg-cta-d">Plan your trip</a>
      )}
    </div>
  );
}
