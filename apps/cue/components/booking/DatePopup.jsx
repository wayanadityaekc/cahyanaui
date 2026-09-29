'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { overlay, panelBookdate, PANEL_HEAD_BOOKDATE, PANEL_HEAD_H3, PANEL_CLOSE, PANEL_BODY, HS_CAL, CAL_CAP, CAL_CAP_SPAN, CAL_CAP_BTN, CAL_GRID, CAL_DOW, calDay, CAL_FOOT, CAL_HINT, CAL_APPLY } from '@/components/ui/hsClasses';
import useBodyLock from '@/components/ui/useBodyLock';
import TimeChoice from '@/components/ui/TimeChoice';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DOW = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function iso(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Centred date popup (same panelBookdate as DateField); withTime adds a start-time control, and onPick gets (date, time).
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
  const [sel, setSel] = useState(initial || '');
  const [time, setTime] = useState(initialTime || '');
  const [cursor, setCursor] = useState(() => {
    const base = initial ? new Date(initial) : new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (open) setSel(initial || '');
  }, [open, initial]);
  useEffect(() => {
    if (open) setTime(initialTime || '');
  }, [open, initialTime]);
  useBodyLock(open);
  useEffect(() => {
    if (!open) return;
    function onKey(e) { return e.key === 'Escape' && onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Stays portal-mounted after first open (not gated on `open`) so the panel has a closed frame to animate from.
  if (!mounted) return null;

  const today = iso(new Date());
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const total = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const cells = [];
  [...Array(first.getDay()).keys()].forEach(() => cells.push(null));
  [...Array(total).keys()].forEach((i) => cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), i + 1)));

  return createPortal(
    <>
      <div className={overlay(open, false)} onClick={onClose} />
      <div className={panelBookdate(open)}>
        <div className={PANEL_HEAD_BOOKDATE}>
          <h3 className={PANEL_HEAD_H3}>{title}</h3>
          {/* PANEL_CLOSE, not PANEL_CLOSE_SHEET: the sheet variant hides above 768px, but this popup needs close at every width. */}
          <button type="button" className={PANEL_CLOSE} aria-label="Close" onClick={onClose}>&times;</button>
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
              if (!d) return <span className={calDay(true)} key={`e${i}`} />;
              const v = iso(d);
              const past = v < today;
              return (
                <button
                  type="button"
                  key={v}
                  className={calDay(past, v === sel)}
                  aria-pressed={v === sel}
                  disabled={past}
                  onClick={() => setSel(v)}
                >
                  {d.getDate()}
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
            <span className={CAL_HINT}>{sel ? sel : 'Pick a date'}</span>
          )}
          {/* self-end only with the time control: its label would otherwise leave Apply sitting higher than the field. */}
          <button type="button" className={`${CAL_APPLY}${withTime ? ' self-end' : ''}`} disabled={!sel} onClick={() => { onPick(sel, time); onClose(); }}>
            Apply
          </button>
        </div>
      </div>
    </>,
    document.body,
  );
}
