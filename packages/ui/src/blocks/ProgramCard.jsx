import { Clock, Landmark, Leaf, Mountain, Star, UserRound, VenetianMask } from 'lucide-react';
import { cn } from '../lib/cn.js';

const FRAME =
  "relative block overflow-hidden rounded-base text-white no-underline bg-white aspect-[4/5] shadow-card " +
  "after:content-[''] after:absolute after:inset-0 after:z-[1] " +
  'after:bg-[linear-gradient(to_top,rgba(12,14,10,0.86)_0%,rgba(12,14,10,0.40)_40%,rgba(12,14,10,0)_66%,rgba(12,14,10,0.14)_100%)]';
const IMG = 'absolute inset-0 w-full h-full object-cover';
const CAT_BASE =
  'absolute top-3 left-3 z-[3] inline-flex items-center gap-[6px] px-3 py-[6px] rounded-sm text-[0.64rem] font-semibold ' +
  'tracking-[0.06em] uppercase text-white bg-[rgba(12,14,10,0.52)] border border-[rgba(255,255,255,0.2)] ' +
  '[&>svg]:w-[13px] [&>svg]:h-[13px] [&>svg]:shrink-0';
const RATE =
  'absolute top-3 right-3 z-[3] inline-flex items-center gap-[3px] px-[10px] py-[5px] rounded-sm ' +
  'bg-[rgba(255,255,255,0.92)] text-ink text-small font-semibold ' +
  '[&>svg]:w-[13px] [&>svg]:h-[13px] [&>svg]:text-amber-d';
const OVERLAY = 'absolute left-0 right-0 bottom-0 z-[2] px-[15px] pb-[14px]';
const TITLE = 'mt-0 mb-[9px] font-semibold text-[1.125rem] leading-[1.2] text-white line-clamp-2 [text-shadow:0_2px_12px_rgba(0,0,0,0.5)]';
const ACCENT = 'block w-[38px] h-[3px] rounded-base mb-3';
const BAR = 'flex items-center justify-between gap-2 px-[11px] py-2 rounded-md bg-[rgba(12,14,10,0.42)] border border-[rgba(255,255,255,0.2)]';
const META =
  'inline-flex items-center gap-[6px] text-[rgba(255,255,255,0.92)] text-[0.62rem] min-w-0 flex-[0_1_auto] whitespace-nowrap ' +
  '[&_svg]:w-3 [&_svg]:h-3 [&_svg]:flex-[0_0_auto]';

const CATS = {
  Culture: { tone: 'gold', Icon: VenetianMask },
  Temple: { tone: 'gold', Icon: Landmark },
  Nature: { tone: 'green', Icon: Leaf },
  Adventure: { tone: 'green', Icon: Mountain },
};

export default function ProgramCard({
  href = '#', image = null, title = '', meta = '', price = '', external = false, className,
  cat = '', catLabel = '', rating = '', privateLabel = 'Private Tour', fromLabel = 'from',
}) {
  const linkProps = external ? { target: '_blank', rel: 'noopener' } : {};
  const category = CATS[cat] || null;
  const tone = category ? category.tone : 'gold';
  const catTone = tone === 'green' ? 'bg-[rgba(61,92,70,0.84)]' : 'bg-[rgba(176,141,67,0.86)]';
  const accentTone = tone === 'green' ? 'bg-gold' : 'bg-amber';

  return (
    <a className={cn(FRAME, className)} href={href} {...linkProps}>
      {image && (
        <img className={IMG} src={image.src} alt={image.alt || title} width={image.width || 600} height={image.height || 600} loading="lazy" />
      )}
      {image && <span aria-hidden="true" className="absolute inset-0 pointer-events-none mix-blend-multiply [background:linear-gradient(180deg,rgba(214,178,120,0.18),rgba(120,80,40,0.30))]" />}
      {category && (
        <span className={`${CAT_BASE} ${catTone}`}>
          <category.Icon fill="currentColor" aria-hidden="true" />{catLabel || cat}
        </span>
      )}
      {rating ? (
        <span className={RATE}>
          <Star fill="currentColor" stroke="none" aria-hidden="true" />{rating}
        </span>
      ) : null}
      <div className={OVERLAY}>
        <h3 className={TITLE}>{title}</h3>
        <span className={`${ACCENT} ${accentTone}`} />
        <div className={BAR}>
          <span className={META}>
            <Clock strokeWidth={1.7} aria-hidden="true" /><span className="flex-[0_0_auto]">{meta}</span>
            <span className="w-px h-[11px] bg-[rgba(255,255,255,0.35)] flex-[0_0_auto]" />
            <UserRound strokeWidth={1.7} aria-hidden="true" /><span className="min-w-0 truncate">{privateLabel}</span>
          </span>
          {price ? (
            <span className="flex-[0_0_auto] text-right leading-[1.05] whitespace-nowrap text-white">
              <small className="block text-[9px] opacity-85 font-medium">{fromLabel}</small>
              <span className="text-white font-bold text-[0.875rem]">{price}</span>
            </span>
          ) : null}
        </div>
      </div>
    </a>
  );
}
