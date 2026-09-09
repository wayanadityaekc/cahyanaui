'use client';

import { useEffect, useState } from 'react';
import Price from '@/components/Price';
import { WHATSAPP_NUMBER } from '@/lib/constants';

// Sticky price + CTA on mobile. Shows only when neither the hero CTA nor the
// booking card is on screen, exactly as initBookBar did.
export default function BookBar({ item, perPerson = false }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!item) return;
    const cta = document.querySelector('.tour-hero__cta');
    const card = document.querySelector('.booksidebar');
    if (!cta && !card) return;

    let ctaOn = false;
    let formOn = false;
    const sync = () => setShow(!ctaOn && !formOn);

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === cta) ctaOn = e.isIntersecting;
        if (e.target === card) formOn = e.isIntersecting;
      }
      sync();
    });
    if (cta) io.observe(cta);
    if (card) io.observe(card);
    return () => io.disconnect();
  }, [item]);

  if (!item || !show) return null;

  const scrollToCard = (e) => {
    e.preventDefault();
    const card = document.querySelector('.booksidebar');
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Tailwind-native (migrasi #322): family `.book-bar*` -> utilities, CSS dihapus.
  // Mobile-only (max-md:flex, base hidden) sticky bottom bar; komponen cuma mount
  // pas `show` true jadi transform slide-up gak relevan (langsung translate-y-0).
  // Harga: `.price` primitif (dari <Price>) TETAP CSS (color amber) — di sini
  // dibungkus span buat reproduce override `.book-bar .price` (size 1.1rem, weight 600).
  return (
    <div className="fixed inset-x-0 bottom-0 z-[95] hidden max-md:flex items-center justify-between gap-4 py-[0.65rem] px-4 bg-white border-t border-line shadow-[0_-4px_16px_rgba(0,0,0,0.08)] translate-y-0 transition-transform duration-[var(--dur-slow)] ease-[ease]">
      <div className="text-[1rem] text-green">
        <span className="text-muted text-small">from</span>{' '}
        <span className="text-[1.1rem] font-semibold text-amber"><Price name={item} fallback="" /></span>
        <span className="text-muted text-small">{perPerson ? 'per person' : 'per car'}</span>
      </div>
      <div className="flex items-center gap-[0.6rem]">
        <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener" className="inline-flex items-center justify-center w-11 h-11 flex-none rounded-pill bg-[#25d366] text-white no-underline hover:bg-[#1fb757]" aria-label="Chat on WhatsApp">
          <svg className="w-[var(--icon-md)] h-[var(--icon-md)]" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
            <path d="M16 .5C7.4.5.5 7.4.5 16c0 2.8.7 5.5 2.1 7.9L.5 31.5l7.8-2c2.3 1.3 5 1.9 7.7 1.9 8.6 0 15.5-6.9 15.5-15.5S24.6.5 16 .5zm0 28.3c-2.5 0-4.9-.7-7-1.9l-.5-.3-4.6 1.2 1.2-4.5-.3-.5C3.6 20.6 2.9 18.3 2.9 16 2.9 8.8 8.8 2.9 16 2.9c7.2 0 13.1 5.9 13.1 13.1S23.2 28.8 16 28.8zm7.2-9.6c-.4-.2-2.3-1.1-2.7-1.3-.4-.1-.6-.2-.9.2-.3.4-1 1.3-1.2 1.5-.2.2-.4.3-.8.1-.4-.2-1.6-.6-3.1-1.9-1.1-1-1.9-2.2-2.1-2.6-.2-.4 0-.6.2-.8.2-.2.4-.4.5-.7.2-.2.2-.4.4-.6.1-.3 0-.5 0-.7-.1-.2-.9-2.1-1.2-2.9-.3-.7-.6-.6-.9-.7h-.7c-.2 0-.6.1-.9.5-.3.4-1.2 1.2-1.2 2.9s1.2 3.4 1.4 3.6c.2.2 2.4 3.7 5.8 5.1.8.3 1.4.6 1.9.7.8.3 1.5.2 2.1.1.6-.1 2-1 2.3-1.9.3-.9.3-1.7.2-1.9-.1-.1-.3-.2-.7-.4z" />
          </svg>
        </a>
        <a href="#booking" className="py-[0.7rem] px-[1.7rem] rounded-pill bg-cta text-white font-semibold no-underline whitespace-nowrap hover:bg-cta-d" onClick={scrollToCard}>Book now</a>
      </div>
    </div>
  );
}
