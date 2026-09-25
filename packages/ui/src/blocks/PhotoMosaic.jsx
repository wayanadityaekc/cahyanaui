'use client';

import { cn } from '../lib/cn.js';
import { BLEED_MOBILE } from './gridClasses.js';

/**
 * THE PHOTO MOSAIC that opens a detail page: one large photograph, then a
 * column of two stacked smaller ones, then another large, and so on - and the
 * whole row SLIDES, so the next column peeks in at the right-hand edge.
 *
 * Ported from CUE's own hero (components/sections/HeroMosaic.jsx) so a tour
 * page and a villa page open on the same shape. Wayan: "hero villa pakai grid
 * kayak CUE, kalo di klik baru muncul yang full screen".
 *
 * WHAT IT DOES NOT DO: it does not open anything. Tapping a tile calls
 * `onOpen(index)` and that is all - the overlay is the app's business, because
 * the two sites answer a tap differently (CUE runs its own lightbox, the villa
 * site opens PhotoGrid). A block that owned the overlay would force one of
 * them to accept the other's.
 *
 * THE RHYTHM RUNS CONTINUOUSLY - big, pair, big, pair - with the pair as the
 * only wrapper and a SIBLING of the big tile rather than grouped with it. That
 * is what keeps a mid-scroll position showing "two small | BIG | two small",
 * the way the reference does; a locked three-photo group only ever puts a big
 * photo at the front of each group.
 *
 * TILES CARRY NO ASPECT OF THEIR OWN. The track owns the height, through
 * `aspect`, so the crop holds at every width - never a pixel height, which
 * gave a 1.24 big photo at a 993px viewport when CUE tried it.
 *
 * NO RADIUS on the tiles, matching CUE (Wayan there: "grid nya gausah kasi
 * border radius"). Pass `className` if a site wants its own.
 *
 * Layouts degrade by count, so a listing with two photographs still looks
 * finished: 1 = one wide tile, 2 = side by side, 3+ = the sliding mosaic.
 */
const TILE =
  'relative block w-full h-full overflow-hidden p-0 bg-cream border-none cursor-pointer ' +
  '[&>img]:absolute [&>img]:inset-0 [&>img]:w-full [&>img]:h-full [&>img]:object-cover [&>img]:object-center ' +
  '[&>img]:[transition:transform_var(--dur-slow)_var(--ease)] hover:[&>img]:[transform:scale(1.04)]';

const BIG = `${TILE} flex-[0_0_62%] [scroll-snap-align:start]`;

// A column of two stacked photos. With one photo in it (the tail of an odd
// count) it fills the column height instead of leaving a hole - it is the only
// flex-1 child.
const PAIR =
  'flex-[0_0_35%] h-full flex flex-col gap-1 [scroll-snap-align:start] [&>*]:flex-[1_1_0] [&>*]:min-h-0';

// Mobile 1.6/1 puts the big photo at about square, which is what a phone
// gallery wants; desktop 2.7/1 makes it landscape.
const TRACK =
  'flex gap-1 aspect-[1.6/1] min-[769px]:aspect-[2.7/1] ' +
  'overflow-x-auto overflow-y-hidden overscroll-x-contain ' +
  '[scroll-snap-type:x_mandatory] [touch-action:pan-x_pan-y] ' +
  '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden';

const STATIC_1 = 'aspect-[16/10] min-[769px]:aspect-[2.7/1]';
const STATIC_2 = `flex gap-1 ${STATIC_1} [&>*]:flex-1 [&>*]:min-w-0`;

// A corner pill rather than a dark wash over a tile: a wash lands on whatever
// the photograph's subject happens to be. `scale` has to be in this element's
// own transition list, or the global press feedback snaps instead of easing.
const MORE_BTN =
  'absolute bottom-3 right-3 z-[6] inline-flex items-center justify-center text-center leading-none whitespace-nowrap ' +
  'h-[var(--btn-h)] py-0 px-4 rounded-sm text-small font-semibold ' +
  'bg-white [border:1px_solid_var(--line)] shadow-md text-gold cursor-pointer ' +
  '[transition:background-color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)] hover:bg-cream';

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
        {/* eslint-disable-next-line @next/next/no-img-element */}
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
