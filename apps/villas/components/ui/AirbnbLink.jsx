import { AIRBNB_LINKS } from '@/lib/airbnb';

// Static "Book Now" / "Check dates" control for a known villa — a plain link
// straight to the live Airbnb listing (opens in a new tab), no JS required.
export default function AirbnbLink({ villa, className, children }) {
  return (
    <a href={AIRBNB_LINKS[villa]} target="_blank" rel="noopener" className={className}>
      {children}
    </a>
  );
}
