'use client';

import { useState } from 'react';
import { useBooking } from '@/components/providers/BookingProvider';

// "Pill Bar" search - one seamless bar with hairlines between segments,
// replacing the old grid of four separately-boxed fields. This is Opsi 1
// from the booking-bar design options Wayan picked. Desktop: a single row
// ending in a round icon button. Mobile: segments stack and the button
// becomes full-width with a label - easier to tap than a small icon-only
// circle - everything else follows the same design.
export default function SearchCard() {
  const { openBooking } = useBooking();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  return (
    <div className="relative z-10 mx-auto -mt-10 sm:-mt-12 max-w-3xl bg-white shadow-lg rounded-2xl sm:rounded-full overflow-hidden">
      <div className="flex flex-col sm:flex-row divide-y divide-line sm:divide-y-0 sm:divide-x">
        <div className="pill-seg">
          <label htmlFor="search-checkin">Check-in</label>
          <input
            id="search-checkin"
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
        </div>
        <div className="pill-seg">
          <label htmlFor="search-checkout">Check-out</label>
          <input
            id="search-checkout"
            type="date"
            value={checkOut}
            min={checkIn || undefined}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>
        <div className="pill-seg sm:max-w-[8.5rem]">
          <label htmlFor="search-guests">Guests</label>
          <select id="search-guests" value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
        <div className="p-2 sm:flex sm:items-center sm:pr-2">
          <button
            type="button"
            onClick={() => openBooking({ checkIn, checkOut, guests })}
            className="btn btn-cta btn-full sm:w-11 sm:h-11 sm:p-0 sm:rounded-full sm:justify-center"
            aria-label="Search"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
            </svg>
            <span className="sm:hidden">Search</span>
          </button>
        </div>
      </div>
    </div>
  );
}
