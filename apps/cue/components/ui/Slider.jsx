'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { GRID_SLIDER } from '@/components/ui/gridClasses';

// Slider arrows: hidden on phones, fade in on hover from 993px.
const ARROW =
  'absolute top-[calc(50%-0.5rem)] [transform:translateY(-50%)] z-[5] hidden items-center justify-center w-11 h-11 ' +
  'border-none rounded-[50%] text-[1.7rem] leading-none text-green bg-[rgba(255,255,255,0.96)] ' +
  'cursor-pointer opacity-0 transition-[opacity,background-color,color,scale] duration-200 ease-[ease] ' +
  'min-[993px]:flex min-[993px]:group-hover:opacity-100 hover:bg-gold';

export default function Slider({ children, className = '', gridClassName = GRID_SLIDER }) {
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

  function step(dir) {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector(':scope > *');
    const by = card ? card.getBoundingClientRect().width + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * by, behavior: 'smooth' });
  }

  return (
    <div className={clsx('group relative', className)}>
      <button
        type="button"
        className={`${ARROW} left-[-6px]`}
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
        className={`${ARROW} right-[-6px]`}
        aria-label="Next"
        hidden={!canNext}
        onClick={() => step(1)}
      >
        &rsaquo;
      </button>
    </div>
  );
}
