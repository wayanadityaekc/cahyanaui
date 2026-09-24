'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Calendar } from 'lucide-react';
import Overlay from './Overlay.jsx';
import Button from './Button.jsx';
import {
  CONTROL, CHEV_CAL, CONTROL_VAL, CONTROL_VAL_PLACEHOLDER,
  panelBookdate, PANEL_HEAD_BOOKDATE, PANEL_HEAD_H3, PANEL_CLOSE, PANEL_BODY,
  HS_CAL, CAL_CAP, CAL_CAP_SPAN, CAL_CAP_BTN, CAL_GRID, CAL_DOW, calRangeDay,
  CSEL_GROUP, BK_NATIVE, RANGE_ROW, RANGE_FOOT,
} from './controlClasses.js';

const DOW = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

function fmt(v) {
  if (!v) return '';
  const [y, m, d] = v.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function nightsBetween(a, b) {
  if (!a || !b) return 0;
  return Math.round((new Date(b) - new Date(a)) / 86400000);
}

/**
 * ONE CALENDAR FOR A STAY, not two date fields that happen to sit next to each
 * other.
 *
 *   value     { checkIn, checkOut }
 *   onChange  called with the whole range, every time either end moves
 *
 * WHY THIS IS ONE COMPONENT. Two independent pickers make the guest do the
 * arithmetic: they choose the 12th, close the panel, open a second panel that
 * has forgotten the 12th, and count forward. Worse, nothing stops them picking
 * a check-out before their check-in except a `min` that silently greys days
 * out. A range picker is what every booking site uses because the thing being
 * chosen is one thing - a stay - and the number that matters is the nights
 * between, which this shows.
 *
 * THE INTERACTION, and each rule is there for a failure it prevents:
 *  - First tap sets check-in and CLEARS check-out. Without the clear, tapping a
 *    new start date inside an existing range leaves an end date behind it.
 *  - Second tap sets check-out, but only if it is AFTER check-in; tapping an
 *    earlier day restarts the range from there, which is what a guest correcting
 *    themselves means. It never produces a backwards stay.
 *  - Same day twice is also a restart, not a zero-night stay.
 *  - The panel stays open between the two taps. It closes on the second, when
 *    the range is complete and there is nothing left to say.
 *
 * TWO TRIGGERS, ONE PANEL. The guest taps the end they want to change, and the
 * panel opens ready to change it - tapping "Check-out" on a complete range does
 * NOT wipe the check-in.
 */
export default function DateRangeField({
  value = {},
  onChange,
  min,
  labels = { start: 'Check-in', end: 'Check-out' },
  placeholders = { start: 'Add date', end: 'Add date' },
  id,
  name,
  panelLabel = 'Select dates',
}) {
  const { checkIn = '', checkOut = '' } = value || {};
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState('start');
  const [mounted, setMounted] = useState(false);
  const [cursor, setCursor] = useState(() => {
    const base = checkIn ? new Date(checkIn) : new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const minDate = min || iso(new Date());
  const nights = nightsBetween(checkIn, checkOut);

  const cells = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const days = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
    const out = new Array(first.getDay()).fill(null);
    for (let d = 1; d <= days; d++) out.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));
    return out;
  }, [cursor]);

  const stateOf = (v) => {
    if (checkIn && v === checkIn) return 'start';
    if (checkOut && v === checkOut) return 'end';
    if (checkIn && checkOut && v > checkIn && v < checkOut) return 'in';
    return null;
  };

  function pick(v) {
    // Starting a fresh range: either the guest is on the first tap, or they
    // tapped a day that cannot end the current one.
    if (editing === 'start' || !checkIn || v <= checkIn) {
      onChange({ checkIn: v, checkOut: '' });
      setEditing('end');
      return;
    }
    onChange({ checkIn, checkOut: v });
    setEditing('start');
    setOpen(false);
  }

  function openAt(which) {
    setEditing(which);
    // Opening "Check-out" on a complete range should let the guest change just
    // that end, so the check-in is left alone - `pick` handles the rest.
    setOpen(true);
  }

  const trigger = (which, label, val, placeholder) => (
    <button
      type="button"
      className={CONTROL}
      aria-haspopup="dialog"
      aria-expanded={open && editing === which}
      aria-label={label}
      onClick={() => openAt(which)}
    >
      <span className={val ? CONTROL_VAL : CONTROL_VAL_PLACEHOLDER}>{val ? fmt(val) : placeholder}</span>
      <Calendar className={CHEV_CAL} strokeWidth={1.8} aria-hidden="true" />
    </button>
  );

  const panel = (
    <div className={panelBookdate(open)}>
      <div className={PANEL_HEAD_BOOKDATE}>
        <h3 className={PANEL_HEAD_H3}>
          {/* The heading says which end the next tap will set, so the panel is
              never ambiguous about what is about to happen. */}
          {editing === 'end' && checkIn ? labels.end : labels.start}
        </h3>
        <button type="button" className={PANEL_CLOSE} aria-label="Close" onClick={() => setOpen(false)}>&times;</button>
      </div>
      <div className={PANEL_BODY}>
        <div className={HS_CAL}>
          <div className={CAL_CAP}>
            <button type="button" className={CAL_CAP_BTN} aria-label="Previous month" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}>&lsaquo;</button>
            <span className={CAL_CAP_SPAN}>{MONTHS[cursor.getMonth()]} {cursor.getFullYear()}</span>
            <button type="button" className={CAL_CAP_BTN} aria-label="Next month" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}>&rsaquo;</button>
          </div>
          <div className={CAL_GRID}>
            {DOW.map((d) => <span className={CAL_DOW} key={d}>{d}</span>)}
            {cells.map((d, i) => {
              if (!d) return <span className={calRangeDay(true, null)} key={`e${i}`} />;
              const v = iso(d);
              const disabled = v < minDate;
              const st = stateOf(v);
              return (
                <button
                  type="button"
                  key={v}
                  className={calRangeDay(disabled, st)}
                  aria-pressed={st === 'start' || st === 'end'}
                  disabled={disabled}
                  onClick={() => pick(v)}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className={RANGE_FOOT}>
        {/* The nights count is the point of a range picker: it is the number the
            guest is actually choosing, and neither date field can show it. */}
        <span className="text-small text-muted">
          {nights > 0 ? `${nights} ${nights === 1 ? 'night' : 'nights'}` : 'Pick your dates'}
        </span>
        <Button variant="ghost" onClick={() => setOpen(false)}>Done</Button>
      </div>
    </div>
  );

  return (
    <div className={CSEL_GROUP}>
      {/* Native inputs behind the custom control, so the values are in the form
          and a browser autofill still has somewhere to land. */}
      <input type="date" className={BK_NATIVE} name={name && `${name}-in`} id={id} value={checkIn} min={minDate} onChange={(e) => onChange({ checkIn: e.target.value, checkOut })} tabIndex={-1} aria-hidden="true" />
      <input type="date" className={BK_NATIVE} name={name && `${name}-out`} value={checkOut} min={checkIn || minDate} onChange={(e) => onChange({ checkIn, checkOut: e.target.value })} tabIndex={-1} aria-hidden="true" />

      <div className={RANGE_ROW}>
        {trigger('start', labels.start, checkIn, placeholders.start)}
        {trigger('end', labels.end, checkOut, placeholders.end)}
      </div>

      {mounted && createPortal(panel, document.body)}
      {mounted && <Overlay open={open} onClose={() => setOpen(false)} />}
    </div>
  );
}
