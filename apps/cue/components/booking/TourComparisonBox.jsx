import { ChevronRight } from 'lucide-react';
import Price from '@/components/Price';

// Sits directly under the single price in the booking card on an attraction
// page. The guest is looking at one number; this says plainly that the same
// place is also a stop on a full day, and what that day costs, so the two
// prices read as a comparison rather than a contradiction.
//
// Each tour is a white button, not a text link (Wayan): inside the cream panel
// the white block and the chevron read as something to tap, which is the whole
// point of the box - it is the one nudge from a single destination toward the
// tour. White on purpose, so it never competes with the green Book Now below.
//
// Built from the reverse lookup in lib/tourIndex (which tours list this refId),
// so nothing is hand-written and a stop added to a tour shows up here by itself.
// Renders nothing when the attraction is on no tour.
const BTN =
  'group flex items-center gap-3 w-full py-[0.7rem] px-[0.85rem] rounded-md no-underline text-left ' +
  'bg-white [border:1px_solid_var(--line)] shadow-sm cursor-pointer ' +
  'transition-[border-color,box-shadow,scale] duration-[var(--dur)] ease-[ease] ' +
  'hover:[border-color:var(--color-cta)] hover:shadow-md';

export default function TourComparisonBox({ tours }) {
  if (!tours || !tours.length) return null;
  return (
    <div className="mb-[1.1rem] py-[0.8rem] px-[0.9rem] [border:1px_solid_var(--line)] [border-left:3px_solid_var(--color-cta)] rounded-md bg-cream">
      <p className="m-0 mb-[0.6rem] text-label font-medium tracking-[0.12em] uppercase text-muted">
        Also part of
      </p>
      <ul className="grid gap-[0.5rem] m-0 p-0 list-none">
        {tours.map((t) => (
          <li key={t.href}>
            <a href={t.href} className={BTN}>
              <span className="flex-1 min-w-0">
                <span className="block text-strong font-semibold text-gold group-hover:text-cta">{t.name}</span>
                <span className="block mt-[0.1rem] text-small text-muted">
                  {t.stops} stops · from{' '}
                  <span className="font-semibold text-amber">
                    <Price name={t.priceName} fallback={t.priceFallback || ''} />
                  </span>
                </span>
              </span>
              <span
                className="flex-none inline-flex w-[var(--icon-sm)] h-[var(--icon-sm)] text-muted group-hover:text-cta [&>svg]:w-full [&>svg]:h-full"
                aria-hidden="true"
              >
                <ChevronRight strokeWidth={1.7} />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
