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
/*
 * `section` is the heading of a page band, built from the shadcn / Flowbite /
 * Preline hierarchy: a short brand-coloured hook, a title one clear step above
 * the body, a lede in between, each on the same 8px ladder.
 *   hook   12.8px / 500, green, 8px above the title
 *   title  24-32px / 600, tight tracking, balanced
 *   lede   14px / 1.6, 12px under the title, 60 characters wide
 * Put `mb-8 min-[993px]:mb-12` on it to space it from the content below.
 */
const SIZES = {
  section: 'text-h2 font-semibold tracking-[-0.015em] text-balance',
  display: 'text-display font-bold',
  h2: 'text-h2 font-medium',
  h3: 'text-h3 font-semibold',
};

const TONES = {
  light: { eyebrow: 'text-muted', title: 'text-gold', lede: 'text-green' },
  dark: { eyebrow: 'text-gold-l', title: 'text-white', lede: 'text-white/85' },
};

// Section hooks take the brand colour on a pale surface, as the three libraries do.
const SECTION_TONES = {
  light: { eyebrow: 'text-cta', title: 'text-gold', lede: 'text-green' },
  dark: { eyebrow: 'text-gold-l', title: 'text-white', lede: 'text-white/85' },
};

// Matches the primitive Eyebrow: 10.24px / weight 500 / 0.14em. Weight 500 and
// not 600 - the ladder reserves 600 for prices and buttons, and a heavier
// stroke spread over that much tracking is what made these read oversized.
const EYEBROW_LINE = 'block mb-[0.6rem] text-small font-medium';
const EYEBROW_UPPER = 'block mb-[0.6rem] text-label font-medium tracking-[0.14em] uppercase';

export default function SectionHeading({
  eyebrow,
  title,
  lede,
  as: Tag = 'h2',
  size = 'h2',
  tone = 'light',
  upper = false,
  align = 'left',
  className,
  titleClassName,
  ledeClassName,
  children,
  ...rest
}) {
  const isSection = size === 'section';
  const t = (isSection ? SECTION_TONES : TONES)[tone] || TONES.light;
  return (
    <div className={cn(align === 'center' && 'text-center', className)} {...rest}>
      {eyebrow ? <p className={cn(upper ? EYEBROW_UPPER : EYEBROW_LINE, isSection && '!mb-2', t.eyebrow)}>{eyebrow}</p> : null}
      <Tag className={cn(SIZES[size] || SIZES.h2, 'leading-[var(--lh-heading)]', t.title, titleClassName)}>
        {title}
      </Tag>
      {lede ? <p className={cn(isSection ? 'mt-3 max-w-[60ch] text-strong leading-[1.6]' : 'mt-2 text-small leading-[1.45]', isSection && align === 'center' && 'mx-auto', t.lede, ledeClassName)}>{lede}</p> : null}
      {children}
    </div>
  );
}
