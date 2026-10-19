'use client';

import { cn } from '../lib/cn.js';
import { BLEED_MOBILE } from './gridClasses.js';

const TILE =
  'relative block w-full h-full overflow-hidden p-0 bg-cream border-none cursor-pointer ' +
  '[&>img]:absolute [&>img]:inset-0 [&>img]:w-full [&>img]:h-full [&>img]:object-cover [&>img]:object-center';

const BIG = `${TILE} flex-[0_0_62%] [scroll-snap-align:start]`;

const PAIR =
  'flex-[0_0_35%] h-full flex flex-col gap-2 [scroll-snap-align:start] [&>*]:flex-[1_1_0] [&>*]:min-h-0';

const TRACK =
  'flex gap-2 aspect-[1.1/1] min-[769px]:aspect-[1.9/1] ' +
  'overflow-x-auto overflow-y-hidden overscroll-x-contain ' +
  '[scroll-snap-type:x_mandatory] [touch-action:pan-x_pan-y] ' +
  '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden';

const STATIC_1 = 'aspect-[1.1/1] min-[769px]:aspect-[1.9/1]';
const STATIC_2 = `flex gap-2 ${STATIC_1} [&>*]:flex-1 [&>*]:min-w-0`;

const MORE_BTN =
  'absolute bottom-3 right-3 z-[6] inline-flex items-center justify-center h-7 px-3 rounded-sm ' +
  'text-small font-medium leading-none text-gold cursor-pointer bg-white/80 backdrop-blur-[2px] ' +
  '[border:1px_solid_rgba(255,255,255,0.7)] ' +
  '[transition:background-color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)] hover:bg-white';

export default function PhotoMosaic({
  images = [],
  onOpen,
  moreLabel = null,
  bleed = true,
  className,
}) {
  if (!images.length) return null;

  const tile = (i, cls) => {
    const p = images[i];
    return (
      <button
        type="button"
        key={(p.src || '') + i}
        data-mosaic-tile={i}
        className={cls}
        onClick={() => onOpen && onOpen(i)}
        aria-label={`Open photo ${i + 1} of ${images.length}${p.title ? `: ${p.title}` : ''}`}
      >
        <img
          src={p.src}
          alt={p.alt || ''}
          width={p.w || 1200}
          height={p.h || 900}
          loading={i === 0 ? undefined : 'lazy'}
        />
      </button>
    );
  };

  const children = [];
  for (let i = 0; i < images.length; i += 3) {
    children.push(tile(i, BIG));
    const pair = [i + 1, i + 2].filter((n) => n < images.length);
    if (pair.length) {
      children.push(
        <div className={PAIR} key={`pair-${i}`}>
          {pair.map((n) => tile(n, TILE))}
        </div>,
      );
    }
  }

  return (
    <div className={cn('relative', className)} data-mosaic={images.length}>
      {images.length === 1 ? (
        <div className={cn(STATIC_1, bleed && BLEED_MOBILE)}>{tile(0, TILE)}</div>
      ) : images.length === 2 ? (
        <div className={cn(STATIC_2, bleed && BLEED_MOBILE)}>{images.map((p, i) => tile(i, TILE))}</div>
      ) : (
        <div className={cn(TRACK, bleed && BLEED_MOBILE)}>{children}</div>
      )}

      {moreLabel && onOpen ? (
        <button type="button" className={MORE_BTN} onClick={() => onOpen(0)}>
          {moreLabel}
        </button>
      ) : null}
    </div>
  );
}
