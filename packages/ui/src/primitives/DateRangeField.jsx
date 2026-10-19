'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import Overlay from './Overlay.jsx';
import Button from './Button.jsx';
import { canCheckIn, canCheckOut, isBookedNight, stayLimits } from '../lib/stayRules.js';
import {
  CONTROL,
  CHEV_CAL,
  CONTROL_VAL,
  CONTROL_VAL_PLACEHOLDER,
  PANEL_HEAD_H3,
  PANEL_CLOSE,
  PANEL_BODY,
  CAL_GRID,
  CSEL_GROUP,
  BK_NATIVE,
  RANGE_ROW,
  RANGE_FOOT,
  CONTROL_RICH,
  CONTROL_IC,
  CONTROL_STACK,
  CONTROL_HINT,
  CONTROL_VAL_RICH,
  CONTROL_VAL_RICH_PLACEHOLDER,
  CHEV,
} from './controlClasses.js';

const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function buildRangePanelClasses(open) {
  return `fixed z-[340] flex flex-col overflow-hidden bg-surface-raised [overscroll-behavior:contain] inset-x-[2%] top-1/2 max-h-[80%] rounded-xl [border:1px_solid_var(--line)] [box-shadow:var(--shadow-xl)] [transition:opacity_0.24s_var(--ease),transform_0.24s_var(--ease),visibility_0.24s] min-[769px]:inset-auto min-[769px]:max-h-none min-[769px]:top-1/2 min-[769px]:left-1/2 min-[769px]:w-[min(1040px,94vw)] min-[769px]:h-[min(92vh,860px)] min-[769px]:rounded-xl min-[769px]:[border:1px_solid_var(--line)] min-[769px]:[box-shadow:var(--shadow-xl)] ${
    open
      ? 'opacity-100 visible pointer-events-auto [transform:translateY(-50%)] min-[769px]:[transform:translate(-50%,-50%)]'
      : 'opacity-0 invisible pointer-events-none [transform:translateY(-48%)] min-[769px]:[transform:translate(-50%,-48%)]'
  }`;
}
const PANEL_HEAD_RANGE =
  'flex items-center justify-between flex-none pt-4 px-5 pb-3 [border-bottom:1px_solid_var(--line)] bg-surface-raised';
const RANGE_CAP = 'flex items-center justify-between gap-2 mb-4';
const RANGE_TITLE = 'm-0 font-body font-semibold text-[1.15rem] text-gold';
const RANGE_ARROW =
  'w-9 h-9 inline-flex items-center justify-center rounded-base [border:1px_solid_var(--line)] bg-surface-raised text-gold cursor-pointer hover:bg-cream';
