import { ChevronRight } from 'lucide-react';
import Price from '@/components/Price';

// Tours that include this attraction (reverse lookup from lib/tourIndex), as white buttons; renders nothing if none.
const BTN =
  'group flex items-center gap-3 w-full py-[0.7rem] px-[0.85rem] rounded-md no-underline text-left ' +
  'bg-white [border:1px_solid_var(--line)] cursor-pointer ' +
  'transition-[border-color,scale] duration-[var(--dur)] ease-[ease] ' +
  'hover:[border-color:var(--color-cta)]';

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
