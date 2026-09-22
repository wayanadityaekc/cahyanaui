'use client';

import { useEffect } from 'react';
import { Clock } from 'lucide-react';
import Select from './Select';
import { allowedSlots, TIME_SLOTS } from '@/content/shared/timeSlots';
import { BTN_SM } from './btnClasses';
import { FIELD_LABEL } from './formClasses';

/**
 * Start time for one booked item (Sep 2026, Wayan: "kita nambah data baru di setiap
 * tour yang di pilih harus user milih start jam berapa").
 *
 * Wayan picked shape "C": the control matches how much choice there actually is,
 * instead of one 48-row dropdown for everything.
 *   1 slot   -> NOT a control. A sentence. Kecak runs at 19:00 and nothing else, so
 *               a dropdown holding one option is a decision the guest cannot make.
 *   2-3      -> the times side by side. Zero scrolling, and the whole offer is
 *               visible at a glance (a normal tour is 08:00 / 08:30 / 09:00).
 *   4+       -> the shared Select. Lempuyang is 13 slots, daylight is 19.
 *   no limit -> the shared Select over the full day (charter / transfer, 48).
 *
 * Measured, and the reason shape A was dropped: showing all 48 slots with the rest
 * disabled means a guest booking Ubud Tour scrolls past 45 dead rows to reach 3 live
 * ones, and Kecak becomes a 48-row list with a single pickable row. So the sentence
 * and chip shapes only ever show times the item can actually start at.
 *
 * Times read as 12-hour with AM/PM, which is what the booking popup already showed
 * and what the confirmation emails print (cahyana-api fmtTime12). NOTE: the charter
 * builder's own picker prints 24-hour ("06:00"). That difference is older than this
 * component and is not settled - see the CLAUDE.md note.
 */

const fmt = (t) => {
  const [h, m] = t.split(':').map(Number);
  const period = h < 12 ? 'AM' : 'PM';
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, '0')} ${period}`;
};

// One offered time: the same geometry as every other button on the site (BTN_SM), so
// these read as buttons and not as a second kind of control.
const chip = (on) =>
  `${BTN_SM} cursor-pointer [transition:background-color_var(--dur)_var(--ease),color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)] ` +
  (on
    ? 'bg-cta text-white [border:1px_solid_var(--color-cta)]'
    : 'bg-white text-green [border:1px_solid_var(--line)] hover:bg-cream');

const FIXED =
  'flex items-center gap-[0.4rem] font-body text-small text-green ' +
  '[&>svg]:w-4 [&>svg]:h-4 [&>svg]:text-muted [&>svg]:shrink-0';

export default function TimeChoice({ category, itemName, value, onChange, label = 'Start time', id }) {
  const allowed = allowedSlots(category, itemName);
  const only = allowed && allowed.length === 1 ? allowed[0] : null;

  // When there is exactly one possible start the guest is told, not asked - but the
  // value still has to be SET, or the row saves without the time this whole feature
  // exists for. Callers seed it from defaultSlot(); this covers the ones that did not.
  // In an effect, never in render: setting a parent's state while rendering is how you
  // get an update loop. Hooks run before the early returns below, as they must.
  useEffect(() => {
    if (only && value !== only && onChange) onChange(only);
  }, [only, value, onChange]);

  if (only) {
    return (
      <div>
        <span className={FIELD_LABEL}>{label}</span>
        <p className={FIXED}>
          <Clock strokeWidth={1.7} aria-hidden="true" />
          Starts {fmt(only)}
        </p>
      </div>
    );
  }

  // Two or three: show them. A dropdown for three options costs a tap to open, a
  // scroll and a tap to pick, for something that fits on one line.
  if (allowed && allowed.length <= 3) {
    return (
      <div>
        <span className={FIELD_LABEL} id={id ? `${id}-label` : undefined}>{label}</span>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby={id ? `${id}-label` : undefined}>
          {allowed.map((t) => (
            <button
              key={t}
              type="button"
              role="radio"
              aria-checked={value === t}
              className={chip(value === t)}
              onClick={() => onChange(t)}
            >
              {fmt(t)}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // A real range, or no limit at all (charter/transfer/airport are free, all 48): the
  // shared control. Only times the item can start at are listed - a disabled row the
  // guest has to scroll past is noise.
  const list = (allowed || TIME_SLOTS).map((t) => ({ value: t, label: fmt(t) }));
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
