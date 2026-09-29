'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '../lib/cn.js';
import { GRID_SLIDER } from './gridClasses.js';

// Arrows: hidden on phones (they swipe), fade in on hover from 993px.
const ARROW =
  'absolute top-[calc(50%-0.5rem)] [transform:translateY(-50%)] z-[5] hidden items-center justify-center w-11 h-11 ' +
  'border-none rounded-[50%] text-[1.7rem] leading-none text-green bg-surface-raised ' +
  'cursor-pointer opacity-0 transition-[opacity,background-color,color,scale] duration-200 ease-[ease] ' +
  'min-[993px]:flex min-[993px]:group-hover:opacity-100 hover:bg-gold hover:text-surface-raised';

/**
 * A row of cards that scrolls sideways. The track is whatever class string is
 * passed (GRID_SLIDER by default); this adds the desktop arrows, each shown
 * only while there is more to scroll that way.
 */
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
    if (!track) return undefined;
    measure();
    track.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      track.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, [measure, children]);

  // One card's width per click, so a card never lands half cut.
  function step(dir) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector(':scope > *');
    const by = card ? card.getBoundingClientRect().width + 16 : track.clientWidth * 0.8;
    track.scrollBy({ left: dir * by, behavior: 'smooth' });
  }

  return (
    <div className={cn('group relative', className)}>
      {/* Rendered only when it can move: the hidden attribute loses to the arrow's own flex class. */}
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
