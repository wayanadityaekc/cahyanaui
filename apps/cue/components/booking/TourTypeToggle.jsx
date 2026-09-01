'use client';

import { useTripPrefs } from '@/state/TripPrefsProvider';

export default function TourTypeToggle({ mode, onChange, variant = 'detail' }) {
  const { displayGuests } = useTripPrefs();
  const note =
    mode === 'exclusive'
      ? `Includes entrance tickets · price for ${displayGuests} pax`
      : 'Driver only · entrance tickets not included';

  return (
    <div className={`tour-type tour-type--${variant}`} onClick={(e) => e.stopPropagation()}>
      <div className="tour-type__toggle" role="tablist" aria-label="Tour type">
        <button type="button" className={`tour-type__btn${mode === 'standard' ? ' is-active' : ''}`} role="tab" aria-selected={mode === 'standard'} onClick={() => onChange('standard')}>Standard</button>
        <button type="button" className={`tour-type__btn${mode === 'exclusive' ? ' is-active' : ''}`} role="tab" aria-selected={mode === 'exclusive'} onClick={() => onChange('exclusive')}>Exclusive</button>
      </div>
      <small className="tour-type__note">{note}</small>
    </div>
  );
}
