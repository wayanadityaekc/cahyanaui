'use client';

import { FIELD_LABEL } from '@/components/ui/formClasses';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import Select from '@/components/ui/Select';
import PickupAreaSelect from '@/components/ui/PickupAreaSelect';
import CurrencyPicker from './CurrencyPicker';

const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function TripPrefsFields({ idPrefix, className = '' }) {
  const { guests, setGuests } = useTripPrefs();
  return (
    <div className={`grid grid-cols-2 gap-[10px] ${className}`}>
      <div className="flex flex-col gap-1 min-w-0">
        <label className={FIELD_LABEL} htmlFor={`${idPrefix}-guests`}>
          Guests
        </label>
        <Select
          id={`${idPrefix}-guests`}
          label="Guests"
          value={guests || 2}
          onChange={setGuests}
          options={GUEST_OPTIONS.map((guestCount) => ({
            value: String(guestCount),
            label: `${guestCount} ${guestCount === 1 ? 'guest' : 'guests'}`,
          }))}
          popup
        />
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <label className={FIELD_LABEL} htmlFor={`${idPrefix}-stay`}>
          Pickup area
        </label>
        <PickupAreaSelect id={`${idPrefix}-stay`} />
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <label className={FIELD_LABEL} htmlFor={`${idPrefix}-cur`}>
          Currency
        </label>
        <CurrencyPicker id={`${idPrefix}-cur`} />
      </div>
    </div>
  );
}
