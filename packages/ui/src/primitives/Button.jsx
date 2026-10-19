import { cn } from '../lib/cn.js';
import { BTN_SM } from './btnClasses.js';

const SHARED =
  'font-body border cursor-pointer no-underline ' +
  'transition-[color,background-color,border-color,scale] duration-200 ease-in-out ' +
  'disabled:opacity-50 disabled:cursor-not-allowed';

const BASE = `inline-flex ${BTN_SM} gap-2 ${SHARED}`;
const BASE_LINK = `inline-flex items-center gap-2 p-0 h-auto text-small font-semibold rounded-none ${SHARED}`;

const VARIANTS = {
  primary: 'border-transparent bg-cta text-white hover:bg-cta-d',
  onDark: 'border-transparent bg-surface-raised text-gold hover:bg-cream',
  ghost: 'border-line bg-transparent text-gold hover:bg-cream',
  light: 'border-white/60 bg-white/10 text-white backdrop-blur-[2px] hover:bg-white hover:text-gold',
  plain: 'border-transparent bg-transparent text-gold hover:text-gold-d',
};

export default function Button({
  as: Tag = 'button',
  variant = 'primary',
  full = false,
  className,
  children,
  ...rest
}) {
  const base = variant === 'plain' ? BASE_LINK : BASE;
  const type = Tag === 'button' && rest.type === undefined ? { type: 'button' } : {};
  return (
    <Tag
      className={cn(base, VARIANTS[variant] || VARIANTS.primary, full && 'flex w-full', className)}
      data-btn={variant}
      {...type}
      {...rest}
    >
      {children}
    </Tag>
  );
}
