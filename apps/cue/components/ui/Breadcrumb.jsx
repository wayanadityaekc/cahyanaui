import { isHiddenTour } from '@/lib/routes';

export const CRUMB_NAV = 'font-body text-small text-muted';
export const CRUMB_OL = 'flex flex-wrap items-center gap-0 m-0 p-0 list-none';
export const CRUMB_LINK = 'text-muted no-underline hover:text-gold hover:underline';
export const CRUMB_HERE = 'text-gold font-medium';
export const CRUMB_SEP = 'mx-[0.4rem] opacity-[0.55]';

export default function Breadcrumb({ items = [], className = '' }) {
  if (!items.length) return null;
  return (
    <nav className={`${CRUMB_NAV} ${className}`} aria-label="Breadcrumb">
      <ol className={CRUMB_OL}>
        {items.map((it, i) => {
          const last = i === items.length - 1;
          const linkable = !last && it.href && !isHiddenTour(it.href);
          return (
            <li key={`${it.label}-${i}`} className="flex items-center">
              {linkable ? (
                <a className={CRUMB_LINK} href={it.href}>{it.label}</a>
              ) : (
                <span className={last ? CRUMB_HERE : undefined} aria-current={last ? 'page' : undefined}>
                  {it.label}
                </span>
              )}
              {!last && <span className={CRUMB_SEP} aria-hidden="true">›</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function itemsFromLegacy(crumb = []) {
  return crumb
    .filter((p) => p.type !== 'sep')
    .map((p) => ({ label: p.text, href: p.type === 'link' ? p.href : undefined }));
}
