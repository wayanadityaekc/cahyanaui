'use client';

import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import Price from '@/components/Price';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import { WHATSAPP_NUMBER } from '@/lib/constants';

// Sticky price + CTA on mobile. Shows only when neither the hero CTA nor the
// booking card is on screen, exactly as initBookBar did.
export default function BookBar({ item }) {
  const { displayGuests } = useTripPrefs();
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

  // Tailwind-native (migrasi #322, restyled Sep 2026 - Wayan: pill panjang sticky
  // dulu punya WhatsApp sbg badge bulat berdiri sendiri (dibuang), sekarang Wayan
  // kirim referensi 3-segmen: Chat (icon+label kecil) | divider | guests+harga |
  // Book now - reuse Lucide MessageCircle yang sama kayak footer, CTA-nya tetep
  // hijau (--color-cta) sesuai standar tombol aksi utama, bukan gold kayak referensi.
  return (
    <div className="fixed left-4 right-4 bottom-4 z-[95] hidden max-md:flex items-center gap-3 py-[0.5rem] pl-[0.9rem] pr-[0.5rem] rounded-pill bg-white shadow-xl translate-y-0 transition-transform duration-[var(--dur-slow)] ease-[ease]">
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
      <a href="#booking" className="flex-none py-[0.7rem] px-[1.7rem] rounded-pill bg-cta text-white font-semibold no-underline whitespace-nowrap hover:bg-cta-d" onClick={scrollToCard}>Book now</a>
    </div>
  );
}
