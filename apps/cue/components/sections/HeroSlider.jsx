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

  // Tailwind-native (migrasi Fase 2 + TW-A11 #332): .hero-slider* -> utilities.
  // `.tour-hero__image` own sizing (min-h/bg) now also inlined here directly -
  // its shared CSS rule (style.css) was removed as part of #332, since this is
  // the OTHER place (besides AttractionPage/TourPage/ListingPage) that carries
  // the "tour-hero__image" marker className. `.hero-slider__dots` (dihitung
  // check-detail) dibiarin sbg hook. Fade antar-slide via transition opacity 0.5s.
  const ARROW =
    'w-[30px] h-[30px] flex items-center justify-center border-none rounded-[50%] bg-[rgba(0,0,0,0.3)] p-0 text-white text-[1.25rem] leading-none cursor-pointer hover:bg-[rgba(0,0,0,0.5)]';
  const dotCls = (idx, j) => {
    let c = 'rounded-[50%] shadow-[0_0_2px_rgba(0,0,0,0.4)] transition-[all] duration-200 ease-[ease] ';
    if (idx === cur) c += 'w-[7px] h-[7px] bg-white';
    else if (total > DOT_MAX && ((j === 0 && start > 0) || (j === count - 1 && start + count < total))) c += 'w-[3px] h-[3px] opacity-70 bg-[rgba(255,255,255,0.6)]';
    else c += 'w-[5px] h-[5px] bg-[rgba(255,255,255,0.6)]';
    return c;
  };
  return (
    <div
      className="tour-hero__image min-h-[48vh] bg-green bg-cover bg-center min-[769px]:order-1 min-[769px]:min-h-0 relative overflow-hidden touch-pan-y"
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
          className={`absolute inset-0 bg-cover bg-center transition-[opacity] duration-500 ease-[ease] ${i === cur ? 'opacity-100' : 'opacity-0'}`}
          style={{ backgroundImage: `url(${s.src})` }}
        />
      ))}

      {slides[cur].title && (
        <div className="absolute left-[14px] bottom-[14px] max-[768px]:bottom-[2.6rem] z-[2] max-w-[62%] py-[5px] px-3 rounded-xl bg-[rgba(0,0,0,0.42)] text-white text-small">
          <span className="block overflow-hidden whitespace-nowrap text-ellipsis">{slides[cur].title}</span>
        </div>
      )}

      {total > 1 && (
        <>
          <div className="absolute bottom-[12px] right-[14px] z-[2] hidden gap-1.5 min-[769px]:flex">
            <button type="button" className={ARROW} aria-label="Previous photo" onClick={() => go(cur - 1)}>&lsaquo;</button>
            <button type="button" className={ARROW} aria-label="Next photo" onClick={() => go(cur + 1)}>&rsaquo;</button>
          </div>
          <div className="hero-slider__dots absolute left-0 right-0 bottom-[16px] max-[768px]:left-auto max-[768px]:right-[14px] max-[768px]:bottom-[2.6rem] z-[2] flex justify-center items-center max-[768px]:justify-end gap-1.5 pointer-events-none">
            {Array.from({ length: count }, (_, j) => {
              const idx = start + j;
              return <span className={dotCls(idx, j)} key={idx} />;
            })}
          </div>
        </>
      )}
    </div>
  );
}
