'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Img from '@/components/ui/Img';
import useBodyLock from '@/components/ui/useBodyLock';

// Gallery hero - the Viator / GetYourGuide pattern: one large photo plus two
// thumbnails, the rest behind a "+N" tile that opens a lightbox.
//
// Why a photo POOL instead of one photo per named stop (Wayan, Sep 2026): photo
// availability per place is uneven - some Bali sites have plenty online, others
// none - so a fixed one-photo-per-stop layout fails in both directions at once.
// A hole opens where a place has no photo, and the 2nd or 3rd photo of a place
// that has several gets no seat at all (46 usable photos sat unused in the repo
// for exactly that reason). A pool is elastic: it absorbs the surplus, and never
// demands a photo of one specific place, so a gap never has to be filled with a
// lookalike from somewhere else. Captions stay attached per photo in the
// lightbox, so no photo claims to be a place it isn't.
//
// Layouts degrade by count so every tour looks finished with what it has:
// 1 photo = one wide tile, 2 = side by side, 3+ = the mosaic.
const VISIBLE = 3;

const TILE_BASE =
  'relative block w-full h-full overflow-hidden p-0 bg-cream border-none cursor-pointer ' +
  '[&>img]:absolute [&>img]:inset-0 [&>img]:w-full [&>img]:h-full [&>img]:object-cover [&>img]:object-center ' +
  '[&>img]:[transition:transform_var(--dur-slow)_var(--ease)] hover:[&>img]:[transform:scale(1.04)]';
// Mobile: lead photo full width, thumbs in a row beneath. Desktop: lead photo
// left spanning both rows, thumbs stacked right - the grid's own aspect sets the
// height, so the tiles come out near-square like Viator's.
const TILE_LEAD = `${TILE_BASE} col-span-2 aspect-[16/10] min-[769px]:col-span-1 min-[769px]:row-span-2 min-[769px]:aspect-auto`;
const TILE_THUMB = `${TILE_BASE} aspect-[4/3] min-[769px]:aspect-auto`;
const GRID_BASE = 'grid gap-1 overflow-hidden rounded-lg';
// Corner pill rather than a dark overlay across the last tile - an overlay lands
// on whatever the photo's subject happens to be (it sat right on the macaque's
// face), and Viator/Airbnb put this control in the corner for the same reason.
// `scale` belongs in every clickable's own transition list, or the global press
// feedback in style.css snaps instead of easing (check-motion rule 2).
const MORE_BTN =
  'absolute bottom-3 right-3 z-[2] py-[0.4rem] px-[0.85rem] rounded-pill bg-white [border:1px_solid_var(--color-line)] ' +
  'shadow-md font-body text-small font-semibold text-gold cursor-pointer ' +
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
    const onKey = (e) => {
      if (e.key === 'Escape') setAt(null);
      else if (e.key === 'ArrowRight') setAt((i) => (i + 1) % photos.length);
      else if (e.key === 'ArrowLeft') setAt((i) => (i - 1 + photos.length) % photos.length);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, photos.length]);

  if (!photos.length) return null;

  const shown = photos.slice(0, VISIBLE);
  const extra = photos.length - shown.length;

  const grid =
    photos.length === 1
      ? `${GRID_BASE} grid-cols-1`
      : photos.length === 2
        ? `${GRID_BASE} grid-cols-2`
        : `${GRID_BASE} grid-cols-2 min-[769px]:grid-cols-[1.85fr_1fr] min-[769px]:grid-rows-2 min-[769px]:aspect-[2.7/1]`;

  const tileCls = (i) => {
    if (photos.length === 1) return `${TILE_BASE} aspect-[16/9]`;
    if (photos.length === 2) return `${TILE_BASE} aspect-[4/3]`;
    return i === 0 ? TILE_LEAD : TILE_THUMB;
  };

  return (
    <>
      <div className="relative">
        <div className={grid}>
          {shown.map((p, i) => (
            <button
              type="button"
              key={p.src}
              className={tileCls(i)}
              onClick={() => setAt(i)}
              aria-label={`Open photo ${i + 1} of ${photos.length}${p.title ? `: ${p.title}` : ''}`}
            >
              <Img src={p.src} alt={p.alt || ''} width={p.w} height={p.hgt} priority={i === 0} />
            </button>
          ))}
        </div>
        {extra > 0 && (
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
              {/* Height capped in viewport units, not max-h-full: a percentage
                  max-height against an auto-height flex item does not constrain,
                  so the photo rendered at its natural 1200x900 and pushed past
                  the viewport with the caption landing on top of it. The 12rem
                  reserves the header and caption/arrow rows. */}
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
