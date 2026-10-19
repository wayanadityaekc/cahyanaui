'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, ChevronDown } from 'lucide-react';
import Overlay from './Overlay';
import {
  CONTROL,
  CONTROL_RICH,
  CHEV,
  CHEV_CAL,
  CONTROL_VAL,
  CONTROL_VAL_PLACEHOLDER,
  CONTROL_IC,
  CONTROL_STACK,
  CONTROL_HINT,
  CONTROL_VAL_RICH,
  CONTROL_VAL_RICH_PLACEHOLDER,
  panelBookdate,
  PANEL_HEAD_BOOKDATE,
  PANEL_HEAD_H3,
  PANEL_CLOSE,
  PANEL_BODY,
  HS_CAL,
  CAL_CAP,
  CAL_CAP_SPAN,
  CAL_CAP_BTN,
  CAL_GRID,
  CAL_DOW,
  calDay,
  CSEL_GROUP,
  BK_NATIVE,
  CAL_FOOT,
  CAL_APPLY,
} from './hsClasses';
import TimeChoice from './TimeChoice';
import { fmtTime, fmtDate } from '@/content/shared/timeSlots';

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

function iso(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export default function DateField({
  label = 'Date',
  value,
  onChange,
  min,
  placeholder = 'Select date',
  name,
  id,
  icon = null,
  hint = '',
  withTime = false,
  time = '',
  onTimeChange,
  category = null,
  itemName = null,
}) {
  const hasIconOrHint = !!(icon || hint);
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [cursor, setCursor] = useState(() => {
    const base = value ? new Date(value) : new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  useEffect(() => setIsMounted(true), []);
  useEffect(() => {
    if (!isOpen) return;
    function onKey(event) {
      return event.key === 'Escape' && setIsOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const minDate = min || iso(new Date());
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const lead = first.getDay();

  function label12(timeValue) {
    return withTime && time ? `${fmtDate(timeValue)} · ${fmtTime(time)}` : fmtDate(timeValue);
  }

  const cells = [];
  [...Array(lead).keys()].forEach(() => cells.push(null));
  [...Array(daysInMonth).keys()].forEach((dayIndex) =>
    cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), dayIndex + 1)),
  );

  const panel = (
    <div className={panelBookdate(isOpen)}>
      <div className={PANEL_HEAD_BOOKDATE}>
        <h3 className={PANEL_HEAD_H3}>{label}</h3>
        <button type="button" className={PANEL_CLOSE} aria-label="Close" onClick={() => setIsOpen(false)}>
          &times;
        </button>
      </div>
      <div className={PANEL_BODY}>
        <div className={HS_CAL}>
          <div className={CAL_CAP}>
            <button
              type="button"
              className={CAL_CAP_BTN}
              aria-label="Previous month"
              onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
            >
              &lsaquo;
            </button>
            <span className={CAL_CAP_SPAN}>
              {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
            </span>
            <button
              type="button"
              className={CAL_CAP_BTN}
              aria-label="Next month"
              onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
            >
              &rsaquo;
            </button>
          </div>
          <div className={CAL_GRID}>
            {DOW.map((dayName) => (
              <span className={CAL_DOW} key={dayName}>
                {dayName}
              </span>
            ))}
            {cells.map((cell, index) => {
              if (!cell) return <span className={calDay(true)} key={`e${index}`} />;
              const isoDate = iso(cell);
              const isDisabled = isoDate < minDate;
              return (
                <button
                  type="button"
                  key={isoDate}
                  className={calDay(isDisabled, isoDate === value)}
                  aria-pressed={isoDate === value}
                  disabled={isDisabled}
                  onClick={() => {
                    onChange(isoDate);
                    if (!withTime) setIsOpen(false);
                  }}
                >
                  {cell.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {withTime && (
        <div className={CAL_FOOT} data-cal-foot>
          <div className="flex-1 min-w-0">
            <TimeChoice
              category={category}
              itemName={itemName}
              value={time}
              onChange={onTimeChange}
              id={id ? `${id}-time` : undefined}
            />
          </div>
          <button type="button" className={`${CAL_APPLY} self-end`} disabled={!value} onClick={() => setIsOpen(false)}>
            Done
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className={CSEL_GROUP}>
      <input
        type="date"
        className={BK_NATIVE}
        name={name}
        id={id}
        value={value || ''}
        min={minDate}
        onChange={(event) => onChange(event.target.value)}
        tabIndex={-1}
        aria-hidden="true"
      />
      <button
        type="button"
        className={hasIconOrHint ? CONTROL_RICH : CONTROL}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
      >
        {icon && (
          <span className={CONTROL_IC} aria-hidden="true">
            {icon}
          </span>
        )}
        {hasIconOrHint ? (
          <span className={CONTROL_STACK}>
            {hint && <span className={CONTROL_HINT}>{hint}</span>}
            <span className={!value ? CONTROL_VAL_RICH_PLACEHOLDER : CONTROL_VAL_RICH}>
              {value ? label12(value) : placeholder}
            </span>
          </span>
        ) : (
          <span className={!value ? CONTROL_VAL_PLACEHOLDER : CONTROL_VAL}>{value ? label12(value) : placeholder}</span>
        )}
        {hasIconOrHint ? (
          <ChevronDown className={CHEV} aria-hidden="true" />
        ) : (
          <Calendar className={CHEV_CAL} strokeWidth={1.8} aria-hidden="true" />
        )}
      </button>
      {isMounted && createPortal(panel, document.body)}
      {isMounted && <Overlay open={isOpen} onClose={() => setIsOpen(false)} />}
    </div>
  );
}
