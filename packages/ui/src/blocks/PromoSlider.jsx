'use client';

import { useRef, useState } from 'react';
import { BTN_SM } from '../primitives/btnClasses.js';

// Ported from CUE ProgramPromoSlider. No autoplay (Wayan): slides move only on tap, swipe or arrow.
export default function PromoSlider({ slides = [], label = 'Other Cahyana programs', external = false }) {
  const [cur, setCur] = useState(0);
  const touch = useRef({ x: 0, y: 0 });

  const total = slides.length;
  if (!total) return null;

  function goTo(n) {
    setCur((n + total) % total);
  }

  // Only the current slide and its two neighbours load a photo, so the band costs 3 images, not 8.
  function near(i) {
    const gap = Math.abs(i - cur);
    return gap <= 1 || gap === total - 1;
  }

  // Arrows appear on desktop hover only; phones navigate by swipe and dots.
  const ARROW =
    'absolute top-1/2 -translate-y-1/2 z-[2] w-9 h-9 flex items-center justify-center border-none rounded-[50%] bg-[rgba(0,0,0,0.32)] text-white text-[1.4rem] leading-none cursor-pointer opacity-0 transition-[opacity,scale] duration-200 ease-[ease] group-hover:opacity-100 hover:bg-[rgba(0,0,0,0.52)] max-[768px]:hidden';
  const linkProps = external ? { target: '_blank', rel: 'noopener' } : {};

  return (
    <section
      className="group relative overflow-hidden min-h-[320px] text-white touch-pan-y"
      data-promo=""
      aria-roledescription="carousel"
      aria-label={label}
      onTouchStart={(e) => {
        touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }}
      onTouchEnd={(e) => {
        const deltaX = e.changedTouches[0].clientX - touch.current.x;
        const deltaY = e.changedTouches[0].clientY - touch.current.y;
        if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) goTo(cur + (deltaX < 0 ? 1 : -1));
      }}
    >
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ease-[ease] ${i === cur ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          style={near(i) ? { backgroundImage: `url(${slide.img})` } : undefined}
          aria-hidden={i !== cur}
        >
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,19,15,0.55),rgba(20,19,15,0.74))]" />
          <div className="relative z-[1] flex flex-col items-center justify-center h-full text-center px-6 py-12">
            <div className="max-w-[560px]">
              <span className="block mb-[0.55rem] text-label tracking-[0.14em] uppercase font-medium text-white">{slide.kicker}</span>
              <h2 className="mt-0 mb-[0.7rem] font-head text-h2 font-medium text-white tracking-[-0.01em] leading-[1.15]">{slide.title}</h2>
              <p className="mx-auto mt-0 mb-[1.3rem] max-w-[46ch] text-body leading-[1.6] text-white">{slide.text}</p>
              <a
                href={slide.href}
                {...linkProps}
                tabIndex={i === cur ? undefined : -1}
                className={`inline-flex ${BTN_SM} bg-cta text-white no-underline transition-[color,background-color,border-color,scale] duration-200 ease-in-out hover:bg-cta-d`}
              >
                {slide.cta}
              </a>
            </div>
          </div>
        </div>
      ))}

      {total > 1 && (
        <>
          <button type="button" className={`${ARROW} left-3`} aria-label="Previous program" onClick={() => goTo(cur - 1)}>
            &lsaquo;
          </button>
          <button type="button" className={`${ARROW} right-3`} aria-label="Next program" onClick={() => goTo(cur + 1)}>
            &rsaquo;
          </button>
          <div className="absolute left-0 right-0 bottom-3 z-[2] flex justify-center items-center gap-[6px]">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Go to ${slide.kicker}`}
                aria-current={i === cur}
                onClick={() => goTo(i)}
                className={`rounded-[50%] transition-[all] duration-200 ease-[ease] ${i === cur ? 'w-[7px] h-[7px] bg-white' : 'w-[5px] h-[5px] bg-[rgba(255,255,255,0.6)]'}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
