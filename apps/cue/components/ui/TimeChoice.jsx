'use client';

import { useEffect } from 'react';
import Select from './Select';
import { allowedSlots, defaultSlot, TIME_SLOTS } from '@/content/shared/timeSlots';
import { FIELD_LABEL } from './formClasses';

/**
 * Start time for one booked item (Sep 2026, Wayan: "kita nambah data baru di setiap
 * tour yang di pilih harus user milih start jam berapa").
 *
 * ONE SHAPE for everything (Wayan: "konsisten aja, buat semya dengan style yang sama
 * seperti contoh east bali tour, tapi pilihanya yang di batasi"): the same dropdown as
 * every other control on this site, holding ONLY the times the item can actually start
 * at. Kecak gets a dropdown with one row, a normal tour three, Lempuyang thirteen, and
 * charter / transfer / airport all 48 because Wayan wants those free.
 *
 * A FOUR-SHAPE VERSION WAS BUILT AND REJECTED (a sentence for one slot, chips for two
 * or three, dropdown for a range). It read well in the kit, but it meant a guest met
 * three different controls for the same question depending on which tour they picked.
 * Do not reintroduce the chips or the sentence - verify-timechoice.mjs fails if either
 * comes back.
 *
 * What it must also NOT become is all 48 rows with the disallowed ones greyed out.
 * Measured: Ubud Tour would be 3 live rows behind 45 dead ones, Kecak a 48-row list
 * with one pickable row. The restriction happens by LISTING less, never by disabling
 * more.
 *
 * Times read as 12-hour with AM/PM, which is what the booking popup already showed and
 * what the confirmation emails print (cahyana-api fmtTime12). NOTE: the charter
 * builder's own picker prints 24-hour ("06:00"); that difference predates this
 * component and is not settled.
 */

const fmt = (t) => {
  const [h, m] = t.split(':').map(Number);
  const period = h < 12 ? 'AM' : 'PM';
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, '0')} ${period}`;
};

export default function TimeChoice({ category, itemName, value, onChange, label = 'Start time', id }) {
  const allowed = allowedSlots(category, itemName);
  const list = (allowed || TIME_SLOTS).map((t) => ({ value: t, label: fmt(t) }));

  // A row saved without a time defeats the whole feature, so a restricted item is
  // seeded with its first allowed slot - and a value that is no longer allowed (the
  // guest swapped the tour under it) is corrected rather than left standing.
  // In an effect, never in render: setting a parent's state while rendering loops.
  // Unrestricted items (charter / transfer / airport) are left EMPTY on purpose -
  // choosing a transfer time for the guest would be inventing one.
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
