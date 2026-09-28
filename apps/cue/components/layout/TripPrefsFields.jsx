'use client';

import { FIELD_LABEL } from '@/components/ui/formClasses';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import Select from '@/components/ui/Select';
import PickupAreaSelect from '@/components/ui/PickupAreaSelect';
import CurrencyPicker from './CurrencyPicker';

// Guests / Pickup area / Currency. The phone drawer and the desktop account menu
// both render THIS, so the two places cannot drift (WO1, Wayan: prefs go in the
// account menu on desktop). `idPrefix` keeps ids unique - the drawer stays in the
// DOM at every width, so both copies exist on a desktop page at once.
const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function TripPrefsFields({ idPrefix, className = '' }) {
  const { guests, setGuests } = useTripPrefs();
  return (
    <div className={`grid grid-cols-2 gap-[10px] ${className}`}>
      <div className="flex flex-col gap-1 min-w-0">
        <label className={FIELD_LABEL} htmlFor={`${idPrefix}-guests`}>Guests</label>
        <Select
          id={`${idPrefix}-guests`}
          label="Guests"
          value={guests || 2}
          onChange={setGuests}
          options={GUEST_OPTIONS.map((n) => ({ value: String(n), label: `${n} ${n === 1 ? 'guest' : 'guests'}` }))}
          popup
        />
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <label className={FIELD_LABEL} htmlFor={`${idPrefix}-stay`}>Pickup area</label>
        <PickupAreaSelect id={`${idPrefix}-stay`} />
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <label className={FIELD_LABEL} htmlFor={`${idPrefix}-cur`}>Currency</label>
        <CurrencyPicker id={`${idPrefix}-cur`} />
      </div>
    </div>
  );
}
