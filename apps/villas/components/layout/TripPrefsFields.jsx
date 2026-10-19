'use client';

import { Select } from '@cahyana/ui';
import CurrencyPicker from '@/components/ui/CurrencyPicker';
import { useTripPrefs } from '@/components/providers/TripPrefsProvider';

const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6];

const FIELD_LABEL = 'block mb-2 font-body text-small font-medium text-green tracking-normal normal-case';
const FIELD_CELL = 'flex flex-col gap-1 min-w-0 max-[361px]:col-span-2';

export default function TripPrefsFields({ idPrefix = 'acct' }) {
  const { guests, setGuests } = useTripPrefs();
  return (
    <div className="grid grid-cols-2 gap-[10px]">
      <div className={FIELD_CELL}>
        <label className={FIELD_LABEL} htmlFor={`${idPrefix}-guests`}>
          Guests
        </label>
        <Select
          id={`${idPrefix}-guests`}
          label="Guests"
          value={String(guests)}
          onChange={(value) => setGuests(Number(value))}
          options={GUEST_OPTIONS.map((count) => ({
            value: String(count),
            label: `${count} guest${count > 1 ? 's' : ''}`,
          }))}
        />
      </div>
      <div className={FIELD_CELL}>
        <label className={FIELD_LABEL} htmlFor={`${idPrefix}-cur`}>
          Currency
        </label>
        <CurrencyPicker id={`${idPrefix}-cur`} />
      </div>
    </div>
  );
}
