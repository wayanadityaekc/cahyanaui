'use client';

import { Select } from '@cahyana/ui';
import CurrencyPicker from '@/components/ui/CurrencyPicker';
import { useTripPrefs } from '@/components/providers/TripPrefsProvider';

// Six is the largest villa (Cahyana House sleeps 6): more would offer something neither villa has.
const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6];

// CUE's FIELD_LABEL: 12.8px, weight 500, sentence case.
const FIELD_LABEL = 'block mb-2 font-body text-small font-medium text-green tracking-normal normal-case';
// max-[361px], not 360: Tailwind's max-[N] does not match at exactly N, so a 360px phone would get two columns.
const FIELD_CELL = 'flex flex-col gap-1 min-w-0 max-[361px]:col-span-2';

// Guests + Currency, shared by the drawer and the desktop account menu; idPrefix must differ (both render on desktop).
export default function TripPrefsFields({ idPrefix = 'acct' }) {
  const { guests, setGuests } = useTripPrefs();
  return (
    <div className="grid grid-cols-2 gap-[10px]">
      <div className={FIELD_CELL}>
        <label className={FIELD_LABEL} htmlFor={`${idPrefix}-guests`}>Guests</label>
        <Select
          id={`${idPrefix}-guests`}
          label="Guests"
          value={String(guests)}
          onChange={(value) => setGuests(Number(value))}
          options={GUEST_OPTIONS.map((count) => ({ value: String(count), label: `${count} guest${count > 1 ? 's' : ''}` }))}
        />
      </div>
      <div className={FIELD_CELL}>
        <label className={FIELD_LABEL} htmlFor={`${idPrefix}-cur`}>Currency</label>
        <CurrencyPicker id={`${idPrefix}-cur`} />
      </div>
    </div>
  );
}
