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

// The track slides in GROUPS OF THREE - one big photo plus the two small ones
// (Wayan, Sep 2026: "3 kalo habis foto besar foto kecil yang 2 itu"). Grouping
// is what lets the phone show all three AND keep the big photo landscape: on a
// phone the big one sits on its own row above the pair (GetYourGuide's shape),
// on desktop it sits beside them spanning both rows (Viator's). Same DOM, the
// group grid just rearranges.
//
// NO RADIUS on the tiles (Wayan: "grid nya gausah kasi border radius").
// Tiles carry NO aspect of their own: the GROUP owns the shape (its aspect plus
// its row ratio), and each tile just fills its cell. Per-tile aspects broke once
// the groups became flex items - `align-items: stretch` grew them to the tallest
// group, and a stretched cell beats a tile's aspect, so the big photo measured
// 1.23 instead of 1.6 on phones. Owning it at group level makes the ratio exact
// and identical for every group, whatever it holds.
const TILE_BASE =
  'relative block w-full h-full overflow-hidden p-0 bg-cream border-none cursor-pointer ' +
  '[&>img]:absolute [&>img]:inset-0 [&>img]:w-full [&>img]:h-full [&>img]:object-cover [&>img]:object-center ' +
  '[&>img]:[transition:transform_var(--dur-slow)_var(--ease)] hover:[&>img]:[transform:scale(1.04)]';
// Big photo: full width above the pair on mobile, beside it spanning both rows on
// desktop.
const TILE_BIG = `${TILE_BASE} col-span-2 min-[769px]:col-span-1 min-[769px]:row-span-2`;
const TILE_SM = TILE_BASE;
// The last group when the count is not a multiple of three: the single small one
// takes the whole remaining space rather than leaving a hole beside it.
const TILE_SM_WIDE = `${TILE_BASE} col-span-2 min-[769px]:col-span-1 min-[769px]:row-span-2`;
// Group shape. Mobile: square-ish with 5:3 rows, which puts the big photo at
// ~1.6 (the landscape Wayan asked for) and the two small ones at ~4:3. Desktop:
// 2.7/1 with equal rows, big photo beside them at ~1.74. Aspect, never a pixel
// height, so the crop holds at every width - a stepped height gave a 1.24 big
// photo at a 993px viewport. 96% leaves the next group peeking at the right
// edge, which is the "there is more" signal.
const GROUP =
  'flex-[0_0_96%] grid grid-cols-2 gap-1 [scroll-snap-align:start] ' +
  'aspect-square [grid-template-rows:5fr_3fr] ' +
  'min-[769px]:[grid-template-columns:64fr_35fr] min-[769px]:[grid-template-rows:1fr_1fr] min-[769px]:aspect-[2.7/1]';
// items-start so a group's own aspect sets its height; flex's default stretch
// would override it.
const TRACK =
  'flex items-start gap-1 overflow-x-auto overflow-y-hidden overscroll-x-contain ' +
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

  // One big + two small per group.
  const groups = [];
  for (let i = 0; i < photos.length; i += 3) {
    groups.push([i, i + 1, i + 2].filter((n) => n < photos.length));
  }

  const gallery =
    photos.length === 1 ? (
      <div className={STATIC_1}>{tile(0, TILE_BASE)}</div>
    ) : photos.length === 2 ? (
      <div className={STATIC_2}>{photos.map((p, i) => tile(i, TILE_BASE))}</div>
    ) : (
      <Slider gridClassName={TRACK}>
        {groups.map((g) => (
          <div className={GROUP} key={g[0]}>
            {g.map((n, k) =>
              k === 0 ? tile(n, TILE_BIG) : tile(n, g.length === 2 ? TILE_SM_WIDE : TILE_SM),
            )}
          </div>
        ))}
      </Slider>
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
