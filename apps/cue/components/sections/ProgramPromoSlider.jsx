'use client';
import { BTN_SM } from '@/components/ui/btnClasses';

import { useEffect, useRef, useState } from 'react';
import { PROGRAM_PROMO } from '@/content/shared/programPromo';

const AUTO_MS = 3000;

// Cross-sell band for listing pages (Sep 2026, item #5): same "dark band, bg photo,
// kicker/title/lead/CTA" shape as the homepage Airport section, but auto-slides
// through every program every 3s. Stacked-slide crossfade (same technique as
// HeroSlider, already verified) rather than transitioning `background-image`
// directly - that property doesn't animate smoothly across browsers.
// Any manual interaction (swipe, arrow, dot) stops the interval for good - the
// user takes over, autoplay doesn't fight them.
export default function ProgramPromoSlider() {
  const slides = PROGRAM_PROMO;
  const [cur, setCur] = useState(0);
  const [auto, setAuto] = useState(true);
  const touch = useRef({ x: 0, y: 0 });

  const total = slides.length;

  useEffect(() => {
    if (!auto || total < 2) return undefined;
    const t = setInterval(() => setCur((c) => (c + 1) % total), AUTO_MS);
    return () => clearInterval(t);
  }, [auto, total]);

  if (!total) return null;

  const go = (n) => {
    setAuto(false);
    setCur((n + total) % total);
  };

  // Arrows are desktop hover-only (site convention: mobile navigates by swipe/dots,
  // not visible arrows - showing them always on mobile overlapped the centered text).
  const ARROW =
    'absolute top-1/2 -translate-y-1/2 z-[2] w-9 h-9 flex items-center justify-center border-none rounded-[50%] bg-[rgba(0,0,0,0.32)] text-white text-[1.4rem] leading-none cursor-pointer opacity-0 transition-[opacity,scale] duration-200 ease-[ease] group-hover:opacity-100 hover:bg-[rgba(0,0,0,0.52)] max-[768px]:hidden';

  return (
    <section
      className="group relative overflow-hidden min-h-[320px] text-white touch-pan-y"
      aria-roledescription="carousel"
      aria-label="Other Cahyana programs"
      onTouchStart={(e) => {
        touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - touch.current.x;
        const dy = e.changedTouches[0].clientY - touch.current.y;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(cur + (dx < 0 ? 1 : -1));
      }}
    >
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ease-[ease] ${i === cur ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          style={{ backgroundImage: `url(/assets/images/${s.img})` }}
          aria-hidden={i !== cur}
        >
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,19,15,0.55),rgba(20,19,15,0.74))]" />
          <div className="relative z-[1] flex flex-col items-center justify-center h-full text-center px-6 py-12">
            <div className="max-w-[560px]">
              <span className="block mb-[0.55rem] text-label tracking-[0.14em] uppercase font-medium text-gold-l">{s.kicker}</span>
              <h2 className="mt-0 mb-[0.7rem] font-head text-h2 font-medium tracking-[-0.01em] leading-[1.15]">{s.title}</h2>
              <p className="mx-auto mt-0 mb-[1.3rem] max-w-[46ch] text-body leading-[1.6] text-[rgba(247,243,234,0.85)]">{s.text}</p>
              <a
                href={s.href}
                className={`inline-flex ${BTN_SM} bg-cta text-white no-underline transition-[color,background-color,border-color,scale] duration-200 ease-in-out hover:bg-cta-d`}
              >
                {s.cta}
              </a>
            </div>
          </div>
        </div>
      ))}

      {total > 1 && (
        <>
          <button type="button" className={`${ARROW} left-3`} aria-label="Previous program" onClick={() => go(cur - 1)}>
            &lsaquo;
          </button>
          <button type="button" className={`${ARROW} right-3`} aria-label="Next program" onClick={() => go(cur + 1)}>
            &rsaquo;
          </button>
          <div className="absolute left-0 right-0 bottom-3 z-[2] flex justify-center items-center gap-[6px]">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Go to ${s.kicker}`}
                aria-current={i === cur}
                onClick={() => go(i)}
                className={`rounded-[50%] transition-[all] duration-200 ease-[ease] ${i === cur ? 'w-[7px] h-[7px] bg-white' : 'w-[5px] h-[5px] bg-[rgba(255,255,255,0.6)]'}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
