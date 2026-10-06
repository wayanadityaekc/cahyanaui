import { Clock, UserRound } from 'lucide-react';
import { cn } from '../lib/cn.js';

// Port of CUE's HomepageCard: a 4:5 photo with a dark gradient, the title and a glass bar (duration, private tour, price) at the bottom.
const FRAME =
  "relative block overflow-hidden text-white no-underline bg-white rounded-sm aspect-[4/5] shadow-card " +
  "after:content-[''] after:absolute after:inset-0 after:z-[1] " +
  'after:bg-[linear-gradient(to_top,rgba(12,14,10,0.86)_0%,rgba(12,14,10,0.40)_40%,rgba(12,14,10,0)_66%,rgba(12,14,10,0.14)_100%)]';
const BAR = 'flex items-center justify-between gap-2 px-[11px] py-2 rounded-md bg-[rgba(12,14,10,0.42)] border border-[rgba(255,255,255,0.2)]';
const META = 'inline-flex items-center gap-[6px] text-[rgba(255,255,255,0.92)] text-[0.62rem] min-w-0 flex-[0_1_auto] whitespace-nowrap [&_svg]:w-3 [&_svg]:h-3 [&_svg]:flex-[0_0_auto]';

export default function ProgramCard({ href = '#', image = null, title = '', meta = '', price = '', external = false, accent = 'bg-amber', className }) {
  const linkProps = external ? { target: '_blank', rel: 'noopener' } : {};
  return (
    <a className={cn(FRAME, className)} href={href} {...linkProps}>
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="absolute inset-0 w-full h-full object-cover" src={image.src} alt={image.alt || title} width={image.width || 600} height={image.height || 600} loading="lazy" />
      )}
      <div className="absolute left-0 right-0 bottom-0 z-[2] px-[15px] pb-[14px]">
        <h3 className="mt-0 mb-[9px] font-semibold text-h2 leading-[1.2] text-white line-clamp-2 [text-shadow:0_2px_12px_rgba(0,0,0,0.5)]">{title}</h3>
        <span className={cn('block w-[38px] h-[3px] rounded-[2px] mb-3', accent)} />
        <div className={BAR}>
          <span className={META}>
            <Clock strokeWidth={1.7} aria-hidden="true" /><span className="flex-[0_0_auto]">{meta}</span>
            <span className="w-px h-[11px] bg-[rgba(255,255,255,0.35)] flex-[0_0_auto]" />
            <UserRound strokeWidth={1.7} aria-hidden="true" /><span className="min-w-0 truncate">Private Tour</span>
          </span>
          {price ? (
            <span className="flex-[0_0_auto] text-right leading-[1.05] whitespace-nowrap text-white">
              <small className="block text-[9px] opacity-85 font-medium">from</small>
              <span className="text-white font-semibold text-strong">{price}</span>
            </span>
          ) : null}
        </div>
      </div>
    </a>
  );
}
