'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Overlay from './Overlay';

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
    <div className={`hs-panel bk-panel hs-panel--popup bookdate-panel${open ? ' open' : ''}`}>
      <div className="hs-panel__head">
        <h3>{label}</h3>
        <button type="button" className="hs-panel__close" aria-label="Close" onClick={() => setOpen(false)}>&times;</button>
      </div>
      <div className="hs-panel__body">
        <div className="hs-cal bk-cal">
          <div className="hs-cal__cap">
            <button type="button" aria-label="Previous month" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}>&lsaquo;</button>
            <span>{MONTHS[cursor.getMonth()]} {cursor.getFullYear()}</span>
            <button type="button" aria-label="Next month" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}>&rsaquo;</button>
          </div>
          <div className="hs-cal__grid">
            {DOW.map((d) => <span className="hs-cal__dow" key={d}>{d}</span>)}
            {cells.map((d, i) => {
              if (!d) return <span className="hs-cal__d is-off" key={`e${i}`} />;
              const v = iso(d);
              const disabled = v < minDate;
              return (
                <button
                  type="button"
                  key={v}
                  className={`hs-cal__d${disabled ? ' is-off' : ''}${v === value ? ' is-sel' : ''}`}
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
    <div className="csel-group">
      <input type="date" className="bk-native" name={name} id={id} value={value || ''} min={minDate} onChange={(e) => onChange(e.target.value)} tabIndex={-1} aria-hidden="true" />
      <button type="button" className={`hs-control bk-control${rich ? ' hs-control--rich' : ''}`} aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>
        {icon && <span className="hs-control__ic" aria-hidden="true">{icon}</span>}
        {rich ? (
          <span className="hs-control__stack">
            {hint && <span className="hs-control__hint">{hint}</span>}
            <span className={`hs-control__val${!value ? ' placeholder' : ''}`}>{value ? fmtLabel(value) : placeholder}</span>
          </span>
        ) : (
          <span className={`hs-control__val${!value ? ' placeholder' : ''}`}>{value ? fmtLabel(value) : placeholder}</span>
        )}
        {rich ? (
          <svg className="hs-chev" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg className="hs-chev hs-chev--cal" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="M3 10h18M8 3v4M16 3v4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        )}
      </button>
      {mounted && open && createPortal(panel, document.body)}
      {mounted && <Overlay open={open} onClose={() => setOpen(false)} />}
    </div>
  );
}
