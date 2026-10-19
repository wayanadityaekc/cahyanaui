import { cn } from '../lib/cn.js';

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
