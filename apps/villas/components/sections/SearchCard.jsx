'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { SearchBar, SEARCH_LABEL } from '@cahyana/ui';
import DateField from '@/components/ui/DateField';
import Select from '@/components/ui/Select';
import { useBooking } from '@/components/providers/BookingProvider';

// Hero "Search" card. Feeds straight into the booking flow rather than a
// results page - with two villas, "search" means "open Book Your Stay with
// these dates and guests already in it".
//
// The shell (the overlap onto the hero, the four-column row, the bottom-edge
// alignment) is SearchBar in @cahyana/ui. The controls are the library's own
// custom ones, not native <select> / <input type="date">: a native date input
// shows an American "mm/dd/yyyy" hint to guests who do not write dates that
// way, and renders as a different widget on every platform. Check-out cannot be
// set before check-in, because DateField takes a `min`.
const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6];

export default function SearchCard() {
  const { openBooking } = useBooking();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  return (
    <SearchBar
      variant="hero"
      action={(
        <button
          type="button"
          className="btn btn-cta"
          onClick={() => openBooking({ checkIn, checkOut, guests })}
        >
          <Search className="w-[var(--icon-sm)] h-[var(--icon-sm)]" aria-hidden="true" />
          Search
        </button>
      )}
    >
      <div className="min-w-0">
        <label className={SEARCH_LABEL} htmlFor="search-checkin">Check-in</label>
        <DateField
          id="search-checkin"
          label="Check-in"
          value={checkIn}
          onChange={setCheckIn}
          placeholder="Add date"
        />
      </div>

      <div className="min-w-0">
        <label className={SEARCH_LABEL} htmlFor="search-checkout">Check-out</label>
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
        <label className={SEARCH_LABEL} htmlFor="search-guests">Guests</label>
        <Select
          id="search-guests"
          label="Guests"
          value={String(guests)}
          onChange={(v) => setGuests(Number(v))}
          options={GUEST_OPTIONS.map((n) => ({ value: String(n), label: `${n} guest${n > 1 ? 's' : ''}` }))}
        />
      </div>
    </SearchBar>
  );
}
