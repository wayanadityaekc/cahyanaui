'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { GRID_SLIDER } from '@/components/ui/gridClasses';

const SCROLL_EDGE_TOLERANCE_PX = 4;
const CARD_GAP_PX = 16;
const TRACK_SCROLL_WIDTH_RATIO = 0.8;

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
    const isOverflowing = track.scrollWidth - track.clientWidth > SCROLL_EDGE_TOLERANCE_PX;
    setCanPrev(isOverflowing && track.scrollLeft > SCROLL_EDGE_TOLERANCE_PX);
    setCanNext(isOverflowing && track.scrollLeft + track.clientWidth < track.scrollWidth - SCROLL_EDGE_TOLERANCE_PX);
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
  }, [measure, children]);

  function step(dir) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector(':scope > *');
    const by = card ? card.getBoundingClientRect().width + CARD_GAP_PX : track.clientWidth * TRACK_SCROLL_WIDTH_RATIO;
    track.scrollBy({ left: dir * by, behavior: 'smooth' });
  }

  return (
    <div className={clsx('group relative', className)}>
      {canPrev && (
        <button type="button" className={`${ARROW} left-[-6px]`} aria-label="Previous" onClick={() => step(-1)}>
          &lsaquo;
        </button>
      )}
      <div className={gridClassName} ref={trackRef}>
        {children}
      </div>
      {canNext && (
        <button type="button" className={`${ARROW} right-[-6px]`} aria-label="Next" onClick={() => step(1)}>
          &rsaquo;
        </button>
      )}
    </div>
  );
}
