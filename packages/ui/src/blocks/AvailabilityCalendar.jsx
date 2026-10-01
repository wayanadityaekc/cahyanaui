'use client';

import { useState } from 'react';
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/cn.js';
import { canCheckIn, canCheckOut, isBookedNight, nightsBetween, stayLimits } from '../lib/stayRules.js';

const DOW = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const ARROW = 'w-10 h-10 inline-flex items-center justify-center rounded-[50%] [border:1px_solid_var(--line)] bg-white text-gold cursor-pointer hover:[border-color:var(--color-gold)] disabled:opacity-30 disabled:cursor-not-allowed';
// Square cells on phones (big thumb targets); a fixed 56px row from md up, or two months would stand ~900px tall.
const DAY = 'relative w-full aspect-square md:w-14 md:h-14 md:mx-auto flex items-center justify-center font-body text-[1rem] border-none p-0';

function localIso(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function shortDate(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function longDate(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function monthCells(year, month) {
  const lead = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const cells = new Array(lead).fill(null);
  Array.from({ length: days }, (_, index) => index + 1).forEach((day) => cells.push(localIso(new Date(year, month, day))));
  return cells;
}

// Airbnb-style stay calendar: big, booked nights struck through, one month on phones and two side by side from md up.
export default function AvailabilityCalendar({
  value = {},
  onChange = () => {},
  busy = [],
  today = '',
  minNights = 1,
  maxNights = 30,
  maxDaysAhead = 365,
  note = null,
  loading = false,
}) {
  const { checkIn = '', checkOut = '' } = value || {};
  const base = today || localIso(new Date());
  const limits = stayLimits({ today: base, minNights, maxNights, maxDaysAhead });
  const reduce = useReducedMotion();
  const start = checkIn || base;
  const [cursor, setCursor] = useState(() => ({ year: Number(start.slice(0, 4)), month: Number(start.slice(5, 7)) - 1, dir: 0 }));
  const choosingEnd = !!checkIn && !checkOut;
  const nights = nightsBetween(checkIn, checkOut);

  const firstMonth = Number(base.slice(0, 4)) * 12 + Number(base.slice(5, 7)) - 1;
  const lastMonth = Number(limits.lastCheckIn.slice(0, 4)) * 12 + Number(limits.lastCheckIn.slice(5, 7)) - 1;
  const current = cursor.year * 12 + cursor.month;

  function move(step) {
    const next = current + step;
    setCursor({ year: Math.floor(next / 12), month: next % 12, dir: step });
  }

  function selectable(day) {
    // Once a check-in is set, later days can only end the stay; earlier days restart it.
    if (choosingEnd) return day > checkIn ? canCheckOut(day, checkIn, { busy, limits }) : canCheckIn(day, { busy, limits });
    return canCheckIn(day, { busy, limits });
  }

  function pick(day) {
    if (choosingEnd && canCheckOut(day, checkIn, { busy, limits })) {
      onChange({ checkIn, checkOut: day });
      return;
    }
    if (choosingEnd && day > checkIn) return;
    if (canCheckIn(day, { busy, limits })) onChange({ checkIn: day, checkOut: '' });
  }

  function dayCell(day, index) {
    if (!day) return <span key={`empty-${index}`} aria-hidden="true" />;
    const ok = !loading && selectable(day);
    const booked = !ok && isBookedNight(busy, day);
    const edge = day === checkIn || day === checkOut;
    const inside = checkIn && checkOut && day > checkIn && day < checkOut;
    const status = edge ? 'selected' : booked ? 'booked' : ok ? 'available' : 'unavailable';
    return (
      <div key={day} className={cn('relative', inside && 'bg-cream', day === checkIn && checkOut && 'bg-[linear-gradient(to_right,transparent_50%,var(--color-cream)_50%)]', day === checkOut && 'bg-[linear-gradient(to_left,transparent_50%,var(--color-cream)_50%)]')}>
        <button
          type="button"
          disabled={!ok && !edge}
          onClick={() => pick(day)}
          aria-pressed={edge}
          aria-label={`${longDate(day)}, ${status}`}
          data-day={day}
          data-status={status}
          className={cn(
            DAY,
            'rounded-[50%]',
            // Background set per state only: bg-transparent next to bg-gold is a coin flip on CSS order.
            edge ? 'bg-gold text-white font-semibold' : 'bg-transparent',
            !edge && ok && 'text-green cursor-pointer hover:[box-shadow:inset_0_0_0_1.5px_var(--color-gold)]',
            !edge && booked && 'text-muted line-through opacity-50 cursor-not-allowed',
            !edge && !ok && !booked && 'text-muted opacity-35 cursor-not-allowed',
          )}
        >
          {Number(day.slice(8, 10))}
        </button>
      </div>
    );
  }

  function month(offset) {
    const index = current + offset;
    const year = Math.floor(index / 12);
    const monthIndex = index % 12;
    return (
      <div key={index} className={cn('min-w-0', offset === 1 && 'hidden md:block')} data-calendar-month={`${year}-${String(monthIndex + 1).padStart(2, '0')}`}>
        <p className="m-0 mb-3 text-center font-body text-h3 font-semibold text-gold">{MONTHS[monthIndex]} {year}</p>
        <div className="grid [grid-template-columns:repeat(7,1fr)]">
          {DOW.map((day) => <span key={day} className="py-2 text-center text-label font-medium tracking-[0.08em] uppercase text-muted">{day}</span>)}
          {monthCells(year, monthIndex).map(dayCell)}
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
        : `${shortDate(checkIn)} - ${shortDate(checkOut)} · ${nights} night${nights === 1 ? '' : 's'}`;

  return (
    <div className="w-full" data-availability-calendar>
      {note}
      <div className="flex items-center justify-between gap-3 mb-4">
        <button type="button" className={ARROW} aria-label="Previous month" disabled={current <= firstMonth} onClick={() => move(-1)}>
          <ChevronLeft className="w-[var(--icon-md)] h-[var(--icon-md)]" strokeWidth={1.8} aria-hidden="true" />
        </button>
        <p className="m-0 text-small text-muted text-center" aria-live="polite" data-calendar-hint>{hint}</p>
        <button type="button" className={ARROW} aria-label="Next month" disabled={current >= lastMonth} onClick={() => move(1)}>
          <ChevronRight className="w-[var(--icon-md)] h-[var(--icon-md)]" strokeWidth={1.8} aria-hidden="true" />
        </button>
      </div>
      <LazyMotion features={domAnimation}>
        <div className="overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false} custom={cursor.dir}>
            <m.div
              key={current}
              custom={cursor.dir}
              variants={{
                enter: (dir) => ({ x: reduce ? 0 : dir * 48, opacity: 0 }),
                center: { x: 0, opacity: 1 },
                exit: (dir) => ({ x: reduce ? 0 : dir * -48, opacity: 0 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: reduce ? 0 : 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="grid grid-cols-1 md:grid-cols-2 gap-x-10"
            >
              {month(0)}
              {month(1)}
            </m.div>
          </AnimatePresence>
        </div>
      </LazyMotion>
      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-line">
        <div className="flex items-center gap-4 text-small text-muted">
          <span className="inline-flex items-center gap-2"><span className="w-4 h-4 rounded-[50%] [border:1.5px_solid_var(--color-gold)]" aria-hidden="true" />Open</span>
          <span className="inline-flex items-center gap-2"><span className="text-muted line-through opacity-50" aria-hidden="true">12</span>Booked</span>
        </div>
        {checkIn ? (
          <button type="button" className="bg-transparent border-none p-0 text-small font-medium text-gold underline cursor-pointer" onClick={() => onChange({ checkIn: '', checkOut: '' })}>
            Clear dates
          </button>
        ) : null}
      </div>
    </div>
  );
}
