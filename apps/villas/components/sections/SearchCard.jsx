'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import DateField from '@/components/ui/DateField';
import Select from '@/components/ui/Select';
import { useBooking } from '@/components/providers/BookingProvider';

// Hero "Search" card. Feeds straight into the booking flow rather than a
// results page — with two villas, "search" means "open Book Your Stay with
// these dates and guests already in it".
//
// The three fields are CUE's custom controls, not native <select> and
// <input type="date">. Native ones render as a different widget on every
// platform and show an American "mm/dd/yyyy" hint to guests who do not write
// dates that way; CUE replaced every native control site-wide for exactly
// that. The date picker is a calendar, and check-out cannot be set before
// check-in because DateField takes a `min`.
//
// Mobile stacks each field into its own full-width row; desktop stays one
// four-column row.
const FIELD_LABEL = 'block mb-1 caps';
const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6];

export default function SearchCard() {
  const { openBooking } = useBooking();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  return (
    <div className="card relative z-10 mx-auto -mt-10 sm:-mt-12 max-w-4xl grid grid-cols-1 sm:grid-cols-4 gap-3 p-3 sm:items-end">
      <div className="min-w-0">
        <label className={FIELD_LABEL} htmlFor="search-checkin">Check-in</label>
        <DateField
          id="search-checkin"
          label="Check-in"
          value={checkIn}
          onChange={setCheckIn}
          placeholder="Add date"
        />
      </div>

      <div className="min-w-0">
        <label className={FIELD_LABEL} htmlFor="search-checkout">Check-out</label>
        <DateField
          id="search-checkout"
          label="Check-out"
          value={checkOut}
          onChange={setCheckOut}
          min={checkIn || undefined}
          placeholder="Add date"
        />
      </div>

      <div className="min-w-0">
        <label className={FIELD_LABEL} htmlFor="search-guests">Guests</label>
        <Select
          id="search-guests"
          label="Guests"
          value={String(guests)}
          onChange={(v) => setGuests(Number(v))}
          options={GUEST_OPTIONS.map((n) => ({ value: String(n), label: `${n} guest${n > 1 ? 's' : ''}` }))}
        />
      </div>

      <button
        type="button"
        className="btn btn-cta"
        onClick={() => openBooking({ checkIn, checkOut, guests })}
      >
        <Search className="w-[var(--icon-sm)] h-[var(--icon-sm)]" aria-hidden="true" />
        Search
      </button>
    </div>
  );
}
