import { cn } from '../lib/cn.js';
import { CONTAINER_WIDTHS } from './layoutClasses.js';

/**
 * The page's side edges, as a component.
 *
 *   width  wide | mid | read   (see layoutClasses for what each is for)
 *   as     render as another tag, e.g. `as="header"`
 *
 * Use this rather than re-typing `max-w-[...] mx-auto px-[...]`: the whole
 * point is that every left edge on a page lands on the same pixel, and a
 * hand-typed box is exactly how one of them drifts.
 */
export default function Container({ as: Tag = 'div', width = 'wide', className, children, ...rest }) {
  return (
    <Tag className={cn(CONTAINER_WIDTHS[width] || CONTAINER_WIDTHS.wide, className)} {...rest}>
      {children}
    </Tag>
  );
}
