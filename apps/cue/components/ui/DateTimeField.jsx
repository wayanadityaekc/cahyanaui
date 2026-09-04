'use client';

import DateField from './DateField';
import Select from './Select';

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

export default function DateTimeField({ label = 'Date & time', value, onChange, min, id }) {
  const [datePart = '', timePart = ''] = (value || '').split('T');
  const hh = timePart.slice(0, 2);
  const mm = timePart.slice(3, 5);

  const emit = (d, h, m) => {
    if (!d) return onChange('');
    onChange(`${d}T${h || '00'}:${m || '00'}`);
  };

  return (
    <div className="dtf">
      <DateField
        id={id ? `${id}-date` : undefined}
        label={label}
        value={datePart}
        onChange={(d) => emit(d, hh, mm)}
        min={min}
        placeholder="Select date"
      />
      <div className="dtf__time">
        <Select
          id={id ? `${id}-hour` : undefined}
          label="Hour"
          value={hh}
          onChange={(h) => emit(datePart, h, mm)}
          options={HOURS.map((v) => ({ value: v, label: v }))}
          placeholder="HH"
        />
        <span className="dtf__colon">:</span>
        <Select
          id={id ? `${id}-minute` : undefined}
          label="Minute"
          value={mm}
          onChange={(m) => emit(datePart, hh, m)}
          options={MINUTES.map((v) => ({ value: v, label: v }))}
          placeholder="MM"
        />
      </div>
    </div>
  );
}
