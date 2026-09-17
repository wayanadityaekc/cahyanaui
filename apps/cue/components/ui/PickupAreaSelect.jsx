'use client';

import { useMemo } from 'react';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import { usePricing } from '@/state/PricingProvider';
import Select from './Select';

// Turns a transfer-route key ("Kuta Area – Ubud", "Airport – Ubud") into the bare
// area name guests should see ("Kuta", "Airport") - the full route string stays
// the underlying value (still used server-side to price the pick-up surcharge as
// the "area to Ubud" transfer price), only the dropdown label is cleaned (Wayan,
// 12 Sep 2026: guests shouldn't see "Kuta to Ubud", just "Kuta").
function areaName(route) {
  return route.replace(/ – Ubud$/, '').replace(/ Area$/, '');
}

// Self-contained pickup-area picker: reads/writes TripPrefs' `stay` itself, so a
// caller just drops it in - no options-building or value/onChange plumbing needed.
// Replaces near-identical stayOptions logic that used to be duplicated in Navbar
// and HeroSearch (both showed the raw route string as the label).
export default function PickupAreaSelect({ id, className = '' }) {
  const { stay, setStay } = useTripPrefs();
  const pricing = usePricing();
  const catalog = pricing && pricing.catalog;

  const options = useMemo(() => {
    const base = [{ value: 'ubud', label: 'Ubud & nearby' }];
    if (!catalog) return base;
    return base.concat(catalog.transfers.map((t) => ({ value: t.route, label: areaName(t.route) })));
  }, [catalog]);

  return (
    <Select
      id={id}
      label="Pickup area"
      value={stay || 'ubud'}
      onChange={setStay}
      options={options}
      className={className}
    />
  );
}
