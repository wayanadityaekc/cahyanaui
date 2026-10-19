'use client';

import DateField from './DateField';
import Select from './Select';
import { formatHour } from '@/content/shared/timeSlots';

const HOURS = Array.from({ length: 24 }, (unusedValue, index) => String(index).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (unusedValue, index) => String(index).padStart(2, '0'));

export default function DateTimeField({ label = 'Date & time', value, onChange, min, id }) {
  const [datePart = '', timePart = ''] = (value || '').split('T');
  const hour = timePart.slice(0, 2);
  const minute = timePart.slice(3, 5);

  function emit(dateValue, hourValue, minuteValue) {
    if (!dateValue) return onChange('');
    onChange(`${dateValue}T${hourValue || '00'}:${minuteValue || '00'}`);
  }

  const TIMESEL = 'flex-[1_1_0] min-w-0';
  return (
    <div className="flex flex-col gap-2">
      <DateField
        id={id ? `${id}-date` : undefined}
        label={label}
        value={datePart}
        onChange={(selectedDate) => emit(selectedDate, hour, minute)}
        min={min}
        placeholder="Select date"
      />
      <div className="flex items-center gap-[0.4rem]">
        <Select
          id={id ? `${id}-hour` : undefined}
          label="Hour"
          value={hour}
          onChange={(selectedHour) => emit(datePart, selectedHour, minute)}
          options={HOURS.map((hourOption) => ({ value: hourOption, label: formatHour(hourOption) }))}
          placeholder="Hour"
          className={TIMESEL}
        />
        <span className="font-semibold text-muted">:</span>
        <Select
          id={id ? `${id}-minute` : undefined}
          label="Minute"
          value={minute}
          onChange={(selectedMinute) => emit(datePart, hour, selectedMinute)}
          options={MINUTES.map((minuteOption) => ({ value: minuteOption, label: minuteOption }))}
          placeholder="MM"
          className={TIMESEL}
        />
      </div>
    </div>
  );
}
