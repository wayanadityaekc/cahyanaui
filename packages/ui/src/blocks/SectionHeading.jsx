import { cn } from '../lib/cn.js';

/**
 * The eyebrow / heading / lede stack that opens almost every band on both
 * sites. It was hand-typed at 20 call sites in the villa app, and the three
 * lines had already drifted apart: some ledes were text-small, some text-body;
 * some had mt-2, some mt-3; the dark ones each re-picked their own white.
 *
 *   as     h1 | h2 | h3   - the heading TAG, chosen for document outline
 *   size   display | h2 | h3 - the heading SIZE, chosen for the page
 *   tone   light (on a pale surface) | dark (on a photo or a dark band)
 *
 * TAG AND SIZE ARE SEPARATE ON PURPOSE. A listing page's first heading is an
 * <h1> for search and screen readers, but a section further down that happens
 * to be visually identical must not also be an h1. Tying size to tag is how a
 * page ends up choosing between correct markup and correct typography.
 *
 * NO UNDERLINE. CUE dropped the little centred gold bar under its headings
 * site-wide (Sep 2026) and it is not coming back in a new component.
 */
const SIZES = {
  display: 'text-display font-bold',
  h2: 'text-h2 font-semibold',
  h3: 'text-h3 font-semibold',
};

const TONES = {
  light: { eyebrow: 'text-muted', title: 'text-gold', lede: 'text-muted' },
  dark: { eyebrow: 'text-gold-l', title: 'text-white', lede: 'text-white/85' },
};

// Matches the primitive Eyebrow: 10.24px / weight 500 / 0.14em. Weight 500 and
// not 600 - the ladder reserves 600 for prices and buttons, and a heavier
// stroke spread over that much tracking is what made these read oversized.
const EYEBROW_LINE = 'block mb-[0.6rem] text-label font-medium tracking-[0.14em] uppercase';

export default function SectionHeading({
  eyebrow,
  title,
  lede,
  as: Tag = 'h2',
  size = 'h2',
  tone = 'light',
  align = 'left',
  className,
  titleClassName,
  ledeClassName,
  children,
  ...rest
}) {
  const t = TONES[tone] || TONES.light;
  return (
    <div className={cn(align === 'center' && 'text-center', className)} {...rest}>
      {eyebrow ? <p className={cn(EYEBROW_LINE, t.eyebrow)}>{eyebrow}</p> : null}
      <Tag className={cn(SIZES[size] || SIZES.h2, 'leading-[var(--lh-heading)]', t.title, titleClassName)}>
        {title}
      </Tag>
      {lede ? <p className={cn('mt-2 text-small', t.lede, ledeClassName)}>{lede}</p> : null}
      {children}
    </div>
  );
}
