import { isHiddenTour } from '@/lib/routes';

// ONE breadcrumb for the whole site (Sep 2026, Wayan: "cari page yang belum ada
// breadcrumbs dong bro, dan breadcrumbs di perjelas dan benerin").
//
// Before this there were three renderers and they disagreed: the detail pages had
// a real <nav aria-label="Breadcrumb"> at 12.8px, the 15 guide articles printed a
// bare <p> at 10.24px - the smallest type on the site - and the legal sections a
// third <p>. Ten more pages had a BreadcrumbList in their JSON-LD and nothing a
// guest could see (measured: /tour, /destinations, /activities, /charter,
// /transfer, /airport-transfer, /all-reviews, /itinerary, /bali-guide, /index).
//
// Clearer, and the same everywhere now:
//  - a real <nav> + <ol>, so it is a list to a screen reader rather than a line of
//    text with slashes in it;
//  - 12.8px (--fs-small), not 10.24;
//  - the page you are ON is the last item, never a link, and carries
//    aria-current="page" - that is the bit that was missing everywhere.
export const CRUMB_NAV = 'font-body text-small text-muted';
export const CRUMB_OL = 'flex flex-wrap items-center gap-0 m-0 p-0 list-none';
export const CRUMB_LINK = 'text-muted no-underline hover:text-gold hover:underline';
export const CRUMB_HERE = 'text-gold font-medium';
export const CRUMB_SEP = 'mx-[0.4rem] opacity-[0.55]';

// A hidden tour has no page to land on, so it prints as plain text rather than a
// dead link - the same rule the old renderers applied.
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

// The detail pages keep their trail in content as [{type:'link'|'sep'|'text'}].
// Converting here rather than rewriting 68 content entries keeps this change to
// the rendering, which is what was actually wrong.
export function itemsFromLegacy(crumb = []) {
  return crumb
    .filter((p) => p.type !== 'sep')
    .map((p) => ({ label: p.text, href: p.type === 'link' ? p.href : undefined }));
}
