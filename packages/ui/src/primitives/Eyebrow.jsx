import { cn } from '../lib/cn.js';

export const CAPS = 'font-body text-small font-medium';

export const UPPER = 'text-label tracking-[0.14em] uppercase';

export const EYEBROW = `${CAPS} text-muted`;

export const EYEBROW_LINE = `${EYEBROW} block mb-[0.6rem]`;

export default function Eyebrow({ as: Tag = 'p', className, children, ...rest }) {
  return (
    <Tag className={cn(EYEBROW_LINE, className)} {...rest}>
      {children}
    </Tag>
  );
}
