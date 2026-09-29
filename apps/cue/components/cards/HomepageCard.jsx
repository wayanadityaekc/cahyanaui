import { Clock, Landmark, Leaf, MapPin, Mountain, UserRound, VenetianMask } from 'lucide-react';
import Price from '@/components/Price';
import Rating from '@/components/Rating';

const PLACEHOLDER_GRADIENT = 'linear-gradient(135deg, rgba(31, 61, 43, 0.92), rgba(46, 90, 64, 0.86))';

function ClockIcon() { return <Clock strokeWidth={1.7} />; }
function PinIcon() { return <MapPin strokeWidth={1.7} />; }
function UserIcon() { return <UserRound strokeWidth={1.7} />; }
// Badge icons keep fill so they stay solid, not outline.
function LeafIcon() { return <Leaf fill="currentColor" aria-hidden="true" />; }
function MaskIcon() { return <VenetianMask fill="currentColor" aria-hidden="true" />; }
function MountainIcon() { return <Mountain fill="currentColor" aria-hidden="true" />; }
function TempleIcon() { return <Landmark fill="currentColor" aria-hidden="true" />; }

// Category -> badge tone + icon; labels are the real category, no invented tags.
const CATS = {
  Culture: { tone: 'gold', Icon: MaskIcon },
  Temple: { tone: 'gold', Icon: TempleIcon },
  Nature: { tone: 'green', Icon: LeafIcon },
  Adventure: { tone: 'green', Icon: MountainIcon },
};

// Glass-overlay card, fully self-styled; the hcard class is only a grid/slider layout hook.
const FRAME =
  "hcard relative block overflow-hidden text-white no-underline bg-white rounded-xl aspect-[4/5] shadow-card " +
  "after:content-[''] after:absolute after:inset-0 after:z-[1] " +
  'after:bg-[linear-gradient(to_top,rgba(12,14,10,0.86)_0%,rgba(12,14,10,0.40)_40%,rgba(12,14,10,0)_66%,rgba(12,14,10,0.14)_100%)]';
const IMG = 'absolute inset-0 w-full h-full object-cover';
const CAT_BASE =
  'absolute top-3 left-3 z-[3] inline-flex items-center gap-[6px] px-3 py-[6px] rounded-sm text-label font-semibold ' +
  'tracking-[0.06em] uppercase text-white bg-[rgba(12,14,10,0.52)] border border-[rgba(255,255,255,0.2)] ' +
  '[&>svg]:w-[13px] [&>svg]:h-[13px] [&>svg]:shrink-0';
const RATE =
  'absolute top-3 right-3 z-[3] inline-flex items-center gap-[3px] px-[10px] py-[5px] rounded-sm ' +
  'bg-[rgba(255,255,255,0.92)] text-ink text-small font-semibold ' +
  '[&>svg]:w-[13px] [&>svg]:h-[13px] [&>svg]:text-amber-d';
const OVERLAY = 'absolute left-0 right-0 bottom-0 z-[2] px-[15px] pb-[14px]';
const TITLE = 'mt-0 mb-[9px] font-semibold text-h2 leading-[1.2] text-white line-clamp-2 [text-shadow:0_2px_12px_rgba(0,0,0,0.5)]';
const ACCENT = 'block w-[38px] h-[3px] rounded-[2px] mb-3';
const BAR =
  'flex items-center justify-between gap-2 px-[11px] py-2 rounded-md bg-[rgba(12,14,10,0.42)] ' +
  'border border-[rgba(255,255,255,0.2)]';
// Duration stays fixed-width; 'Private Tour' shrinks with ellipsis so the meta row never overflows the price.
const META_ITEM = 'flex-[0_0_auto]';
const META_TRUNC = 'min-w-0 truncate';
const META =
  'inline-flex items-center gap-[6px] text-[rgba(255,255,255,0.92)] text-[0.62rem] min-w-0 flex-[0_1_auto] whitespace-nowrap ' +
  '[&_svg]:w-3 [&_svg]:h-3 [&_svg]:flex-[0_0_auto]';
const SEP = 'w-px h-[11px] bg-[rgba(255,255,255,0.35)] flex-[0_0_auto]';
const PRICE_WRAP = 'flex-[0_0_auto] text-right leading-[1.05] whitespace-nowrap text-white';

export default function HomepageCard({
  href, name, img, alt, meta, metaIcon = 'clock',
  priceName, priceFallback, priceMode = 'standard', zone, cat, width = 600, height = 600,
}) {
  const c = (cat && CATS[cat]) || null;
  const tone = c ? c.tone : 'gold';
  const isTour = metaIcon !== 'pin';
  const catTone = tone === 'green' ? 'bg-[rgba(61,92,70,0.84)]' : 'bg-[rgba(176,141,67,0.86)]';
  const accentTone = tone === 'green' ? 'bg-cta' : 'bg-amber';
  return (
    <a className={FRAME} href={href} data-zone={zone}>
      {img ? (
        <img className={IMG} src={`/assets/images/${img}`} alt={alt || name} width={width} height={height} loading="lazy" />
      ) : (
        <div className="absolute inset-0" style={{ backgroundImage: PLACEHOLDER_GRADIENT }} />
      )}
      {c && (
        <span className={`${CAT_BASE} ${catTone}`}>
          <c.Icon />{cat}
        </span>
      )}
      <Rating name={priceName} className={RATE} />
      <div className={OVERLAY}>
        <h3 className={TITLE}>{name}</h3>
        <span className={`${ACCENT} ${accentTone}`} />
        <div className={BAR}>
          <span className={META}>
            {isTour ? <ClockIcon /> : <PinIcon />}<span className={META_ITEM}>{meta}</span>
            {isTour && (
              <>
                <span className={SEP} />
                <UserIcon /><span className={META_TRUNC}>Private Tour</span>
              </>
            )}
          </span>
          {priceName && (
            <span className={PRICE_WRAP}>
              <small className="block text-[9px] opacity-85 font-medium">from</small>
              <Price name={priceName} mode={priceMode} fallback={priceFallback} className="text-white font-bold text-strong" />
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
