'use client';

import { useEffect } from 'react';
import Select from './Select';
import { findAllowedSlots, findDefaultSlot, formatTime, TIME_SLOTS } from '@/content/shared/timeSlots';
import { FIELD_LABEL } from './formClasses';

export default function TimeChoice({ category, itemName, value, onChange, label = 'Start time', id }) {
  const allowed = findAllowedSlots(category, itemName);
  const list = (allowed || TIME_SLOTS).map((timeSlot) => ({ value: timeSlot, label: formatTime(timeSlot) }));

  useEffect(() => {
    if (!allowed || !onChange) return;
    if (!value || !allowed.includes(value)) onChange(findDefaultSlot(category, itemName));
  }, [allowed, value, onChange, category, itemName]);

  return (
    <div>
      <label className={FIELD_LABEL} htmlFor={id}>
        {label}
      </label>
      <Select id={id} label={label} value={value || ''} onChange={onChange} options={list} placeholder="Pick a time" />
    </div>
  );
}
