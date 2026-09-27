'use client';

import { useState } from 'react';
import { CalendarDays, Coins, Search, UserRound } from 'lucide-react';
import { Button, DateRangeField, SearchBar, SEARCH_LABEL } from '@cahyana/ui';
import Select from '@/components/ui/Select';
import { useBooking } from '@/components/providers/BookingProvider';
import { useTripPrefs } from '@/components/providers/TripPrefsProvider';
import { useCurrency } from '@/components/providers/CurrencyProvider';
import { CURRENCIES } from '@/lib/currency';

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

export default function SearchCard({ layout = 'bar' }) {
  const { openBooking } = useBooking();
  const { guests, setGuests } = useTripPrefs();
  const { currency, setCurrency } = useCurrency();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  const panel = layout === 'panel';
  const search = (
    <Button full={panel} onClick={() => openBooking({ checkIn, checkOut, guests })}>
      <Search className="w-[var(--icon-sm)] h-[var(--icon-sm)]" aria-hidden="true" />
      Search
    </Button>
  );

  // THE PANEL'S COLUMNS, in the shape of CUE's booking card (Wayan sent a shot
  // of it: "ambil pola nya kolom nya dan pakai global collor lu sendiri").
  // Every row is the same rich control - icon, small label, value, chevron - so
  // the form reads as one list of questions rather than as three widgets. The
  // colours are ours; only the pattern is borrowed.
  const iconCls = 'w-[var(--icon-md)] h-[var(--icon-md)]';
  const panelFields = (
    <>
      {/* ONE row for the whole stay. It was already a range picker, but it drew
          two triggers side by side, so it read as two questions. */}
      <DateRangeField
        id="search-checkin"
        hint="Dates"
        icon={<CalendarDays className={iconCls} strokeWidth={1.7} aria-hidden="true" />}
        placeholders={{ start: 'Select dates', end: 'Add date' }}
        value={{ checkIn, checkOut }}
        onChange={(r) => { setCheckIn(r.checkIn); setCheckOut(r.checkOut); }}
      />
      <Select
        id="search-guests"
        label="Guests"
        hint="Guests"
        icon={<UserRound className={iconCls} strokeWidth={1.7} aria-hidden="true" />}
        value={String(guests)}
        onChange={(v) => setGuests(Number(v))}
        options={GUEST_OPTIONS.map((n) => ({ value: String(n), label: `${n} guest${n > 1 ? 's' : ''}` }))}
      />
      {/* Currency belongs next to the price the guest is about to be quoted, not
          only in the drawer. Same five CUE sells in - the list already matches. */}
      <Select
        id="search-currency"
        label="Currency"
        hint="Currency"
        icon={<Coins className={iconCls} strokeWidth={1.7} aria-hidden="true" />}
        value={currency}
        onChange={setCurrency}
        options={CURRENCIES.map((c) => ({ value: c.code, label: `${c.code} - ${c.name}` }))}
      />
    </>
  );

  const fields = (
    <>
      {/* The range picker spans the two date columns: it renders its own pair
          of triggers, so the grid cell it sits in is two columns wide. In the
          panel there is one column, so it spans nothing. */}
      <div className={panel ? 'min-w-0' : 'min-w-0 sm:col-span-2'}>
        <label className={SEARCH_LABEL}>Dates</label>
        <DateRangeField
          id="search-checkin"
          value={{ checkIn, checkOut }}
          onChange={(r) => { setCheckIn(r.checkIn); setCheckOut(r.checkOut); }}
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
    </>
  );

  // 'panel' is the booking form living INSIDE the hero: a tall frosted card,
  // one field per row, instead of the wide bar that overlaps the hero's edge.
  if (panel) {
    // THE ONE ROUNDED SURFACE ON THE PAGE (Wayan: "di booking form kasi border
    // radius dikit"). Everything else went square; this is the one thing the
    // guest is meant to act on, and rounding only it is what marks it out now
    // that no shadow can. --r-sm is the smallest step the scale has, which is
    // what "dikit" asks for.
    return (
      <div className="w-full bg-surface-raised/92 backdrop-blur-md p-5 sm:p-6 rounded-sm">
        <p className="text-label font-medium tracking-[0.14em] uppercase text-muted">Book your stay</p>
        <h2 className="text-h3 font-semibold text-gold mt-1 mb-4">Check your dates</h2>
        <div className="grid grid-cols-1 gap-[0.6rem]">
          {panelFields}
          {search}
        </div>
      </div>
    );
  }

  return (
    <SearchBar variant="hero" action={search}>
      {fields}
    </SearchBar>
  );
}
