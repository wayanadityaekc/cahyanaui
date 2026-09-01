'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export default function Slider({ children, className = '', gridClassName = 'experience__grid experience__grid--slider' }) {
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const overflowing = el.scrollWidth - el.clientWidth > 4;
    setCanPrev(overflowing && el.scrollLeft > 4);
    setCanNext(overflowing && el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    measure();
    el.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      el.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  const step = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector(':scope > *');
    const by = card ? card.getBoundingClientRect().width + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * by, behavior: 'smooth' });
  };

  return (
    <div className={`slider-holder ${className}`.trim()}>
      <button
        type="button"
        className="slider-arrow slider-arrow--prev"
        aria-label="Previous"
        hidden={!canPrev}
        onClick={() => step(-1)}
      >
        &lsaquo;
      </button>
      <div className={gridClassName} ref={trackRef}>
        {children}
      </div>
      <button
        type="button"
        className="slider-arrow slider-arrow--next"
        aria-label="Next"
        hidden={!canNext}
        onClick={() => step(1)}
      >
        &rsaquo;
      </button>
    </div>
  );
}
