import { cn } from '../lib/cn.js';

/**
 * The small uppercase line above a heading.
 *
 * 10.24px / weight 500 / 0.14em tracking. The weight matters as much as the
 * size: at 600 the same text reads noticeably larger and heavier, which is
 * what it was before being measured against CUE and corrected. 600 belongs to
 * prices and buttons.
 */
export const EYEBROW =
  'font-body text-label font-medium tracking-[0.14em] uppercase text-muted';

export default function Eyebrow({ as: Tag = 'p', className, children, ...rest }) {
  return (
    <Tag className={cn(EYEBROW, 'block mb-[0.6rem]', className)} {...rest}>
      {children}
    </Tag>
  );
}
