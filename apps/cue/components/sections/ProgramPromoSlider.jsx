'use client';
import { BTN_SM } from '@/components/ui/btnClasses';

import { useEffect, useRef, useState } from 'react';
import { PROGRAM_PROMO } from '@/content/shared/programPromo';

const AUTO_MS = 3000;

export default function ProgramPromoSlider() {
  const slides = PROGRAM_PROMO;
  const [current, setCurrent] = useState(0);
  const [auto, setAuto] = useState(true);
  const touch = useRef({ x: 0, y: 0 });

  const total = slides.length;

  useEffect(() => {
    if (!auto || total < 2) return undefined;
    const intervalId = setInterval(() => setCurrent((currentSlide) => (currentSlide + 1) % total), AUTO_MS);
    return () => clearInterval(intervalId);
  }, [auto, total]);

  if (!total) return null;

  function goTo(slideIndex) {
    setAuto(false);
    setCurrent((slideIndex + total) % total);
  }

  const ARROW =
    'absolute top-1/2 -translate-y-1/2 z-[2] w-9 h-9 flex items-center justify-center border-none rounded-[50%] bg-[rgba(0,0,0,0.32)] text-white text-[1.4rem] leading-none cursor-pointer opacity-0 transition-[opacity,scale] duration-200 ease-[ease] group-hover:opacity-100 hover:bg-[rgba(0,0,0,0.52)] max-[768px]:hidden';

  return (
    <section
      className="group relative overflow-hidden min-h-[320px] text-white touch-pan-y"
      data-promo=""
      aria-roledescription="carousel"
      aria-label="Other Cahyana programs"
      onTouchStart={(event) => {
        touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
      }}
      onTouchEnd={(event) => {
        const deltaX = event.changedTouches[0].clientX - touch.current.x;
        const deltaY = event.changedTouches[0].clientY - touch.current.y;
        if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) goTo(current + (deltaX < 0 ? 1 : -1));
      }}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ease-[ease] ${index === current ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          style={{ backgroundImage: `url(/assets/images/${slide.img})` }}
          aria-hidden={index !== current}
        >
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,19,15,0.55),rgba(20,19,15,0.74))]" />
          <div className="relative z-[1] flex flex-col items-center justify-center h-full text-center px-6 py-12">
            <div className="max-w-[560px]">
              <span className="block mb-[0.55rem] text-label tracking-[0.14em] uppercase font-medium text-gold-l">
                {slide.kicker}
              </span>
              <h2 className="mt-0 mb-[0.7rem] font-head text-h2 font-medium tracking-[-0.01em] leading-[1.15]">
                {slide.title}
              </h2>
              <p className="mx-auto mt-0 mb-[1.3rem] max-w-[46ch] text-body leading-[1.6] text-[rgba(247,243,234,0.85)]">
                {slide.text}
              </p>
              <a
                href={slide.href}
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
          <button
            type="button"
            className={`${ARROW} left-3`}
            aria-label="Previous program"
            onClick={() => goTo(current - 1)}
          >
            &lsaquo;
          </button>
          <button
            type="button"
            className={`${ARROW} right-3`}
            aria-label="Next program"
            onClick={() => goTo(current + 1)}
          >
            &rsaquo;
          </button>
          <div className="absolute left-0 right-0 bottom-3 z-[2] flex justify-center items-center gap-[6px]">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Go to ${slide.kicker}`}
                aria-current={index === current}
                onClick={() => goTo(index)}
                className={`rounded-[50%] transition-[all] duration-200 ease-[ease] ${index === current ? 'w-[7px] h-[7px] bg-white' : 'w-[5px] h-[5px] bg-[rgba(255,255,255,0.6)]'}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
