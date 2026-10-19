'use client';

import { useRef, useState } from 'react';
import { BTN_SM } from '../primitives/btnClasses.js';

export default function PromoSlider({ slides = [], label = 'Other Cahyana programs', external = false }) {
  const [current, setCurrent] = useState(0);
  const touch = useRef({ x: 0, y: 0 });

  const total = slides.length;
  if (!total) return null;

  function goTo(slideIndex) {
    setCurrent((slideIndex + total) % total);
  }

  function near(slideIndex) {
    const gap = Math.abs(slideIndex - current);
    return gap <= 1 || gap === total - 1;
  }

  const linkProps = external ? { target: '_blank', rel: 'noopener' } : {};

  return (
    <section
      className="relative overflow-hidden min-h-[320px] text-white touch-pan-y"
      data-promo=""
      aria-roledescription="carousel"
      aria-label={label}
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
          style={near(index) ? { backgroundImage: `url(${slide.img})` } : undefined}
          aria-hidden={index !== current}
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none mix-blend-multiply [background:linear-gradient(180deg,rgba(214,178,120,0.18),rgba(120,80,40,0.30))]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,19,15,0.55),rgba(20,19,15,0.74))]" />
          <div className="relative z-[1] flex flex-col items-center justify-center h-full text-center px-6 py-12">
            <div className="max-w-[560px]">
              <span className="block mb-[0.55rem] text-small font-medium text-white">{slide.kicker}</span>
              <h2 className="mt-0 mb-[0.7rem] font-head text-h2 font-medium text-white tracking-[-0.01em] leading-[1.15]">
                {slide.title}
              </h2>
              <p className="mx-auto mt-0 mb-[1.3rem] max-w-[46ch] text-body leading-[1.6] text-white">{slide.text}</p>
              <a
                href={slide.href}
                {...linkProps}
                tabIndex={index === current ? undefined : -1}
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
          <div className="absolute left-0 right-0 bottom-3 z-[2] flex justify-center items-center gap-[6px]">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Go to ${slide.kicker}`}
                aria-current={index === current}
                onClick={() => goTo(index)}
                className={`w-[7px] h-[7px] rounded-[50%] transition-[background-color,scale] duration-200 ease-[ease] ${index === current ? 'bg-white' : 'bg-[rgba(255,255,255,0.55)]'}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
