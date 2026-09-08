'use client';

import { useState } from 'react';
import { useBooking } from '@/components/providers/BookingProvider';

// Hero "Search" card (overlaps the hero photo edge, per the mockup). Feeds
// straight into the booking flow rather than a separate search results
// page — with two villas total, "search" here means "open Book Your Stay
// pre-filled with these dates/guests". Mobile stacks every field into its
// own full-width row (grid-cols-1); desktop stays a single 4-column row.
export default function SearchCard() {
  const { openBooking } = useBooking();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  return (
    <div className="card relative z-10 mx-auto -mt-10 sm:-mt-12 max-w-4xl grid grid-cols-1 sm:grid-cols-4 gap-2 p-3">
      <div className="field-shell">
        <div className="w-full">
          <label htmlFor="search-checkin">Check-in</label>
          <input id="search-checkin" type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
        </div>
      </div>
      <div className="field-shell">
        <div className="w-full">
          <label htmlFor="search-checkout">Check-out</label>
          <input id="search-checkout" type="date" value={checkOut} min={checkIn || undefined} onChange={(e) => setCheckOut(e.target.value)} />
        </div>
      </div>
      <div className="field-shell">
        <div className="w-full">
          <label htmlFor="search-guests">Guests</label>
          <select id="search-guests" value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
      </div>
      <button
        type="button"
        className="btn btn-cta"
        onClick={() => openBooking({ checkIn, checkOut, guests })}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
        </svg>
        Search
      </button>
    </div>
  );
}
