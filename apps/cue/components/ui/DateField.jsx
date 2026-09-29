'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, ChevronDown } from 'lucide-react';
import Overlay from './Overlay';
import { CONTROL, CONTROL_RICH, CHEV, CHEV_CAL, CONTROL_VAL, CONTROL_VAL_PLACEHOLDER, CONTROL_IC, CONTROL_STACK, CONTROL_HINT, CONTROL_VAL_RICH, CONTROL_VAL_RICH_PLACEHOLDER, panelBookdate, PANEL_HEAD_BOOKDATE, PANEL_HEAD_H3, PANEL_CLOSE, PANEL_BODY, HS_CAL, CAL_CAP, CAL_CAP_SPAN, CAL_CAP_BTN, CAL_GRID, CAL_DOW, calDay, CSEL_GROUP, BK_NATIVE, CAL_FOOT, CAL_APPLY } from './hsClasses';
import TimeChoice from './TimeChoice';
import {fmtTime, fmtDate } from '@/content/shared/timeSlots';

const DOW = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function iso(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}


// withTime adds a TimeChoice footer and Done button to the panel; default off for date-only callers.
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
  const rich = !!(icon || hint);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [cursor, setCursor] = useState(() => {
    const base = value ? new Date(value) : new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!open) return;
    function onKey(e) { return e.key === 'Escape' && setOpen(false); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const minDate = min || iso(new Date());
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const lead = first.getDay();

  // Trigger label shows date and time together in both variants when withTime is on.
  function label12(v) { return (withTime && time ? `${fmtDate(v)} · ${fmtTime(time)}` : fmtDate(v)); }

  const cells = [];
  [...Array(lead).keys()].forEach(() => cells.push(null));
  [...Array(daysInMonth).keys()].forEach((i) => cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), i + 1)));

  const panel = (
    <div className={panelBookdate(open)}>
      <div className={PANEL_HEAD_BOOKDATE}>
        <h3 className={PANEL_HEAD_H3}>{label}</h3>
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
              if (!d) return <span className={calDay(true)} key={`e${i}`} />;
              const v = iso(d);
              const disabled = v < minDate;
              return (
                <button
                  type="button"
                  key={v}
                  className={calDay(disabled, v === value)}
                  aria-pressed={v === value}
                  disabled={disabled}
                  onClick={() => { onChange(v); if (!withTime) setOpen(false); }}
                >
                  {d.getDate()}
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
          {/* self-end, not items-center: the time column has a label above it, so bottom-align Done with the field. */}
          <button type="button" className={`${CAL_APPLY} self-end`} disabled={!value} onClick={() => setOpen(false)}>
            Done
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className={CSEL_GROUP}>
      <input type="date" className={BK_NATIVE} name={name} id={id} value={value || ''} min={minDate} onChange={(e) => onChange(e.target.value)} tabIndex={-1} aria-hidden="true" />
      <button type="button" className={rich ? CONTROL_RICH : CONTROL} aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>
        {icon && <span className={CONTROL_IC} aria-hidden="true">{icon}</span>}
        {rich ? (
          <span className={CONTROL_STACK}>
            {hint && <span className={CONTROL_HINT}>{hint}</span>}
            <span className={!value ? CONTROL_VAL_RICH_PLACEHOLDER : CONTROL_VAL_RICH}>{value ? label12(value) : placeholder}</span>
          </span>
        ) : (
          <span className={!value ? CONTROL_VAL_PLACEHOLDER : CONTROL_VAL}>{value ? label12(value) : placeholder}</span>
        )}
        {rich ? (
          <ChevronDown className={CHEV} aria-hidden="true" />
        ) : (
          <Calendar className={CHEV_CAL} strokeWidth={1.8} aria-hidden="true" />
        )}
      </button>
      {/* Panel stays portal-mounted after first mount so it has a closed frame to transition from. */}
      {mounted && createPortal(panel, document.body)}
      {mounted && <Overlay open={open} onClose={() => setOpen(false)} />}
    </div>
  );
}
