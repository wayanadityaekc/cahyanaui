import { cn } from '../lib/cn.js';

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

const SECTION_TONES = {
  light: { eyebrow: 'text-gold', title: 'text-gold', lede: 'text-green' },
  dark: { eyebrow: 'text-gold-l', title: 'text-white', lede: 'text-white/85' },
};

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
  align,
  className,
  titleClassName,
  ledeClassName,
  children,
  ...rest
}) {
  const isSection = size === 'section';
  const centered = align ? align === 'center' : isSection;
  const t = (isSection ? SECTION_TONES : TONES)[tone] || TONES.light;
  return (
    <div className={cn(centered && 'text-center', className)} {...rest}>
      {eyebrow ? <p className={cn(upper ? EYEBROW_UPPER : EYEBROW_LINE, isSection && '!mb-2', t.eyebrow)}>{eyebrow}</p> : null}
      <Tag className={cn(SIZES[size] || SIZES.h2, 'leading-[var(--lh-heading)]', t.title, titleClassName)}>
        {title}
      </Tag>
      {lede ? <p className={cn(isSection ? 'mt-3 max-w-[60ch] text-strong leading-[1.6]' : 'mt-2 text-small leading-[1.45]', isSection && centered && 'mx-auto', t.lede, ledeClassName)}>{lede}</p> : null}
      {children}
    </div>
  );
}
