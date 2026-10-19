'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  overlay,
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
  CAL_FOOT,
  CAL_HINT,
  CAL_APPLY,
} from '@/components/ui/hsClasses';
import useBodyLock from '@/components/ui/useBodyLock';
import TimeChoice from '@/components/ui/TimeChoice';

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
const DOW = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function iso(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export default function DatePopup({
  open,
  title = 'Select date',
  initial = '',
  onPick,
  onClose,
  withTime = false,
  initialTime = '',
  category = null,
  itemName = null,
}) {
  const [mounted, setMounted] = useState(false);
  const [selector, setSelector] = useState(initial || '');
  const [time, setTime] = useState(initialTime || '');
  const [cursor, setCursor] = useState(() => {
    const base = initial ? new Date(initial) : new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (open) setSelector(initial || '');
  }, [open, initial]);
  useEffect(() => {
    if (open) setTime(initialTime || '');
  }, [open, initialTime]);
  useBodyLock(open);
  useEffect(() => {
    if (!open) return;
    function onKey(event) {
      return event.key === 'Escape' && onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!mounted) return null;

  const today = iso(new Date());
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const total = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const cells = [];
  [...Array(first.getDay()).keys()].forEach(() => cells.push(null));
  [...Array(total).keys()].forEach((dayIndex) =>
    cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), dayIndex + 1)),
  );

  return createPortal(
    <>
      <div className={overlay(open, false)} onClick={onClose} />
      <div className={panelBookdate(open)}>
        <div className={PANEL_HEAD_BOOKDATE}>
          <h3 className={PANEL_HEAD_H3}>{title}</h3>
          <button type="button" className={PANEL_CLOSE} aria-label="Close" onClick={onClose}>
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
              {DOW.map((weekday) => (
                <span className={CAL_DOW} key={weekday}>
                  {weekday}
                </span>
              ))}
              {cells.map((cell, index) => {
                if (!cell) return <span className={calDay(true)} key={`e${index}`} />;
                const isoDate = iso(cell);
                const past = isoDate < today;
                return (
                  <button
                    type="button"
                    key={isoDate}
                    className={calDay(past, isoDate === selector)}
                    aria-pressed={isoDate === selector}
                    disabled={past}
                    onClick={() => setSelector(isoDate)}
                  >
                    {cell.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className={CAL_FOOT} data-cal-foot>
          {withTime ? (
            <div className="flex-1 min-w-0">
              <TimeChoice category={category} itemName={itemName} value={time} onChange={setTime} id="datepopup-time" />
            </div>
          ) : (
            <span className={CAL_HINT}>{selector ? selector : 'Pick a date'}</span>
          )}
          <button
            type="button"
            className={`${CAL_APPLY}${withTime ? ' self-end' : ''}`}
            disabled={!selector}
            onClick={() => {
              onPick(selector, time);
              onClose();
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </>,
    document.body,
  );
}
