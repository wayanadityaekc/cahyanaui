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
        {items.map((it, index) => {
          const isLast = index === items.length - 1;
          const linkable = !isLast && it.href && !isHiddenTour(it.href);
          return (
            <li key={`${it.label}-${index}`} className="flex items-center">
              {linkable ? (
                <a className={CRUMB_LINK} href={it.href}>
                  {it.label}
                </a>
              ) : (
                <span className={isLast ? CRUMB_HERE : undefined} aria-current={isLast ? 'page' : undefined}>
                  {it.label}
                </span>
              )}
              {!isLast && (
                <span className={CRUMB_SEP} aria-hidden="true">
                  ›
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function buildItemsFromLegacy(crumb = []) {
  return crumb
    .filter((crumbItem) => crumbItem.type !== 'sep')
    .map((crumbItem) => ({ label: crumbItem.text, href: crumbItem.type === 'link' ? crumbItem.href : undefined }));
}
