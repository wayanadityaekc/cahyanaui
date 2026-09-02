'use client';

import { useRef, useState } from 'react';

const DOT_MAX = 5;

// Ported from initTourHeroSlider: the hero cycles the page's own stop photos,
// captioned with the short place name. Swipe only reacts to a clearly
// horizontal gesture, so vertical scrolling still works.
export default function HeroSlider({ slides = [] }) {
  const [cur, setCur] = useState(0);
  const touch = useRef({ x: 0, y: 0 });

  if (!slides.length) return null;

  const go = (n) => setCur((n + slides.length) % slides.length);

  const total = slides.length;
  const count = Math.min(DOT_MAX, total);
  const start = total > DOT_MAX ? Math.min(Math.max(cur - 2, 0), total - DOT_MAX) : 0;

  return (
    <div
      className="tour-hero__image hero-slider"
      onTouchStart={(e) => {
        touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - touch.current.x;
        const dy = e.changedTouches[0].clientY - touch.current.y;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? cur + 1 : cur - 1);
      }}
    >
      {slides.map((s, i) => (
        <div
          key={s.src + i}
          className={`hero-slide${i === cur ? ' is-active' : ''}`}
          style={{ backgroundImage: `url(${s.src})` }}
        />
      ))}

      {slides[cur].title && (
        <div className="hero-slider__cap">
          <span className="hero-slider__title">{slides[cur].title}</span>
        </div>
      )}

      {total > 1 && (
        <>
          <div className="hero-slider__arrows">
            <button type="button" className="hero-slider__arrow hero-slider__arrow--prev" aria-label="Previous photo" onClick={() => go(cur - 1)}>&lsaquo;</button>
            <button type="button" className="hero-slider__arrow hero-slider__arrow--next" aria-label="Next photo" onClick={() => go(cur + 1)}>&rsaquo;</button>
          </div>
          <div className="hero-slider__dots">
            {Array.from({ length: count }, (_, j) => {
              const idx = start + j;
              let cls = 'hero-slider__dot';
              if (idx === cur) cls += ' is-active';
              else if (total > DOT_MAX && ((j === 0 && start > 0) || (j === count - 1 && start + count < total))) cls += ' is-edge';
              return <span className={cls} key={idx} />;
            })}
          </div>
        </>
      )}
    </div>
  );
}
