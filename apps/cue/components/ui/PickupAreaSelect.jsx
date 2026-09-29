'use client';

import { useMemo } from 'react';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import { usePricing } from '@/state/PricingProvider';
import Select from './Select';

// Label shows the bare area ('Kuta'); the value stays the full route key used to price the pick-up.
function areaName(route) {
  return route.replace(/ – Ubud$/, '').replace(/ Area$/, '');
}

// Self-contained pickup-area picker that reads and writes TripPrefs' `stay` itself.
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
