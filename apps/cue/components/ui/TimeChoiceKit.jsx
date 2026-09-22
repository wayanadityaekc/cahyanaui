'use client';

import { useState } from 'react';
import TimeChoice from './TimeChoice';
import { allowedSlots, defaultSlot } from '@/content/shared/timeSlots';

/**
 * Demo strip for the /ui-kit page ONLY - it exists so the four shapes of TimeChoice
 * can be seen (and screenshotted) side by side against real catalog items, instead of
 * being drawn by hand in a mock. Nothing in the live flow imports this.
 * /ui-kit is noindexed (see the page's metadata).
 */
const ITEMS = [
  ['performance', 'Kecak Dance', 'satu jam saja'],
  ['experience', 'Mount Batur Trekking', 'dua jam'],
  ['tour', 'Ubud Tour', 'tiga jam'],
  ['tour', 'East Bali Tour', 'rentang (Lempuyang)'],
  ['experience', 'ATV', 'rentang (daylight)'],
  ['transfer', 'Airport – Ubud', 'bebas 24 jam'],
];

export default function TimeChoiceKit() {
  const [vals, setVals] = useState(() =>
    Object.fromEntries(ITEMS.map(([c, n]) => [n, defaultSlot(c, n)]))
  );
  return (
    <div className="grid gap-5 max-w-[760px] min-[769px]:grid-cols-2">
      {ITEMS.map(([category, name, note]) => {
        const a = allowedSlots(category, name);
        return (
          <div
            key={name}
            className="p-4 rounded-md bg-white [border:1px_solid_var(--line)]"
          >
            <p className="mb-1 font-body text-strong font-semibold text-gold">{name}</p>
            <p className="mb-3 font-body text-small text-muted">
              {note} &middot; {a ? `${a.length} jam` : 'semua jam'}
            </p>
            <TimeChoice
              category={category}
              itemName={name}
              id={`kit-${name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`}
              value={vals[name]}
              onChange={(t) => setVals((v) => ({ ...v, [name]: t }))}
            />
          </div>
        );
      })}
    </div>
  );
}
