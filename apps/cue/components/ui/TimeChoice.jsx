'use client';

import { useEffect } from 'react';
import Select from './Select';
import { allowedSlots, defaultSlot, fmtTime, TIME_SLOTS } from '@/content/shared/timeSlots';
import { FIELD_LABEL } from './formClasses';

// Start-time dropdown listing ONLY the item's allowed slots (never greyed-out extras), shown in 12-hour time.

export default function TimeChoice({ category, itemName, value, onChange, label = 'Start time', id }) {
  const allowed = allowedSlots(category, itemName);
  const list = (allowed || TIME_SLOTS).map((t) => ({ value: t, label: fmtTime(t) }));

  // Seed or correct restricted items to an allowed slot, in an effect (never in render); free items stay empty.
  useEffect(() => {
    if (!allowed || !onChange) return;
    if (!value || !allowed.includes(value)) onChange(defaultSlot(category, itemName));
  }, [allowed, value, onChange, category, itemName]);

  return (
    <div>
      <label className={FIELD_LABEL} htmlFor={id}>{label}</label>
      <Select
        id={id}
        label={label}
        value={value || ''}
        onChange={onChange}
        options={list}
        placeholder="Pick a time"
      />
    </div>
  );
}
