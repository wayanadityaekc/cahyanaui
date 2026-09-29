'use client';
import { BTN_SM } from '@/components/ui/btnClasses';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Img from '@/components/ui/Img';
import Slider from '@/components/ui/Slider';
import { BLEED_MOBILE } from '@/components/ui/gridClasses';
import useBodyLock from '@/components/ui/useBodyLock';

// Sliding gallery hero built from a photo pool; 1 photo = wide tile, 2 = side by side, 3+ = mosaic.

// Show the 'all photos' pill only from this many photos; a judgment call, tune freely.
const PILL_FROM = 10;

// Tiles fill a track that owns the height; no radius and no hover zoom/transition on purpose (ask before adding).
const TILE_BASE =
  'relative block w-full h-full overflow-hidden p-0 bg-cream border-none cursor-pointer ' +
  '[&>img]:absolute [&>img]:inset-0 [&>img]:w-full [&>img]:h-full [&>img]:object-cover [&>img]:object-center';
const BIG = `${TILE_BASE} flex-[0_0_62%] [scroll-snap-align:start]`;
// Column of two small photos; a lone tail photo fills the whole column.
const PAIR = 'flex-[0_0_35%] h-full flex flex-col gap-1 [scroll-snap-align:start] [&>*]:flex-[1_1_0] [&>*]:min-h-0';
// Track aspect sets the crop (1.6/1 phone, 2.7/1 desktop); never a pixel height.
const TRACK =
  'flex gap-1 aspect-[1.6/1] min-[769px]:aspect-[2.7/1] ' +
  'overflow-x-auto overflow-y-hidden overscroll-x-contain ' +
  '[scroll-snap-type:x_mandatory] [touch-action:pan-x_pan-y] ' +
  '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden ' +
  BLEED_MOBILE;
// Static (non-sliding) layouts for 1 and 2 photos - no track, so no snap needed.
const STATIC_1 = 'aspect-[16/10] min-[769px]:aspect-[2.7/1]';
const STATIC_2 = `flex gap-1 ${STATIC_1} [&>*]:flex-1 [&>*]:min-w-0`;
// Corner pill, not an overlay; keep scale in its transition list or press feedback snaps (check-motion).
const MORE_BTN =
  `absolute bottom-3 right-3 z-[6] inline-flex ${BTN_SM} bg-white [border:1px_solid_var(--line)] ` +
  'font-body text-gold cursor-pointer ' +
  '[transition:background-color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)] hover:bg-cream';

const LB_ICON_BTN =
  'grid place-items-center w-9 h-9 rounded-[50%] border-none bg-[rgba(255,255,255,0.14)] p-0 text-white text-[1.35rem] leading-none cursor-pointer ' +
  '[transition:background-color_var(--dur)_var(--ease)] hover:bg-[rgba(255,255,255,0.26)]';

export default function HeroMosaic({ photos = [], title }) {
  const [at, setAt] = useState(null);
  const open = at !== null;
  useBodyLock(open);

  useEffect(() => {
    if (!open) return undefined;
    function onKey(e) {
      if (e.key === 'Escape') setAt(null);
      else if (e.key === 'ArrowRight') setAt((i) => (i + 1) % photos.length);
      else if (e.key === 'ArrowLeft') setAt((i) => (i - 1 + photos.length) % photos.length);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, photos.length]);

  if (!photos.length) return null;

  function tile(i, cls) {
    const p = photos[i];
    return (
      <button
        type="button"
        key={p.src}
        className={cls}
        onClick={() => setAt(i)}
        aria-label={`Open photo ${i + 1} of ${photos.length}${p.title ? `: ${p.title}` : ''}`}
      >
        <Img src={p.src} alt={p.alt || ''} width={p.w} height={p.hgt} priority={i === 0} />
      </button>
    );
  }

  // Flat alternating children (big, pair, big, pair) so the rhythm continues past the third photo.
  const children = [];
  [...Array(Math.ceil(photos.length / 3)).keys()].map((k) => k * 3).forEach((i) => {
    children.push(tile(i, BIG));
    const pair = [i + 1, i + 2].filter((n) => n < photos.length);
    if (pair.length) {
      children.push(
        <div className={PAIR} key={`pair-${i}`}>
          {pair.map((n) => tile(n, TILE_BASE))}
        </div>,
      );
    }
  });

  const gallery =
    photos.length === 1 ? (
      <div className={STATIC_1}>{tile(0, TILE_BASE)}</div>
    ) : photos.length === 2 ? (
      <div className={STATIC_2}>{photos.map((p, i) => tile(i, TILE_BASE))}</div>
    ) : (
      <Slider gridClassName={TRACK}>{children}</Slider>
    );

  return (
    <>
      <div className="relative">
        {gallery}
        {photos.length >= PILL_FROM && (
          <button type="button" className={MORE_BTN} onClick={() => setAt(0)}>
            Show all {photos.length} photos
          </button>
        )}
      </div>

      {open &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[200] flex flex-col bg-[rgba(18,17,15,0.94)]"
            role="dialog"
            aria-modal="true"
            aria-label={title ? `${title} photos` : 'Photos'}
          >
            <div className="flex items-center justify-between flex-none py-3 px-4">
              <span className="font-body text-small text-[rgba(255,255,255,0.75)]">
                {at + 1} / {photos.length}
              </span>
              <button type="button" className={LB_ICON_BTN} onClick={() => setAt(null)} aria-label="Close photos">
                &times;
              </button>
            </div>

            <div className="flex-[1_1_auto] min-h-0 grid place-items-center overflow-hidden px-4">
              {/* Cap height in viewport units; max-h-full does not constrain here. 12rem reserves header and caption rows. */}
              <img
                src={photos[at].src}
                alt={photos[at].alt || ''}
                className="max-w-full max-h-[calc(100dvh-12rem)] w-auto h-auto object-contain rounded-sm"
              />
            </div>

            <div className="flex-none py-4 px-4 text-center">
              {photos[at].title && (
                <p className="font-body text-small text-[rgba(255,255,255,0.8)] m-0 mb-3">{photos[at].title}</p>
              )}
              {photos.length > 1 && (
                <div className="flex justify-center gap-3">
                  <button
                    type="button"
                    className={LB_ICON_BTN}
                    onClick={() => setAt((i) => (i - 1 + photos.length) % photos.length)}
                    aria-label="Previous photo"
                  >
                    &lsaquo;
                  </button>
                  <button
                    type="button"
                    className={LB_ICON_BTN}
                    onClick={() => setAt((i) => (i + 1) % photos.length)}
                    aria-label="Next photo"
                  >
                    &rsaquo;
                  </button>
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