const RANGE_DOW = 'font-body font-medium text-small text-muted text-center py-2';
function buildRangeDayClasses(off, state, faded) {
  return `aspect-square flex items-center justify-center font-body text-[1rem] border-none ${
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
}
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function formatIsoDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatDateLabel(isoDate) {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function countNightsBetween(startDate, endDate) {
  if (!startDate || !endDate) return 0;
  return Math.round((new Date(endDate) - new Date(startDate)) / 86400000);
}

export default function DateRangeField({
  value = {},
  onChange,
  min,
  labels = { start: 'Check-in', end: 'Check-out' },
  placeholders = { start: 'Add date', end: 'Add date' },
  id,
  name,
  panelLabel = 'Select dates',
  hint = '',
  icon = null,
  busy = [],
  minNights = 1,
  maxDaysAhead = 365,
}) {
  const { checkIn = '', checkOut = '' } = value || {};
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState('start');
  const [isMounted, setIsMounted] = useState(false);
  const [cursor, setCursor] = useState(() => {
    const base = checkIn ? new Date(checkIn) : new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  useEffect(() => setIsMounted(true), []);
  useEffect(() => {
    if (!isOpen) return undefined;
    function handleEscapeKeyDown(event) {
      return event.key === 'Escape' && setIsOpen(false);
    }
    document.addEventListener('keydown', handleEscapeKeyDown);
    return () => document.removeEventListener('keydown', handleEscapeKeyDown);
  }, [isOpen]);

  const minDate = min || formatIsoDate(new Date());
  const limits = stayLimits({ today: minDate, minNights, maxDaysAhead });
  const isChoosingEnd = editing === 'end' && !!checkIn;
  const nights = countNightsBetween(checkIn, checkOut);
  const hasIconOrHint = !!(hint || icon);
  const rangeLabel = !checkIn
    ? placeholders.start
    : !checkOut
      ? `${formatDateLabel(checkIn)} - add check-out`
      : `${formatDateLabel(checkIn)} - ${formatDateLabel(checkOut)} · ${nights} ${nights === 1 ? 'night' : 'nights'}`;

  function buildMonthCells(base) {
    const first = new Date(base.getFullYear(), base.getMonth(), 1);
    const days = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
    const lead = first.getDay();
    const leadingBlanks = [];
    for (let leadIndex = lead; leadIndex > 0; leadIndex--)
      leadingBlanks.push({ date: new Date(base.getFullYear(), base.getMonth(), 1 - leadIndex), faded: true });
    for (let dayOfMonth = 1; dayOfMonth <= days; dayOfMonth++)
      leadingBlanks.push({ date: new Date(base.getFullYear(), base.getMonth(), dayOfMonth), faded: false });
    while (leadingBlanks.length % 7)
      leadingBlanks.push({
        date: new Date(base.getFullYear(), base.getMonth(), days + (leadingBlanks.length - lead - days + 1)),
        faded: true,
      });
    return leadingBlanks;
  }
  const months = [cursor, new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)];

  function findDayState(isoDate) {
    if (checkIn && isoDate === checkIn) return 'start';
    if (checkOut && isoDate === checkOut) return 'end';
    if (checkIn && checkOut && isoDate > checkIn && isoDate < checkOut) return 'in';
    return null;
  }

  function isDaySelectable(isoDate) {
    if (isChoosingEnd)
      return isoDate > checkIn
        ? canCheckOut(isoDate, checkIn, { busy, limits })
        : canCheckIn(isoDate, { busy, limits });
    return canCheckIn(isoDate, { busy, limits });
  }

  function pick(isoDate) {
    if (isChoosingEnd && canCheckOut(isoDate, checkIn, { busy, limits })) {
      onChange({ checkIn, checkOut: isoDate });
      setEditing('start');
      setIsOpen(false);
      return;
    }
    if ((isChoosingEnd && isoDate > checkIn) || !canCheckIn(isoDate, { busy, limits })) return;
    onChange({ checkIn: isoDate, checkOut: '' });
    setEditing('end');
  }

  function openAt(which) {
    setEditing(which);
    setIsOpen(true);
  }

  function trigger(which, label, valueItem, placeholder) {
    return (
      <button
        type="button"
        className={CONTROL}
        aria-haspopup="dialog"
        aria-expanded={isOpen && editing === which}
        aria-label={label}
        onClick={() => openAt(which)}
      >
        <span className={valueItem ? CONTROL_VAL : CONTROL_VAL_PLACEHOLDER}>
          {valueItem ? formatDateLabel(valueItem) : placeholder}
        </span>
        <Calendar className={CHEV_CAL} strokeWidth={1.8} aria-hidden="true" />
      </button>
    );
  }

  const panel = (
    <div className={buildRangePanelClasses(isOpen)}>
      <div className={PANEL_HEAD_RANGE}>
        <h3 className={PANEL_HEAD_H3}>{editing === 'end' && checkIn ? labels.end : labels.start}</h3>
        <button type="button" className={PANEL_CLOSE} aria-label="Close" onClick={() => setIsOpen(false)}>
          &times;
        </button>
      </div>
      <div className={PANEL_BODY}>
        <div className="px-3 pt-4 pb-3 min-[769px]:px-5 min-[769px]:pt-5 min-[993px]:px-10 min-[993px]:pt-8">
          <div className="grid gap-10 min-[993px]:grid-cols-2">
            {months.map((base, index) => (
              <div key={base.getMonth()} className={index ? 'hidden min-[993px]:block' : ''}>
                <div className={RANGE_CAP}>
                  {index === 0 ? (
                    <button
                      type="button"
                      className={RANGE_ARROW}
                      aria-label="Previous month"
                      onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
                    >
                      <ChevronLeft className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
                    </button>
                  ) : (
                    <span className="hidden min-[993px]:block w-9" />
                  )}
                  <h4 className={RANGE_TITLE}>
                    {MONTHS[base.getMonth()]} {base.getFullYear()}
                  </h4>
                  <button
                    type="button"
                    className={`${RANGE_ARROW}${index === 0 ? ' min-[993px]:invisible' : ' max-[992px]:hidden'}`}
                    aria-label="Next month"
                    onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
                  >
                    <ChevronRight className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
                  </button>
                </div>
                <div className={CAL_GRID}>
                  {DOW.map((day) => (
                    <span className={RANGE_DOW} key={day}>
                      {day}
                    </span>
                  ))}
                  {buildMonthCells(base).map(({ date, faded }) => {
                    const isoDate = formatIsoDate(date);
                    if (faded)
                      return (
                        <span className={buildRangeDayClasses(true, null, true)} key={`f${isoDate}`}>
                          {date.getDate()}
                        </span>
                      );
                    const st = findDayState(isoDate);
                    const isDisabled = !st && !isDaySelectable(isoDate);
                    const booked = isDisabled && isBookedNight(busy, isoDate);
                    return (
                      <button
                        type="button"
                        key={isoDate}
                        className={`${buildRangeDayClasses(isDisabled, st, false)}${booked ? ' line-through' : ''}`}
                        aria-pressed={st === 'start' || st === 'end'}
                        disabled={isDisabled}
                        onClick={() => pick(isoDate)}
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
        <span className="text-small text-muted">
          {nights > 0 ? `${nights} ${nights === 1 ? 'night' : 'nights'}` : 'Pick your dates'}
        </span>
        <Button variant="ghost" onClick={() => setIsOpen(false)}>
          Done
        </Button>
      </div>
    </div>
  );

  return (
    <div className={CSEL_GROUP}>
      <input
        type="date"
        className={BK_NATIVE}
        name={name && `${name}-in`}
        id={id}
        value={checkIn}
        min={minDate}
        onChange={(event) => onChange({ checkIn: event.target.value, checkOut })}
        tabIndex={-1}
        aria-hidden="true"
      />
      <input
        type="date"
        className={BK_NATIVE}
        name={name && `${name}-out`}
        value={checkOut}
        min={checkIn || minDate}
        onChange={(event) => onChange({ checkIn, checkOut: event.target.value })}
        tabIndex={-1}
        aria-hidden="true"
      />

      {hasIconOrHint ? (
        <button
          type="button"
          className={CONTROL_RICH}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-label={hint || panelLabel}
          onClick={() => openAt(checkIn && !checkOut ? 'end' : 'start')}
        >
          {icon ? (
            <span className={CONTROL_IC} aria-hidden="true">
              {icon}
            </span>
          ) : null}
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

      {isMounted && createPortal(panel, document.body)}
      {isMounted && <Overlay open={isOpen} onClose={() => setIsOpen(false)} />}
    </div>
  );
}
