'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Overlay from './Overlay';
import { CONTROL, CONTROL_RICH, CHEV, CHEV_CAL, CONTROL_VAL, CONTROL_VAL_PLACEHOLDER, CONTROL_IC, CONTROL_STACK, CONTROL_HINT, CONTROL_VAL_RICH, CONTROL_VAL_RICH_PLACEHOLDER, panelBookdate, PANEL_HEAD_BOOKDATE, PANEL_HEAD_H3, PANEL_CLOSE, PANEL_BODY, HS_CAL, CAL_CAP, CAL_CAP_SPAN, CAL_CAP_BTN, CAL_GRID, CAL_DOW, calDay, CSEL_GROUP, BK_NATIVE } from './hsClasses';

const DOW = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function iso(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function fmtLabel(v) {
  if (!v) return '';
  const [y, m, d] = v.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function DateField({ label = 'Date', value, onChange, min, placeholder = 'Select date', name, id, icon = null, hint = '' }) {
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
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const minDate = min || iso(new Date());
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const lead = first.getDay();

  const cells = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));

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
                  onClick={() => { onChange(v); setOpen(false); }}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      </div>
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
            <span className={!value ? CONTROL_VAL_RICH_PLACEHOLDER : CONTROL_VAL_RICH}>{value ? fmtLabel(value) : placeholder}</span>
          </span>
        ) : (
          <span className={!value ? CONTROL_VAL_PLACEHOLDER : CONTROL_VAL}>{value ? fmtLabel(value) : placeholder}</span>
        )}
        {rich ? (
          <svg className={CHEV} viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg className={CHEV_CAL} viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="M3 10h18M8 3v4M16 3v4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        )}
      </button>
      {/* Always portal-mounted once mounted (not gated on `open`) so the panel has a
          "closed" frame to transition FROM - see Select.jsx for the same fix. */}
      {mounted && createPortal(panel, document.body)}
      {mounted && <Overlay open={open} onClose={() => setOpen(false)} />}
    </div>
  );
}
