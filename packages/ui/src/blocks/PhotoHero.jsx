'use client';

import { useState } from 'react';
import { cn } from '../lib/cn.js';

// One big photo with the page title on it, then a thumbnail strip (Wayan picked option B, Oct 2026).
const MAIN =
  'relative block w-full overflow-hidden p-0 border-none bg-cream cursor-pointer ' +
  'aspect-[4/5] min-[561px]:aspect-[3/2] min-[993px]:aspect-[16/7] ' +
  'max-[768px]:[margin-inline:calc(50%_-_50vw)] max-[768px]:w-screen min-[769px]:rounded-sm ' +
  '[&>img]:absolute [&>img]:inset-0 [&>img]:w-full [&>img]:h-full [&>img]:object-cover [&>img]:object-center';

// Bottom shade so white text reads on any photo.
const SHADE = 'absolute inset-0 pointer-events-none bg-[linear-gradient(to_top,rgba(0,0,0,0.55),rgba(0,0,0,0)_55%)]';

const COPY =
  'absolute left-4 right-4 bottom-4 min-[769px]:left-7 min-[769px]:right-7 min-[769px]:bottom-6 ' +
  'grid gap-1 text-white text-left pointer-events-none';

// Phone: six across the width; desktop: small fixed thumbs so the big photo stays the hero.
const STRIP = 'grid grid-cols-6 gap-2 mt-2 min-[769px]:grid-cols-[repeat(6,8rem)]';

const THUMB =
  'relative block w-full aspect-[4/3] overflow-hidden p-0 border-none bg-cream cursor-pointer rounded-sm ' +
  'outline-offset-2 [transition:opacity_var(--dur)_var(--ease)] ' +
  '[&>img]:absolute [&>img]:inset-0 [&>img]:w-full [&>img]:h-full [&>img]:object-cover';

const THUMB_ON = 'opacity-100 outline outline-2 outline-gold';
const THUMB_OFF = 'opacity-70 hover:opacity-100';

// The last strip slot opens the full gallery and says how many photos are left.
const MORE =
  'absolute inset-0 grid place-content-center bg-[rgba(34,32,28,0.55)] text-white text-small font-semibold leading-tight';

const THUMBS_SHOWN = 6;

export default function PhotoHero({
  images = [],
  onOpen,
  eyebrow = null,
  title = null,
  moreLabel = 'All photos',
  photoLabel = 'Open photo',
  fallback = 'Sorry, we could not load the photos. Please try again.',
  className,
}) {
  const [active, setActive] = useState(0);

  if (!images.length) return <p className="text-small text-muted">{fallback}</p>;

  const main = images[active] || images[0];
  const hasMore = images.length > THUMBS_SHOWN;
  const thumbs = images.slice(0, THUMBS_SHOWN);

  function open(index) {
    if (onOpen) onOpen(index);
  }

  return (
    <div className={cn('relative', className)} data-photo-hero={images.length}>
      <div className="relative">
        <button
          type="button"
          className={MAIN}
          onClick={() => open(active)}
          aria-label={`${photoLabel} ${active + 1} / ${images.length}`}
          data-photo-hero-main
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={main.src} alt={main.alt || ''} width={main.w || 1600} height={main.h || 1000} fetchPriority="high" />
          <span className={SHADE} />
        </button>

        {eyebrow || title ? (
          <div className={COPY}>
            {eyebrow ? <span className="text-small font-medium text-white/85">{eyebrow}</span> : null}
            {title}
          </div>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className={STRIP} data-photo-hero-strip>
          {thumbs.map((photo, i) => {
            const isMore = hasMore && i === THUMBS_SHOWN - 1;
            return (
              <button
                type="button"
                key={`${photo.src}${i}`}
                className={cn(THUMB, isMore ? THUMB_OFF : i === active ? THUMB_ON : THUMB_OFF)}
                onClick={() => (isMore ? open(i) : setActive(i))}
                aria-pressed={isMore ? undefined : i === active}
                aria-label={isMore ? `${moreLabel} (${images.length})` : `${photoLabel} ${i + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.src} alt="" width={photo.w || 400} height={photo.h || 300} loading="lazy" />
                {isMore ? <span className={MORE}>+{images.length - THUMBS_SHOWN + 1}</span> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
