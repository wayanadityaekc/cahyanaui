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
    const track = trackRef.current;
    if (!track) return;
    const overflowing = track.scrollWidth - track.clientWidth > 4;
    setCanPrev(overflowing && track.scrollLeft > 4);
    setCanNext(overflowing && track.scrollLeft + track.clientWidth < track.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    measure();
    track.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      track.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  function step(dir) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector(':scope > *');
    const by = card ? card.getBoundingClientRect().width + 16 : track.clientWidth * 0.8;
    track.scrollBy({ left: dir * by, behavior: 'smooth' });
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
