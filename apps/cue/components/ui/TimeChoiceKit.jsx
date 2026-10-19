'use client';

import { useState } from 'react';
import TimeChoice from './TimeChoice';
import DateField from './DateField';
import { allowedSlots, defaultSlot } from '@/content/shared/timeSlots';

const ITEMS = [
  ['performance', 'Kecak Dance', 'satu jam saja'],
  ['experience', 'Mount Batur Trekking', 'dua jam'],
  ['tour', 'Ubud Tour', 'tiga jam'],
  ['tour', 'East Bali Tour', 'rentang (Lempuyang)'],
  ['experience', 'ATV', 'rentang (daylight)'],
  ['transfer', 'Airport – Ubud', 'bebas 24 jam'],
];

export default function TimeChoiceKit() {
  const [values, setValues] = useState(() =>
    Object.fromEntries(ITEMS.map(([itemCategory, itemName]) => [itemName, defaultSlot(itemCategory, itemName)])),
  );
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState(defaultSlot('tour', 'Ubud Tour'));
  return (
    <>
      <div className="mb-6 p-4 rounded-md bg-white [border:1px_solid_var(--line)] max-w-[370px]" data-merged>
        <p className="mb-1 font-body text-strong font-semibold text-gold">Ubud Tour</p>
        <p className="mb-3 font-body text-small text-muted">tanggal + jam, satu panel</p>
        <DateField
          id="kit-merged"
          label="Date & start time"
          value={selectedDate}
          onChange={setSelectedDate}
          withTime
          time={selectedTime}
          onTimeChange={setSelectedTime}
          category="tour"
          itemName="Ubud Tour"
        />
      </div>
      <div className="grid gap-5 max-w-[760px] min-[769px]:grid-cols-2">
        {ITEMS.map(([category, name, note]) => {
          const slots = allowedSlots(category, name);
          return (
            <div key={name} className="p-4 rounded-md bg-white [border:1px_solid_var(--line)]">
              <p className="mb-1 font-body text-strong font-semibold text-gold">{name}</p>
              <p className="mb-3 font-body text-small text-muted">
                {note} &middot; {slots ? `${slots.length} jam` : 'semua jam'}
              </p>
              <TimeChoice
                category={category}
                itemName={name}
                id={`kit-${name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`}
                value={values[name]}
                onChange={(time) => setValues((previousValues) => ({ ...previousValues, [name]: time }))}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
