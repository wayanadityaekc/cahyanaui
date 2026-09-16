'use client';

import { MessageCircle } from 'lucide-react';
import Price from '@/components/Price';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import { useItinerary } from '@/state/ItineraryProvider';
import { useBookBarItem } from '@/state/BookBarProvider';
import { WHATSAPP_NUMBER } from '@/lib/constants';

// Shared size/style for the two mutually-exclusive CTA buttons (Book now /
// Plan your trip) - Wayan: "samain ukuran" - was flex-1 (stretched full width)
// on the fallback button, flex-none (compact) on Book now, so they read as
// two different sizes depending on which page you were on.
const CTA_BTN = 'flex-none py-[0.55rem] px-[1.4rem] rounded-pill bg-cta text-white font-semibold no-underline whitespace-nowrap hover:bg-cta-d';

// Global sticky bar (Sep 2026, Wayan: "muncul di setiap halaman dan setiap
// saat") - mounted once in app/layout.jsx, always visible on mobile, no more
// scroll-gated show/hide. Two content modes depending on whether the current
// page registered a bookable item (BookBarRegister, via BookBarProvider):
// a tour/attraction page shows guests+price+Book now; everywhere else falls
// back to a generic "Plan your trip" CTA. Chat stays in both modes.
export default function BookBar() {
  const { displayGuests } = useTripPrefs();
  const { count } = useItinerary();
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
          <a href="#booking" className={CTA_BTN} onClick={scrollToCard}>Book now</a>
        </>
      ) : (
        <>
          <div className="flex-1 min-w-0 leading-tight">
            {count > 0 ? (
              <>
                <div className="text-muted text-small">Your trip</div>
                <div className="text-[1.1rem] font-semibold text-green">{count} {count === 1 ? 'stop' : 'stops'} planned</div>
              </>
            ) : (
              <>
                <div className="text-muted text-small">Cahyana Ubud Experience</div>
                <div className="text-[0.95rem] font-semibold text-green">Clear pricing, real drivers</div>
              </>
            )}
          </div>
          <a href="/tour.html" className={CTA_BTN}>Plan your trip</a>
        </>
      )}
    </div>
  );
}
