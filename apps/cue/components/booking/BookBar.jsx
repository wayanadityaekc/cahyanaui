'use client';

import { useEffect, useState } from 'react';
import Price from '@/components/Price';

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

  // Tailwind-native (migrasi #322, restyled Sep 2026 - Wayan: "jadiin pill panjang
  // yang sticky, hilangin WhatsApp"): dulu bar putih edge-to-edge nempel bawah layar
  // (border-t + shadow ke atas). Sekarang satu pill panjang MENGAMBANG (inset dari
  // 3 sisi + shadow-xl, bukan border) - WhatsApp button dibuang, tinggal harga +
  // Book now. Mobile-only (max-md:flex, base hidden); komponen cuma mount pas `show`
  // true jadi transform slide-up gak relevan (langsung translate-y-0).
  return (
    <div className="fixed left-4 right-4 bottom-4 z-[95] hidden max-md:flex items-center justify-between gap-4 py-[0.5rem] pl-5 pr-[0.5rem] rounded-pill bg-white shadow-xl translate-y-0 transition-transform duration-[var(--dur-slow)] ease-[ease]">
      <div className="text-[1rem] text-green">
        <span className="text-muted text-small">from</span>{' '}
        <span className="text-[1.1rem] font-semibold text-amber"><Price name={item} fallback="" /></span>
        <span className="text-muted text-small">{perPerson ? 'per person' : 'per car'}</span>
      </div>
      <a href="#booking" className="py-[0.7rem] px-[1.7rem] rounded-pill bg-cta text-white font-semibold no-underline whitespace-nowrap hover:bg-cta-d" onClick={scrollToCard}>Book now</a>
    </div>
  );
}
