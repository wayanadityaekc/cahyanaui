'use client';

import DateField from './DateField';
import Select from './Select';
import { fmtHour } from '@/content/shared/timeSlots';

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

export default function DateTimeField({ label = 'Date & time', value, onChange, min, id }) {
  const [datePart = '', timePart = ''] = (value || '').split('T');
  const hour = timePart.slice(0, 2);
  const minute = timePart.slice(3, 5);

  function emit(d, h, m) {
    if (!d) return onChange('');
    onChange(`${d}T${h || '00'}:${m || '00'}`);
  }

  // Hour and minute Selects share the row equally.
  const TIMESEL = 'flex-[1_1_0] min-w-0';
  return (
    <div className="flex flex-col gap-2">
      <DateField
        id={id ? `${id}-date` : undefined}
        label={label}
        value={datePart}
        onChange={(d) => emit(d, hour, minute)}
        min={min}
        placeholder="Select date"
      />
      <div className="flex items-center gap-[0.4rem]">
        <Select
          id={id ? `${id}-hour` : undefined}
          label="Hour"
          value={hour}
          onChange={(h) => emit(datePart, h, minute)}
          options={HOURS.map((v) => ({ value: v, label: fmtHour(v) }))}
          placeholder="Hour"
          className={TIMESEL}
        />
        <span className="font-semibold text-muted">:</span>
        <Select
          id={id ? `${id}-minute` : undefined}
          label="Minute"
          value={minute}
          onChange={(m) => emit(datePart, hour, m)}
          options={MINUTES.map((v) => ({ value: v, label: v }))}
          placeholder="MM"
          className={TIMESEL}
        />
      </div>
    </div>
  );
}
