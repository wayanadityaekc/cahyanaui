import { cn } from '../lib/cn.js';

/**
 * A small pill sitting on a card or a photo.
 *
 *   tone  default  white, for a label over an image
 *         amber    the real gold - "Popular" / featured ONLY
 *         cta      green, for a state worth acting on
 *
 * amber is not decoration. The palette gives it three jobs site-wide - prices,
 * rating stars, and this badge - and spending it anywhere else is what makes an
 * accent stop meaning anything.
 */
const TONES = {
  default: 'bg-surface-raised text-gold [box-shadow:var(--shadow-sm)]',
  amber: 'bg-amber text-gold',
  cta: 'bg-cta text-white',
};

export default function Badge({ tone = 'default', className, children, ...rest }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-pill py-[0.3rem] px-[0.75rem]',
        'font-body text-label font-semibold tracking-[0.06em]',
        TONES[tone] || TONES.default,
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
