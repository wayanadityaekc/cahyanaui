import { cn } from '../lib/cn.js';

/**
 * An inline menu that opens by pushing the content below it down.
 *
 * NO ANIMATION LIBRARY. `display` cannot be animated at all, which is why a
 * `{open && ...}` menu pops rather than opens - but `height` is not the only
 * way to fix that. A grid whose single row goes from `0fr` to `1fr` animates
 * to the child's natural height with nothing but CSS, and the child never has
 * to be measured.
 *
 * CUE reaches for Framer Motion here and its own notes say the honest thing:
 * "khusus 3 menu ini, trik CSS bisa ngasih hasil yang sama di 0 KB". The
 * navbar is on every page, so an animation library imported for one submenu is
 * paid for on every page too. Framer earns its place where an element has to
 * animate OUT before unmounting (modals) - not here.
 *
 * Two things this must keep:
 *   - `overflow: hidden` on the row, or the child spills while collapsed.
 *   - `visibility`/`pointer-events` off when closed, so a keyboard tab does not
 *     land inside a menu nobody can see.
 *
 * Browsers that cannot interpolate grid-template-rows (Safari < 16) simply
 * open it instantly. That is the correct failure: the menu still works.
 */
export default function Collapse({ open, className, children }) {
  return (
    <div
      className={cn(
        'grid [transition:grid-template-rows_var(--dur)_var(--ease),opacity_var(--dur-fast)_var(--ease)]',
        'motion-reduce:transition-none',
        open
          ? '[grid-template-rows:1fr] opacity-100'
          : '[grid-template-rows:0fr] opacity-0 invisible pointer-events-none',
        className,
      )}
      aria-hidden={open ? undefined : 'true'}
    >
      <div className="overflow-hidden min-h-0">{children}</div>
    </div>
  );
}
