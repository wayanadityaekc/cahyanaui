import Price from '@/components/Price';

// Sits directly under the single price in the booking card on an attraction
// page. The guest is looking at one number; this says plainly that the same
// place is also a stop on a full day, and what that day costs, so the two
// prices are a comparison rather than a contradiction.
//
// Built from the reverse lookup in lib/tourIndex (which tours list this refId),
// so nothing is hand-written and a stop added to a tour shows up here by itself.
// Renders nothing when the attraction is on no tour.
export default function TourComparisonBox({ tours }) {
  if (!tours || !tours.length) return null;
  return (
    <div className="mb-[1.1rem] py-[0.8rem] px-[0.9rem] [border:1px_solid_var(--line)] [border-left:3px_solid_var(--color-cta)] rounded-md bg-cream">
      <p className="m-0 mb-[0.5rem] text-label font-medium tracking-[0.12em] uppercase text-muted">
        Also part of
      </p>
      <ul className="grid gap-[0.55rem] m-0 p-0 list-none">
        {tours.map((t) => (
          <li key={t.href}>
            <a
              href={t.href}
              className="group block no-underline transition-[color,scale] duration-[var(--dur)] ease-[ease]"
            >
              <span className="block text-strong font-semibold text-gold group-hover:text-cta group-hover:underline">
                {t.name}
              </span>
              <span className="block mt-[0.1rem] text-small text-muted">
                {t.stops} stops · from{' '}
                <span className="font-semibold text-amber">
                  <Price name={t.priceName} fallback={t.priceFallback || ''} />
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
