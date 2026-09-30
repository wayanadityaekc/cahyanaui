import { cn } from '../lib/cn.js';

// CUE's breadcrumb: nav + ol, 12.8px, the last item is the current page (plain text, aria-current), never a link.
export const CRUMB_NAV = 'font-body text-small text-muted';
export const CRUMB_OL = 'flex flex-wrap items-center gap-0 m-0 p-0 list-none';
export const CRUMB_LINK = 'text-muted no-underline hover:text-gold hover:underline';
export const CRUMB_HERE = 'text-gold font-medium';
export const CRUMB_SEP = 'mx-[0.4rem] opacity-[0.55]';

export default function Breadcrumb({ items = [], linkAs: Link = 'a', className }) {
  if (!items.length) return null;
  return (
    <nav className={cn(CRUMB_NAV, className)} aria-label="Breadcrumb">
      <ol className={CRUMB_OL}>
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center">
              {!last && item.href ? (
                <Link className={CRUMB_LINK} href={item.href}>{item.label}</Link>
              ) : (
                <span className={last ? CRUMB_HERE : undefined} aria-current={last ? 'page' : undefined}>{item.label}</span>
              )}
              {!last && <span className={CRUMB_SEP} aria-hidden="true">›</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
