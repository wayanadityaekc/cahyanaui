import Link from 'next/link';
import { BOOKING_TERMS } from '@/content/policies';

// The three things a guest is agreeing to, shown before they commit rather than
// on a page they would have to go looking for. Read from content/policies.js, so
// the booking sheet, the villa panel and Our Company cannot state different
// terms.
//
// Deliberately NOT bulleted: at this size the markers are most of the ink.
// Hairlines between the rows group them just as well and stay quiet.
export default function BookingTerms({ className = '' }) {
  return (
    <div className={`text-label text-muted ${className}`}>
      <ul className="list-none">
        {BOOKING_TERMS.map((t, i) => (
          <li key={t} className={i ? 'pt-1.5 mt-1.5 [border-top:1px_solid_var(--line)]' : ''}>{t}</li>
        ))}
      </ul>
      <Link href="/our-company#cancellation" className="inline-block mt-2 text-gold underline">
        Cancellation policy
      </Link>
    </div>
  );
}
