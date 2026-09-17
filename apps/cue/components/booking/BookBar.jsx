'use client';

import { useEffect, useState } from 'react';
import Price from '@/components/Price';
import { BAR_SHELL } from '@/components/ui/stickyBar';

// Sticky price + CTA on mobile, rendered by the page that actually sells
// something (TourPage/AttractionPage pass their bookItem). Wayan, Sep 2026:
// - chat leftmost, then the price, then the CTA on the right
// - no guest count in here
// - hidden whenever the booking form is on screen, so its "Book now" and the
//   card's own CTA are never both visible - same rule initBookBar had.
//
// It stays mounted while hidden (slides out instead of unmounting) so the
// reserved body padding doesn't flip; `stickybar` is the marker <body> reads for
// that - see components/ui/stickyBar.jsx. Chat lives in the navbar now, not in
// here.
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
      className={`${BAR_SHELL} [transition:translate_var(--dur-slow)_var(--ease),opacity_var(--dur)_var(--ease)] ${
        hidden ? 'translate-y-[150%] opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
      }`}
      inert={hidden || undefined}
    >
      {/* Harga di SINI hitam (`text-gold` = soft black), BUKAN amber - Wayan,
          Sep 2026. Pengecualian yang disengaja dari aturan "semua harga gold":
          di bar ini amber-nya nabrak tombol CTA hijau tepat di sebelahnya.
          Harga di tempat lain (kartu, sidebar, ringkasan) TETAP amber.
          Warnanya WAJIB dioper lewat className-nya <Price> sendiri: default-nya
          (PRICE, amber) nempel LANGSUNG di elemen [data-price], jadi text-gold di
          wrapper kalah. Class `price` tetep dibawa - itu hook, bukan warna. */}
      <div className="flex-1 min-w-0 leading-none">
        <Price
          name={item}
          fallback={priceFallback}
          className="price text-[1.1rem] font-semibold text-gold"
        />
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
