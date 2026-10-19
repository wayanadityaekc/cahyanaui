'use client';

import { useState } from 'react';
import { AnimatePresence, LazyMotion, domAnimation, m as motionElement, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/cn.js';
import { canCheckIn, canCheckOut, isBookedNight, nightsBetween, stayLimits } from '../lib/stayRules.js';

const MAX_STAY_NIGHTS = 30;
const MAX_DAYS_AHEAD = 365;
const YEAR_END_INDEX = 4;
const MONTH_START_INDEX = 5;
const MONTH_END_INDEX = 7;
const MONTHS_PER_YEAR = 12;
const DAY_START_INDEX = 8;
const DAY_END_INDEX = 10;
const ICON_STROKE_WIDTH_BOLD = 1.8;
const MONTH_SLIDE_OFFSET_PX = 48;
const MONTH_SLIDE_DURATION_SECONDS = 0.25;

const DOW = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
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
const ARROW =
  'w-10 h-10 inline-flex items-center justify-center rounded-base [border:1px_solid_var(--line)] bg-white text-gold cursor-pointer hover:[border-color:var(--color-gold)] disabled:opacity-30 disabled:cursor-not-allowed';
const DAY =
  'relative w-full aspect-square md:w-14 md:h-14 md:mx-auto flex items-center justify-center font-body text-[1rem] border-none p-0';

function formatLocalIso(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatShortDate(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function formatLongDate(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function buildMonthCells(year, month) {
  const lead = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const cells = new Array(lead).fill(null);
  Array.from({ length: days }, (unusedValue, index) => index + 1).forEach((day) =>
    cells.push(formatLocalIso(new Date(year, month, day))),
  );
  return cells;
}

export default function AvailabilityCalendar({
  value = {},
  onChange = () => {},
  busy = [],
  today = '',
  minNights = 1,
  maxNights = MAX_STAY_NIGHTS,
  maxDaysAhead = MAX_DAYS_AHEAD,
  note = null,
  loading = false,
  months = 2,
}) {
  const { checkIn = '', checkOut = '' } = value || {};
  const base = today || formatLocalIso(new Date());
  const limits = stayLimits({ today: base, minNights, maxNights, maxDaysAhead });
  const reduce = useReducedMotion();
  const start = checkIn || base;
  const [cursor, setCursor] = useState(() => ({
    year: Number(start.slice(0, YEAR_END_INDEX)),
    month: Number(start.slice(MONTH_START_INDEX, MONTH_END_INDEX)) - 1,
    dir: 0,
  }));
  const isChoosingEnd = !!checkIn && !checkOut;
  const nights = nightsBetween(checkIn, checkOut);

  const firstMonth =
    Number(base.slice(0, YEAR_END_INDEX)) * MONTHS_PER_YEAR +
    Number(base.slice(MONTH_START_INDEX, MONTH_END_INDEX)) -
    1;
  const lastMonth =
    Number(limits.lastCheckIn.slice(0, YEAR_END_INDEX)) * MONTHS_PER_YEAR +
    Number(limits.lastCheckIn.slice(MONTH_START_INDEX, MONTH_END_INDEX)) -
    1;
  const current = cursor.year * MONTHS_PER_YEAR + cursor.month;

  function move(step) {
    const next = current + step;
    setCursor({ year: Math.floor(next / MONTHS_PER_YEAR), month: next % MONTHS_PER_YEAR, dir: step });
  }

  function isDaySelectable(day) {
    if (isChoosingEnd)
      return day > checkIn ? canCheckOut(day, checkIn, { busy, limits }) : canCheckIn(day, { busy, limits });
    return canCheckIn(day, { busy, limits });
  }

  function pick(day) {
    if (isChoosingEnd && canCheckOut(day, checkIn, { busy, limits })) {
      onChange({ checkIn, checkOut: day });
      return;
    }
    if (isChoosingEnd && day > checkIn) return;
    if (canCheckIn(day, { busy, limits })) onChange({ checkIn: day, checkOut: '' });
  }

  function renderDayCell(day, index) {
    if (!day) return <span key={`empty-${index}`} aria-hidden="true" />;
    const ok = !loading && isDaySelectable(day);
    const booked = !ok && isBookedNight(busy, day);
    const isEdgeDay = day === checkIn || day === checkOut;
    const inside = checkIn && checkOut && day > checkIn && day < checkOut;
    const status = isEdgeDay ? 'selected' : booked ? 'booked' : ok ? 'available' : 'unavailable';
    return (
      <div
        key={day}
        className={cn(
          'relative',
          inside && 'bg-cream',
          day === checkIn && checkOut && 'bg-[linear-gradient(to_right,transparent_50%,var(--color-cream)_50%)]',
          day === checkOut && 'bg-[linear-gradient(to_left,transparent_50%,var(--color-cream)_50%)]',
        )}
      >
        <button
          type="button"
          disabled={!ok && !isEdgeDay}
          onClick={() => pick(day)}
          aria-pressed={isEdgeDay}
          aria-label={`${formatLongDate(day)}, ${status}`}
          data-day={day}
          data-status={status}
          className={cn(
            DAY,
            'rounded-base',
            isEdgeDay ? 'bg-gold text-white' : 'bg-transparent',
            !isEdgeDay && ok && 'text-green cursor-pointer hover:[box-shadow:inset_0_0_0_1.5px_var(--color-gold)]',
            !isEdgeDay && booked && 'text-muted line-through opacity-50 cursor-not-allowed',
            !isEdgeDay && !ok && !booked && 'text-muted opacity-35 cursor-not-allowed',
          )}
        >
          {Number(day.slice(DAY_START_INDEX, DAY_END_INDEX))}
        </button>
      </div>
    );
  }

  function renderMonth(offset) {
    const index = current + offset;
    const year = Math.floor(index / MONTHS_PER_YEAR);
    const monthIndex = index % MONTHS_PER_YEAR;
    return (
      <div
        key={index}
        className={cn('min-w-0', offset === 1 && 'hidden md:block')}
        data-calendar-month={`${year}-${String(monthIndex + 1).padStart(2, '0')}`}
      >
        <p className="m-0 mb-3 text-center font-body text-h3 font-semibold text-gold">
          {MONTHS[monthIndex]} {year}
        </p>
        <div className="grid [grid-template-columns:repeat(7,1fr)]">
          {DOW.map((day) => (
            <span key={day} className="py-2 text-center text-label font-medium text-muted">
              {day}
            </span>
          ))}
          {buildMonthCells(year, monthIndex).map(renderDayCell)}
        </div>
      </div>
    );
  }

  const hint = loading
    ? 'Loading availability...'
    : !checkIn
      ? 'Pick your check-in date.'
      : !checkOut
        ? `Now pick your check-out date (${minNights}-night minimum).`
        : `${formatShortDate(checkIn)} - ${formatShortDate(checkOut)} · ${nights} night${nights === 1 ? '' : 's'}`;

  return (
    <div className="w-full" data-availability-calendar>
      {note}
      <div className="flex items-center justify-between gap-3 mb-4">
        <button
          type="button"
          className={ARROW}
          aria-label="Previous month"
          disabled={current <= firstMonth}
          onClick={() => move(-1)}
        >
          <ChevronLeft
            className="w-[var(--icon-md)] h-[var(--icon-md)]"
            strokeWidth={ICON_STROKE_WIDTH_BOLD}
            aria-hidden="true"
          />
        </button>
        <p className="m-0 text-small text-muted text-center" aria-live="polite" data-calendar-hint>
          {hint}
        </p>
        <button
          type="button"
          className={ARROW}
          aria-label="Next month"
          disabled={current >= lastMonth}
          onClick={() => move(1)}
        >
          <ChevronRight
            className="w-[var(--icon-md)] h-[var(--icon-md)]"
            strokeWidth={ICON_STROKE_WIDTH_BOLD}
            aria-hidden="true"
          />
        </button>
      </div>
      <LazyMotion features={domAnimation}>
        <div className="overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false} custom={cursor.dir}>
            <motionElement.div
              key={current}
              custom={cursor.dir}
              variants={{
                enter: (dir) => ({ x: reduce ? 0 : dir * MONTH_SLIDE_OFFSET_PX, opacity: 0 }),
                center: { x: 0, opacity: 1 },
                exit: (dir) => ({ x: reduce ? 0 : dir * -MONTH_SLIDE_OFFSET_PX, opacity: 0 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: reduce ? 0 : MONTH_SLIDE_DURATION_SECONDS, ease: [0.4, 0, 0.2, 1] }}
              className={cn('grid grid-cols-1 gap-x-10', months === 2 && 'md:grid-cols-2')}
            >
              {renderMonth(0)}
              {months === 2 ? renderMonth(1) : null}
            </motionElement.div>
          </AnimatePresence>
        </div>
      </LazyMotion>
      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-line">
        <div className="flex items-center gap-4 text-small text-muted">
          <span className="inline-flex items-center gap-2">
            <span className="w-4 h-4 rounded-base [border:1.5px_solid_var(--color-gold)]" aria-hidden="true" />
            Open
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="text-muted line-through opacity-50" aria-hidden="true">
              12
            </span>
            Booked
          </span>
        </div>
        {checkIn ? (
          <button
            type="button"
            className="bg-transparent border-none p-0 text-small font-medium text-gold underline cursor-pointer"
            onClick={() => onChange({ checkIn: '', checkOut: '' })}
          >
            Clear dates
          </button>
        ) : null}
      </div>
    </div>
  );
}
