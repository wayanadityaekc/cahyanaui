'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Img from '@/components/ui/Img';
import Slider from '@/components/ui/Slider';
import { BLEED_MOBILE } from '@/components/ui/gridClasses';
import useBodyLock from '@/components/ui/useBodyLock';

// Gallery hero - the Viator / GetYourGuide shape: one large photo, then pairs of
// stacked thumbnails, and the next column peeking at the right edge because the
// whole thing SLIDES (Wayan, Sep 2026: "jangan isi show all photos di depan tapi
// bisa di slide biar semua gambar bisa di slide, nanti kalo kebanyakan baru isi
// itu"). Every photo is reachable by sliding, so the "Show all N photos" pill
// only appears once there are more than a guest would want to swipe through.
//
// Why a photo POOL instead of one photo per named stop: photo availability per
// place is uneven - some Bali sites have plenty online, others none - so a fixed
// one-photo-per-stop layout fails in both directions at once. A hole opens where
// a place has no photo, and the 2nd or 3rd photo of a place that has several gets
// no seat at all (46 usable photos sat unused in the repo for exactly that
// reason). A pool is elastic: it absorbs the surplus, and never demands a photo
// of one specific place, so a gap never has to be filled with a lookalike from
// somewhere else. Captions stay attached per photo in the lightbox, so no photo
// claims to be a place it isn't.
//
// Layouts degrade by count so every tour looks finished with what it has:
// 1 photo = one wide tile, 2 = side by side, 3+ = the sliding mosaic.

// Past this many, sliding stops being the nice way through and a grid overview
// earns its place. Judgment call, not a measurement - tune it freely.
const PILL_FROM = 10;

// The track ALTERNATES, continuously: big photo, a column of two small, big
// photo, a column of two small... (Wayan, Sep 2026, pointing at Viator: "3 kalo
// habis foto besar foto kecil yang 2 itu"). Because there are no group
// boundaries, a mid-scroll position shows `2 small | BIG | 2 small` exactly like
// the reference - a locked 3-photo group only ever showed one big photo at the
// front, which is what was wrong with the previous take.
//
// Tiles carry no aspect of their own - the TRACK owns the height (via aspect, so
// the crop holds at every width) and every child stretches into it.
//
// NO RADIUS on the tiles (Wayan: "grid nya gausah kasi border radius").
const TILE_BASE =
  'relative block w-full h-full overflow-hidden p-0 bg-cream border-none cursor-pointer ' +
  '[&>img]:absolute [&>img]:inset-0 [&>img]:w-full [&>img]:h-full [&>img]:object-cover [&>img]:object-center ' +
  '[&>img]:[transition:transform_var(--dur-slow)_var(--ease)] hover:[&>img]:[transform:scale(1.04)]';
const BIG = `${TILE_BASE} flex-[0_0_62%] [scroll-snap-align:start]`;
// A column of two stacked small photos. One photo in it (the tail of an odd
// count) fills the column height instead of leaving a hole - it is the only
// flex-1 child.
const PAIR = 'flex-[0_0_35%] h-full flex flex-col gap-1 [scroll-snap-align:start] [&>*]:flex-[1_1_0] [&>*]:min-h-0';
// Track aspect sets the crop. Mobile 1.6/1 puts the big photo at ~1.0, matching
// Viator's phone gallery; desktop 2.7/1 puts it at ~1.67, the landscape Wayan
// asked for. Never a pixel height - a stepped height gave a 1.24 big photo at a
// 993px viewport.
const TRACK =
  'flex gap-1 aspect-[1.6/1] min-[769px]:aspect-[2.7/1] ' +
  'overflow-x-auto overflow-y-hidden overscroll-x-contain ' +
  '[scroll-snap-type:x_mandatory] [touch-action:pan-x_pan-y] ' +
  '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden ' +
  BLEED_MOBILE;
// Static (non-sliding) layouts for 1 and 2 photos - no track, so no snap needed.
const STATIC_1 = 'aspect-[16/10] min-[769px]:aspect-[2.7/1]';
const STATIC_2 = `flex gap-1 ${STATIC_1} [&>*]:flex-1 [&>*]:min-w-0`;
// Corner pill rather than a dark overlay across a tile - an overlay lands on
// whatever the photo's subject happens to be (it sat right on the macaque's
// face), and Viator/Airbnb put this control in the corner for the same reason.
// `scale` belongs in every clickable's own transition list, or the global press
// feedback in style.css snaps instead of easing (check-motion rule 2).
const MORE_BTN =
  'absolute bottom-3 right-3 z-[6] py-[0.4rem] px-[0.85rem] rounded-pill bg-white [border:1px_solid_var(--color-line)] ' +
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

  const tile = (i, cls) => {
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
  };

  // Flat, alternating children: big, pair, big, pair... The pair is the only
  // wrapper (it stacks two photos), and it sits as a SIBLING of the big tile
  // rather than inside a group with it - that is what keeps the rhythm running
  // past the third photo, so a mid-scroll position can show two smalls, a big,
  // and two more smalls at once.
  const children = [];
  for (let i = 0; i < photos.length; i += 3) {
    children.push(tile(i, BIG));
    const pair = [i + 1, i + 2].filter((n) => n < photos.length);
    if (pair.length) {
      children.push(
        <div className={PAIR} key={`pair-${i}`}>
          {pair.map((n) => tile(n, TILE_BASE))}
        </div>,
      );
    }
  }

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
