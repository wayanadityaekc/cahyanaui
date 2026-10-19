import { ChevronRight } from 'lucide-react';
import Price from '@/components/Price';

const ICON_STROKE_WIDTH_REGULAR = 1.7;

const BTN =
  'group flex items-center gap-3 w-full py-[0.7rem] px-[0.85rem] rounded-md no-underline text-left ' +
  'bg-white [border:1px_solid_var(--line)] cursor-pointer ' +
  'transition-[border-color,scale] duration-[var(--dur)] ease-[ease] ' +
  'hover:[border-color:var(--color-cta)]';

export default function TourComparisonBox({ tours }) {
  if (!tours || !tours.length) return null;
  return (
    <div className="mb-[1.1rem] py-[0.8rem] px-[0.9rem] [border:1px_solid_var(--line)] [border-left:3px_solid_var(--color-cta)] rounded-md bg-cream">
      <p className="m-0 mb-[0.6rem] text-label font-medium tracking-[0.12em] uppercase text-muted">Also part of</p>
      <ul className="grid gap-[0.5rem] m-0 p-0 list-none">
        {tours.map((tour) => (
          <li key={tour.href}>
            <a href={tour.href} className={BTN}>
              <span className="flex-1 min-w-0">
                <span className="block text-strong font-semibold text-gold group-hover:text-cta">{tour.name}</span>
                <span className="block mt-[0.1rem] text-small text-muted">
                  {tour.stops} stops · from{' '}
                  <span className="font-semibold text-amber">
                    <Price name={tour.priceName} fallback={tour.priceFallback || ''} />
                  </span>
                </span>
              </span>
              <span
                className="flex-none inline-flex w-[var(--icon-sm)] h-[var(--icon-sm)] text-muted group-hover:text-cta [&>svg]:w-full [&>svg]:h-full"
                aria-hidden="true"
              >
                <ChevronRight strokeWidth={ICON_STROKE_WIDTH_REGULAR} />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
