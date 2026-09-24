import { cn } from '../lib/cn.js';

/**
 * The action atom. One place for the shape (pill), the weight, and which
 * colour means what.
 *
 *   variant  primary  green CTA        - the one thing to do on a screen
 *            ghost    outlined         - "see more", secondary
 *            plain    text only
 *   size     md | lg  (ignored by `plain`, which has no box)
 *   as       render as another tag or component, e.g. `as={Link}`
 *
 * Properties that differ per variant live ONLY in the variant maps, never in
 * BASE. Class order in the string does not decide who wins in Tailwind - the
 * order in the compiled stylesheet does - so the same property must not be set
 * twice and left to luck.
 */
const BASE =
  'inline-flex items-center justify-center gap-2 font-body font-semibold leading-none ' +
  'border cursor-pointer no-underline whitespace-nowrap ' +
  'transition-[color,background-color,border-color,scale] duration-200 ease-in-out ' +
  'active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed';

const VARIANTS = {
  primary: 'rounded-pill border-transparent bg-cta text-white hover:bg-cta-d',
  ghost: 'rounded-pill border-line bg-surface-raised text-gold hover:bg-cream',
  plain: 'rounded-none border-transparent bg-transparent text-gold hover:text-gold-d',
};

const SIZES = {
  md: 'h-[2.9rem] px-6 text-small',
  lg: 'h-[3.2rem] px-[1.9rem] text-[1rem]',
};

export default function Button({
  as: Tag = 'button',
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}) {
  const box = variant === 'plain' ? 'p-0 h-auto text-small' : SIZES[size] || SIZES.md;
  // A <button> with no type submits the form around it. That has surprised
  // enough people that the default is set here rather than at each call site.
  const type = Tag === 'button' && rest.type === undefined ? { type: 'button' } : {};
  return (
    <Tag className={cn(BASE, VARIANTS[variant] || VARIANTS.primary, box, className)} {...type} {...rest}>
      {children}
    </Tag>
  );
}
