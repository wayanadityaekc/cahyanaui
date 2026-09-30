'use client';

import { useState } from 'react';
import { CalendarDays, Coins, Search, UserRound } from 'lucide-react';
import { Button, DateRangeField, SearchBar, SEARCH_LABEL } from '@cahyana/ui';
import Select from '@/components/ui/Select';
import { useBooking } from '@/components/providers/BookingProvider';
import { useTripPrefs } from '@/components/providers/TripPrefsProvider';
import { useCurrency } from '@/components/providers/CurrencyProvider';
import { CURRENCIES, CURRENCY_NAMES } from '@/lib/currency';

// Hero search card: opens the booking flow prefilled; custom controls, since native date inputs show "mm/dd/yyyy".
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

  // Panel rows follow CUE's booking card: icon, label, value, chevron on every row, so it reads as one list of questions.
  const iconCls = 'w-[var(--icon-md)] h-[var(--icon-md)]';
  const panelFields = (
    <>
      {/* One row for the whole stay, so the dates read as one question instead of two. */}
      <DateRangeField
        id="search-checkin"
        hint="Dates"
        icon={<CalendarDays className={iconCls} strokeWidth={1.7} aria-hidden="true" />}
        placeholders={{ start: 'Select dates', end: 'Add date' }}
        value={{ checkIn, checkOut }}
        onChange={(range) => { setCheckIn(range.checkIn); setCheckOut(range.checkOut); }}
      />
      <Select
        id="search-guests"
        label="Guests"
        hint="Guests"
        icon={<UserRound className={iconCls} strokeWidth={1.7} aria-hidden="true" />}
        value={String(guests)}
        onChange={(value) => setGuests(Number(value))}
        options={GUEST_OPTIONS.map((count) => ({ value: String(count), label: `${count} guest${count > 1 ? 's' : ''}` }))}
      />
      {/* Currency sits next to the price the guest is about to be quoted, not only in the drawer. */}
      <Select
        id="search-currency"
        label="Currency"
        hint="Currency"
        icon={<Coins className={iconCls} strokeWidth={1.7} aria-hidden="true" />}
        value={currency}
        onChange={setCurrency}
        options={CURRENCIES.map((code) => ({ value: code, label: `${code} - ${CURRENCY_NAMES[code]}` }))}
      />
    </>
  );

  const fields = (
    <>
      {/* The range picker draws two triggers, so it spans two grid columns in the bar and one in the panel. */}
      <div className={panel ? 'min-w-0' : 'min-w-0 sm:col-span-2'}>
        <label className={SEARCH_LABEL}>Dates</label>
        <DateRangeField
          id="search-checkin"
          value={{ checkIn, checkOut }}
          onChange={(range) => { setCheckIn(range.checkIn); setCheckOut(range.checkOut); }}
        />
      </div>

      <div className="min-w-0">
        <label className={SEARCH_LABEL} htmlFor="search-guests">Guests</label>
        <Select
          id="search-guests"
          label="Guests"
          value={String(guests)}
          onChange={(value) => setGuests(Number(value))}
          options={GUEST_OPTIONS.map((count) => ({ value: String(count), label: `${count} guest${count > 1 ? 's' : ''}` }))}
        />
      </div>
    </>
  );

  // 'panel' is the booking form inside the hero: one field per row instead of the wide bar.
  if (panel) {
    // The one rounded surface on the page: it is what the guest acts on, and with no shadows rounding is what marks it.
    return (
      <div className="w-full bg-surface-raised/92 backdrop-blur-md p-5 sm:p-6 rounded-sm">
        {/* No uppercase kicker above the heading: it made two labels for one panel (Wayan, Sep 2026). */}
        <h2 className="text-h3 font-medium text-gold mb-4">Check your dates</h2>
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
