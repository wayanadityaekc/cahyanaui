import { Clock, Star, UserRound } from 'lucide-react';
import { cn } from '../lib/cn.js';

const DEFAULT_IMAGE_WIDTH_PX = 600;
const DEFAULT_IMAGE_HEIGHT_PX = 600;
const ICON_STROKE_WIDTH_REGULAR = 1.7;

const FRAME =
  'relative block overflow-hidden text-white no-underline bg-white rounded-xl aspect-[4/5] shadow-card ' +
  "after:content-[''] after:absolute after:inset-0 after:z-[1] " +
  'after:bg-[linear-gradient(to_top,rgba(12,14,10,0.86)_0%,rgba(12,14,10,0.40)_40%,rgba(12,14,10,0)_66%,rgba(12,14,10,0.14)_100%)]';
const IMG = 'absolute inset-0 w-full h-full object-cover';
const RATE =
  'absolute top-3 right-3 z-[3] inline-flex items-center gap-[3px] px-[10px] py-[5px] rounded-sm ' +
  'bg-[rgba(255,255,255,0.92)] text-ink text-small font-semibold ' +
  '[&>svg]:w-[13px] [&>svg]:h-[13px] [&>svg]:text-amber-d';
const OVERLAY = 'absolute left-0 right-0 bottom-0 z-[2] px-[15px] pb-[14px]';
const TITLE =
  'mt-0 mb-[9px] font-semibold text-[1.125rem] leading-[1.2] text-white line-clamp-2 [text-shadow:0_2px_12px_rgba(0,0,0,0.5)]';
const ACCENT = 'block w-[38px] h-[3px] rounded-[2px] mb-3';
const BAR =
  'flex items-center justify-between gap-2 px-[11px] py-2 rounded-md bg-[rgba(12,14,10,0.42)] border border-[rgba(255,255,255,0.2)]';
const META =
  'inline-flex items-center gap-[6px] text-[rgba(255,255,255,0.92)] text-[0.62rem] min-w-0 flex-[0_1_auto] whitespace-nowrap ' +
  '[&_svg]:w-3 [&_svg]:h-3 [&_svg]:flex-[0_0_auto]';

const PLACEHOLDER_GRADIENT = 'linear-gradient(135deg, rgba(31, 61, 43, 0.92), rgba(46, 90, 64, 0.86))';
const PRICE_SYM = 'text-[0.66em] font-semibold [vertical-align:0.12em] mr-px';
const PRICE_TAIL = 'text-[0.55em] [vertical-align:0.05em]';
const RATE_COUNT = 'ml-[1px] text-[0.8em] font-normal opacity-70';

function splitPriceThousands(priceText) {
  const dotIndex = priceText.lastIndexOf('.');
  if (dotIndex === -1) return priceText;
  return (
    <>
      {priceText.slice(0, dotIndex + 1)}
      <span className={PRICE_TAIL}>{priceText.slice(dotIndex + 1)}</span>
    </>
  );
}

function splitPriceSymbol(text) {
  const matchResult = String(text).match(/^(\D+)(\d.*)$/);
  if (!matchResult) return text;
  const [, symbol, digits] = matchResult;
  return (
    <>
      <span className={PRICE_SYM}>{symbol}</span>
      {symbol.trim() === 'Rp' ? splitPriceThousands(digits) : digits}
    </>
  );
}

const GREEN_CATEGORIES = ['Nature', 'Adventure'];

export default function ProgramCard({
  href = '#',
  image = null,
  title = '',
  meta = '',
  price = '',
  external = false,
  className,
  cat = '',
  rating = '',
  ratingCount = 0,
  newLabel = 'New',
  privateLabel = 'Private Tour',
  fromLabel = 'from',
}) {
  const linkProps = external ? { target: '_blank', rel: 'noopener' } : {};
  const accentTone = GREEN_CATEGORIES.includes(cat) ? 'bg-[rgb(61,92,70)]' : 'bg-amber';

  return (
    <a className={cn(FRAME, className)} href={href} {...linkProps}>
      {image ? (
        <img
          className={IMG}
          src={image.src}
          alt={image.alt || title}
          width={image.width || DEFAULT_IMAGE_WIDTH_PX}
          height={image.height || DEFAULT_IMAGE_HEIGHT_PX}
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0" style={{ backgroundImage: PLACEHOLDER_GRADIENT }} />
      )}
      <span className={RATE}>
        <Star fill="currentColor" stroke="none" aria-hidden="true" />
        {rating ? (
          <>
            {rating}
            <span className={RATE_COUNT}>({ratingCount})</span>
          </>
        ) : (
          newLabel
        )}
      </span>
      <div className={OVERLAY}>
        <h3 className={TITLE}>{title}</h3>
        <span className={`${ACCENT} ${accentTone}`} />
        <div className={BAR}>
          <span className={META}>
            <Clock strokeWidth={ICON_STROKE_WIDTH_REGULAR} aria-hidden="true" />
            <span className="flex-[0_0_auto]">{meta}</span>
            <span className="w-px h-[11px] bg-[rgba(255,255,255,0.35)] flex-[0_0_auto]" />
            <UserRound strokeWidth={ICON_STROKE_WIDTH_REGULAR} aria-hidden="true" />
            <span className="min-w-0 truncate">{privateLabel}</span>
          </span>
          {price ? (
            <span className="flex-[0_0_auto] text-right leading-[1.05] whitespace-nowrap text-white">
              <small className="block text-[9px] opacity-85 font-medium">{fromLabel}</small>
              <span className="text-white font-bold text-[0.875rem]">{splitPriceSymbol(price)}</span>
            </span>
          ) : null}
        </div>
      </div>
    </a>
  );
}
