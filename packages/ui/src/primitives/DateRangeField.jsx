'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import Overlay from './Overlay.jsx';
import Button from './Button.jsx';
import { canCheckIn, canCheckOut, isBookedNight, stayLimits } from '../lib/stayRules.js';
import {
  CONTROL, CHEV_CAL, CONTROL_VAL, CONTROL_VAL_PLACEHOLDER,
  PANEL_HEAD_H3, PANEL_CLOSE, PANEL_BODY,
  CAL_GRID,
  CSEL_GROUP, BK_NATIVE, RANGE_ROW, RANGE_FOOT,
  CONTROL_RICH, CONTROL_IC, CONTROL_STACK, CONTROL_HINT,
  CONTROL_VAL_RICH, CONTROL_VAL_RICH_PLACEHOLDER, CHEV,
} from './controlClasses.js';

const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Range calendar look (Wayan's reference): big round days, month title left, round arrows right, dark filled circle for the chosen days.
// Phone: 2% margin each side, height fits the month; desktop: almost full screen; two months side by side from 993px.
const panelRange = (open) =>
  `fixed z-[340] flex flex-col overflow-hidden bg-surface-raised [overscroll-behavior:contain] inset-x-[2%] top-1/2 max-h-[80%] rounded-xl [border:1px_solid_var(--line)] [box-shadow:var(--shadow-xl)] [transition:opacity_0.24s_var(--ease),transform_0.24s_var(--ease),visibility_0.24s] min-[769px]:inset-auto min-[769px]:max-h-none min-[769px]:top-1/2 min-[769px]:left-1/2 min-[769px]:w-[min(1040px,94vw)] min-[769px]:h-[min(92vh,860px)] min-[769px]:rounded-xl min-[769px]:[border:1px_solid_var(--line)] min-[769px]:[box-shadow:var(--shadow-xl)] ${
    open
      ? 'opacity-100 visible pointer-events-auto [transform:translateY(-50%)] min-[769px]:[transform:translate(-50%,-50%)]'
      : 'opacity-0 invisible pointer-events-none [transform:translateY(-48%)] min-[769px]:[transform:translate(-50%,-48%)]'
  }`;
const PANEL_HEAD_RANGE = 'flex items-center justify-between flex-none pt-4 px-5 pb-3 [border-bottom:1px_solid_var(--line)] bg-surface-raised';
const RANGE_CAP = 'flex items-center justify-between gap-2 mb-4';
const RANGE_TITLE = 'm-0 font-body font-semibold text-[1.15rem] text-gold';
const RANGE_ARROW = 'w-9 h-9 inline-flex items-center justify-center rounded-base [border:1px_solid_var(--line)] bg-surface-raised text-gold cursor-pointer hover:bg-cream';
const RANGE_DOW = 'font-body font-medium text-small text-muted text-center py-2';
const rangeDay = (off, state, faded) =>
  `aspect-square flex items-center justify-center font-body text-[1rem] border-none ${
    state === 'start' || state === 'end'
      ? 'rounded-base bg-gold text-white font-semibold cursor-pointer'
      : state === 'in'
        ? 'rounded-base bg-cream text-ink cursor-pointer'
        : faded
          ? 'rounded-base bg-transparent text-[#d9d6ce] cursor-default'
          : off
            ? 'rounded-base bg-transparent text-[#cfccc4] cursor-default'
            : 'rounded-base bg-transparent text-ink cursor-pointer hover:bg-cream'
  }`;
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
  // ONE ROW INSTEAD OF TWO (Wayan, Sep 2026, pointing at CUE's booking card:
  // "pakai kolom date, satu kolom dan pakai sistem date picker range"). The
  // control was already a range picker - it just drew two triggers side by
  // side, so it READ as two questions. `hint` + `icon` switch it to the same
  // rich row the other fields use: icon, small label, value, chevron.
  hint = '',
  icon = null,
  // Booked nights and stay rules (shared with AvailabilityCalendar): days that can't start or end a stay are disabled.
  busy = [],
  minNights = 1,
  maxDaysAhead = 365,
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
  const limits = stayLimits({ today: minDate, minNights, maxDaysAhead });
  const choosingEnd = editing === 'end' && !!checkIn;
  const nights = nightsBetween(checkIn, checkOut);
  const single = !!(hint || icon);
  // One line for the whole range, and it says what has been answered so far:
  // nothing, a check-in waiting on its check-out, or both plus the nights - the
  // number the guest is actually choosing.
  const rangeLabel = !checkIn
    ? placeholders.start
    : !checkOut
      ? `${fmt(checkIn)} - add check-out`
      : `${fmt(checkIn)} - ${fmt(checkOut)} · ${nights} ${nights === 1 ? 'night' : 'nights'}`;

  // Month grid with the neighbouring months' days fading in at both ends (not tappable).
  function monthCells(base) {
    const first = new Date(base.getFullYear(), base.getMonth(), 1);
    const days = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
    const lead = first.getDay();
    const out = [];
    for (let i = lead; i > 0; i--) out.push({ date: new Date(base.getFullYear(), base.getMonth(), 1 - i), faded: true });
    for (let d = 1; d <= days; d++) out.push({ date: new Date(base.getFullYear(), base.getMonth(), d), faded: false });
    while (out.length % 7) out.push({ date: new Date(base.getFullYear(), base.getMonth(), days + (out.length - lead - days + 1)), faded: true });
    return out;
  }
  const months = [cursor, new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)];

  const stateOf = (v) => {
    if (checkIn && v === checkIn) return 'start';
    if (checkOut && v === checkOut) return 'end';
    if (checkIn && checkOut && v > checkIn && v < checkOut) return 'in';
    return null;
  };

  function selectable(v) {
    // Once a check-in is set, later days can only end the stay; earlier days restart it.
    if (choosingEnd) return v > checkIn ? canCheckOut(v, checkIn, { busy, limits }) : canCheckIn(v, { busy, limits });
    return canCheckIn(v, { busy, limits });
  }

  function pick(v) {
    if (choosingEnd && canCheckOut(v, checkIn, { busy, limits })) {
      onChange({ checkIn, checkOut: v });
      setEditing('start');
      setOpen(false);
      return;
    }
    // Only an earlier day (or a fresh start) restarts the range.
    if ((choosingEnd && v > checkIn) || !canCheckIn(v, { busy, limits })) return;
    onChange({ checkIn: v, checkOut: '' });
    setEditing('end');
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
    <div className={panelRange(open)}>
      <div className={PANEL_HEAD_RANGE}>
        <h3 className={PANEL_HEAD_H3}>
          {/* The heading says which end the next tap will set, so the panel is
              never ambiguous about what is about to happen. */}
          {editing === 'end' && checkIn ? labels.end : labels.start}
        </h3>
        <button type="button" className={PANEL_CLOSE} aria-label="Close" onClick={() => setOpen(false)}>&times;</button>
      </div>
      <div className={PANEL_BODY}>
        <div className="px-3 pt-4 pb-3 min-[769px]:px-5 min-[769px]:pt-5 min-[993px]:px-10 min-[993px]:pt-8">
          <div className="grid gap-10 min-[993px]:grid-cols-2">
            {months.map((base, index) => (
              <div key={base.getMonth()} className={index ? 'hidden min-[993px]:block' : ''}>
                <div className={RANGE_CAP}>
                  {index === 0 ? (
                    <button type="button" className={RANGE_ARROW} aria-label="Previous month" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}><ChevronLeft className="w-4 h-4" strokeWidth={2} aria-hidden="true" /></button>
                  ) : <span className="hidden min-[993px]:block w-9" />}
                  <h4 className={RANGE_TITLE}>{MONTHS[base.getMonth()]} {base.getFullYear()}</h4>
                  <button type="button" className={`${RANGE_ARROW}${index === 0 ? ' min-[993px]:invisible' : ' max-[992px]:hidden'}`} aria-label="Next month" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}><ChevronRight className="w-4 h-4" strokeWidth={2} aria-hidden="true" /></button>
                </div>
                <div className={CAL_GRID}>
                  {DOW.map((day) => <span className={RANGE_DOW} key={day}>{day}</span>)}
                  {monthCells(base).map(({ date, faded }) => {
                    const v = iso(date);
                    if (faded) return <span className={rangeDay(true, null, true)} key={`f${v}`}>{date.getDate()}</span>;
                    const st = stateOf(v);
                    const disabled = !st && !selectable(v);
                    const booked = disabled && isBookedNight(busy, v);
                    return (
                      <button
                        type="button"
                        key={v}
                        className={`${rangeDay(disabled, st, false)}${booked ? ' line-through' : ''}`}
                        aria-pressed={st === 'start' || st === 'end'}
                        disabled={disabled}
                        onClick={() => pick(v)}
                      >
                        {date.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={`${RANGE_FOOT} flex-none pb-[max(1rem,env(safe-area-inset-bottom))]`}>
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

      {single ? (
        <button
          type="button"
          className={CONTROL_RICH}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label={hint || panelLabel}
          onClick={() => openAt(checkIn && !checkOut ? 'end' : 'start')}
        >
          {icon ? <span className={CONTROL_IC} aria-hidden="true">{icon}</span> : null}
          <span className={CONTROL_STACK}>
            {hint ? <span className={CONTROL_HINT}>{hint}</span> : null}
            <span className={checkIn ? CONTROL_VAL_RICH : CONTROL_VAL_RICH_PLACEHOLDER}>{rangeLabel}</span>
          </span>
          <Calendar className={CHEV} strokeWidth={1.8} aria-hidden="true" />
        </button>
      ) : (
        <div className={RANGE_ROW}>
          {trigger('start', labels.start, checkIn, placeholders.start)}
          {trigger('end', labels.end, checkOut, placeholders.end)}
        </div>
      )}

      {mounted && createPortal(panel, document.body)}
      {mounted && <Overlay open={open} onClose={() => setOpen(false)} />}
    </div>
  );
}
