'use client';

import clsx from 'clsx';
import { Check, Clock, MapPin, Star, UserRound } from 'lucide-react';
import Price from '@/components/Price';

// Rating star stays solid - `fill` makes the Lucide outline star read the same
// as the hand-drawn one it replaces.
const StarIcon = () => <Star fill="currentColor" stroke="none" aria-hidden="true" />;
const CheckIcon = () => <Check strokeWidth={2.4} aria-hidden="true" />;
const PinIcon = () => <MapPin strokeWidth={1.7} aria-hidden="true" />;
const ClockIcon = () => <Clock strokeWidth={1.7} aria-hidden="true" />;
const UserIcon = () => <UserRound strokeWidth={1.7} aria-hidden="true" />;

// Tailwind-native (migrasi Fase 2, keluarga kartu - stage 2): kartu listing
// (tour/activities/destinations). MOBILE = baris horizontal (foto kiri + panel
// kanan); >=769px = di-"flip" jadi kartu vertikal (foto atas, panel bawah) di
// grid 4-kolom (container .lrow-list masih legacy, di-convert stage grid nanti).
// Semua .lrow* -> utilities 1:1. Breakpoint 769px pakai min-[769px]:. Rule .lrow*
// lama jadi dead di produksi (komponen ini satu-satunya user).
const CARD =
  'scroll-mt-[110px] flex bg-white rounded-lg p-[10px] no-underline text-ink shadow-[0_6px_20px_rgba(31,61,43,0.08)] ' +
  'transition-[box-shadow,opacity] duration-200 ease-in-out hover:shadow-[0_12px_28px_rgba(31,61,43,0.14)] ' +
  'min-[769px]:flex-col min-[769px]:p-2';
const IMG =
  'relative flex-[0_0_124px] self-stretch min-h-[158px] rounded-md bg-cover bg-center bg-cream ' +
  'min-[769px]:flex-[0_0_auto] min-[769px]:w-full min-[769px]:aspect-[4/3] min-[769px]:min-h-0';
const RATE =
  'absolute top-[7px] right-[7px] inline-flex items-center gap-[3px] px-[6px] py-[2px] rounded-pill ' +
  'bg-[rgba(255,255,255,0.94)] text-ink text-[0.56rem] font-semibold shadow-sm ' +
  '[&>svg]:w-[9px] [&>svg]:h-[9px] [&>svg]:text-amber-d';
const BODY =
  'flex-1 min-w-0 pt-[6px] pr-2 pb-[6px] pl-[15px] flex flex-col min-[769px]:pt-3 min-[769px]:px-2 min-[769px]:pb-2';
const TITLE = 'mt-0 mb-[7px] font-semibold text-[0.95rem] leading-[1.25] text-ink line-clamp-2 min-[769px]:text-[1rem]';
const META =
  'm-0 p-0 list-none flex flex-col gap-[2px] ' +
  'min-[769px]:flex-row min-[769px]:flex-wrap min-[769px]:items-center min-[769px]:gap-x-[14px] min-[769px]:gap-y-[5px] ' +
  '[&>li]:flex [&>li]:items-center [&>li]:gap-[5px] [&>li]:text-muted [&>li]:text-[0.66rem] [&>li]:leading-[1.35] ' +
  '[&_svg]:shrink-0 [&_svg]:w-[11px] [&_svg]:h-[11px] [&_svg]:text-muted';
const CANCEL =
  'mt-2 inline-flex items-center gap-1 self-start px-2 py-[3px] rounded-pill bg-[rgba(61,92,70,0.1)] text-cta ' +
  'text-[0.58rem] font-semibold [&>svg]:w-[10px] [&>svg]:h-[10px]';
const PRICE = 'mt-auto self-end flex items-baseline gap-1 whitespace-nowrap';

export default function ListingRow({
  href, name, img, alt, meta, metaIcon = 'clock',
  priceName, priceFallback, priceMode = 'standard', zone, stops, priv, rating,
  dim = false, onReset, anchorId,
}) {
  const photo = img ? { backgroundImage: `url(/assets/images/${img})` } : undefined;
  const handleClick = dim && onReset ? (e) => { e.preventDefault(); onReset(); } : undefined;
  return (
    <a
      id={anchorId}
      className={clsx(CARD, dim && 'opacity-[0.34] hover:opacity-[0.5]')}
      href={href}
      data-zone={zone}
      onClick={handleClick}
    >
      <div className={IMG} style={photo} role="img" aria-label={alt || name}>
        <span className={RATE}><StarIcon />{rating || 'New'}</span>
      </div>
      <div className={BODY}>
        <h3 className={TITLE}>{name}</h3>
        <ul className={META}>
          {stops != null && (
            <li><PinIcon />{stops} {stops === 1 ? 'stop' : 'stops'}</li>
          )}
          {meta && metaIcon === 'pin' && stops == null && (
            <li><PinIcon />{meta}</li>
          )}
          {meta && metaIcon !== 'pin' && (
            <li><ClockIcon />{meta}</li>
          )}
          {priv && (
            <li><UserIcon />Private driver</li>
          )}
        </ul>
        {priceName && (
          <span className={CANCEL}><CheckIcon />Free cancellation</span>
        )}
        {priceName && (
          <span className={PRICE}>
            <small className="text-muted text-[0.68rem]">from</small>
            <Price name={priceName} mode={priceMode} fallback={priceFallback} className="text-h2 font-bold text-amber" />
          </span>
        )}
      </div>
    </a>
  );
}
