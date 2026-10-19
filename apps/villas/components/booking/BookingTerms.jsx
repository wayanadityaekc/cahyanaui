import Link from 'next/link';
import { BOOKING_TERMS } from '@/content/policies';

export default function BookingTerms({ className = '' }) {
  return (
    <div className={`text-label text-muted ${className}`}>
      <ul className="list-none">
        {BOOKING_TERMS.map((term, index) => (
          <li key={term} className={index ? 'pt-1.5 mt-1.5 [border-top:1px_solid_var(--line)]' : ''}>
            {term}
          </li>
        ))}
      </ul>
      <Link href="/our-company#cancellation" className="inline-block mt-2 text-gold underline">
        Cancellation policy
      </Link>
    </div>
  );
}
