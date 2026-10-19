'use client';

import { useState } from 'react';
import { AnimatePresence, LazyMotion, domAnimation, m as motionElement, useReducedMotion } from 'motion/react';
import { cn } from '../lib/cn.js';

const FADE_DURATION_SECONDS = 0.3;
const MAIN_IMAGE_WIDTH_PX = 1600;
const MAIN_IMAGE_HEIGHT_PX = 1000;
const THUMBNAIL_WIDTH_PX = 400;
const THUMBNAIL_HEIGHT_PX = 300;

const MAIN =
  'relative block w-full overflow-hidden min-[769px]:rounded-base p-0 border-none bg-cream cursor-pointer ' +
  'aspect-[4/5] min-[561px]:aspect-[3/2] min-[993px]:aspect-[16/7] ' +
  'max-[768px]:[margin-inline:calc(50%_-_50vw)] max-[768px]:w-screen ' +
  '[&>img]:absolute [&>img]:inset-0 [&>img]:w-full [&>img]:h-full [&>img]:object-cover [&>img]:object-center';

const SHADE = 'absolute inset-0 pointer-events-none bg-[linear-gradient(to_top,rgba(0,0,0,0.55),rgba(0,0,0,0)_55%)]';

const COPY =
  'absolute left-4 right-4 bottom-4 min-[769px]:left-7 min-[769px]:right-7 min-[769px]:bottom-6 ' +
  'grid gap-1 text-white text-left pointer-events-none';

const STRIP = 'grid grid-cols-6 gap-2 mt-2 min-[769px]:grid-cols-[repeat(6,8rem)]';

const THUMB =
  'relative block w-full aspect-[4/3] overflow-hidden rounded-base p-0 border-none bg-cream cursor-pointer ' +
  'outline-offset-2 [transition:opacity_var(--dur)_var(--ease)] ' +
  '[&>img]:absolute [&>img]:inset-0 [&>img]:w-full [&>img]:h-full [&>img]:object-cover';

const THUMB_ON = 'opacity-100 outline outline-2 outline-gold';
const THUMB_OFF = 'opacity-70 hover:opacity-100';

const MORE =
  'absolute inset-0 grid place-content-center bg-[rgba(34,32,28,0.55)] text-white text-small font-semibold leading-tight';

const THUMBS_SHOWN = 6;

const FADE = { duration: FADE_DURATION_SECONDS, ease: [0.4, 0, 0.2, 1] };

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
  const reduceMotion = useReducedMotion();

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
          <LazyMotion features={domAnimation}>
            <AnimatePresence initial={false}>
              <motionElement.img
                key={main.src}
                src={main.src}
                alt={main.alt || ''}
                width={main.w || MAIN_IMAGE_WIDTH_PX}
                height={main.h || MAIN_IMAGE_HEIGHT_PX}
                fetchPriority={active === 0 ? 'high' : undefined}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={reduceMotion ? { duration: 0 } : FADE}
              />
            </AnimatePresence>
          </LazyMotion>
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
          {thumbs.map((photo, index) => {
            const isMore = hasMore && index === THUMBS_SHOWN - 1;
            function pickThumbClasses() {
              if (isMore) return THUMB_OFF;
              if (index === active) return THUMB_ON;
              return THUMB_OFF;
            }

            return (
              <button
                type="button"
                key={`${photo.src}${index}`}
                className={cn(THUMB, pickThumbClasses())}
                onClick={() => (isMore ? open(index) : setActive(index))}
                aria-pressed={isMore ? undefined : index === active}
                aria-label={isMore ? `${moreLabel} (${images.length})` : `${photoLabel} ${index + 1}`}
              >
                <img
                  src={photo.src}
                  alt=""
                  width={photo.w || THUMBNAIL_WIDTH_PX}
                  height={photo.h || THUMBNAIL_HEIGHT_PX}
                  loading="lazy"
                />
                {isMore ? <span className={MORE}>+{images.length - THUMBS_SHOWN + 1}</span> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
