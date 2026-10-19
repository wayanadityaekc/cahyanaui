'use client';

import { useRef, useState } from 'react';

const DOT_MAX = 5;

export default function HeroSlider({ slides = [] }) {
  const [current, setCurrent] = useState(0);
  const touch = useRef({ x: 0, y: 0 });

  if (!slides.length) return null;

  function goTo(slideIndex) {
    return setCurrent((slideIndex + slides.length) % slides.length);
  }

  const total = slides.length;
  const count = Math.min(DOT_MAX, total);
  const start = total > DOT_MAX ? Math.min(Math.max(current - 2, 0), total - DOT_MAX) : 0;

  const ARROW =
    'w-[30px] h-[30px] flex items-center justify-center border-none rounded-[50%] bg-[rgba(0,0,0,0.3)] p-0 text-white text-[1.25rem] leading-none cursor-pointer hover:bg-[rgba(0,0,0,0.5)]';
  function dotCls(index, dotIndex) {
    let dotClassName = 'rounded-[50%] shadow-[0_0_2px_rgba(0,0,0,0.4)] transition-[all] duration-200 ease-[ease] ';
    if (index === current) dotClassName += 'w-[7px] h-[7px] bg-white';
    else if (total > DOT_MAX && ((dotIndex === 0 && start > 0) || (dotIndex === count - 1 && start + count < total)))
      dotClassName += 'w-[3px] h-[3px] opacity-70 bg-[rgba(255,255,255,0.6)]';
    else dotClassName += 'w-[5px] h-[5px] bg-[rgba(255,255,255,0.6)]';
    return dotClassName;
  }
  return (
    <div
      className="min-h-[48vh] bg-green bg-cover bg-center min-[769px]:order-1 min-[769px]:min-h-0 relative overflow-hidden touch-pan-y"
      onTouchStart={(event) => {
        touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
      }}
      onTouchEnd={(event) => {
        const deltaX = event.changedTouches[0].clientX - touch.current.x;
        const deltaY = event.changedTouches[0].clientY - touch.current.y;
        if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) goTo(deltaX < 0 ? current + 1 : current - 1);
      }}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.src + index}
          className={`absolute inset-0 bg-cover bg-center transition-[opacity] duration-500 ease-[ease] ${index === current ? 'opacity-100' : 'opacity-0'}`}
          style={{ backgroundImage: `url(${slide.src})` }}
        />
      ))}

      {slides[current].title && (
        <div className="absolute left-[14px] bottom-[14px] max-[768px]:bottom-[2.6rem] z-[2] max-w-[62%] py-[5px] px-3 rounded-xl bg-[rgba(0,0,0,0.42)] text-white text-small">
          <span className="block overflow-hidden whitespace-nowrap text-ellipsis">{slides[current].title}</span>
        </div>
      )}

      {total > 1 && (
        <>
          <div className="absolute bottom-[12px] right-[14px] z-[2] hidden gap-1.5 min-[769px]:flex">
            <button type="button" className={ARROW} aria-label="Previous photo" onClick={() => goTo(current - 1)}>
              &lsaquo;
            </button>
            <button type="button" className={ARROW} aria-label="Next photo" onClick={() => goTo(current + 1)}>
              &rsaquo;
            </button>
          </div>
          <div className="hero-slider__dots absolute left-0 right-0 bottom-[16px] max-[768px]:left-auto max-[768px]:right-[14px] max-[768px]:bottom-[2.6rem] z-[2] flex justify-center items-center max-[768px]:justify-end gap-1.5 pointer-events-none">
            {Array.from({ length: count }, (unusedValue, index) => {
              const indexItem = start + index;
              return <span className={dotCls(indexItem, index)} key={indexItem} />;
            })}
          </div>
        </>
      )}
    </div>
  );
}
