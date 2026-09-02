'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DOW = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function iso(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Centred calendar popup, same shell as the original bookDatePopup.
export default function DatePopup({ open, title = 'Select date', initial = '', onPick, onClose }) {
  const [mounted, setMounted] = useState(false);
  const [sel, setSel] = useState(initial || '');
  const [cursor, setCursor] = useState(() => {
    const base = initial ? new Date(initial) : new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (open) setSel(initial || '');
  }, [open, initial]);
  useEffect(() => {
    if (!open) return;
    document.body.classList.add('hs-locked');
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('hs-locked');
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  const today = iso(new Date());
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const total = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < first.getDay(); i++) cells.push(null);
  for (let d = 1; d <= total; d++) cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));

  return createPortal(
    <>
      <div className="hs-overlay open" onClick={onClose} />
      <div className="hs-panel bk-panel bk-panel--cal bookdate-panel open">
        <div className="hs-panel__head">
          <h3>{title}</h3>
          <button type="button" className="hs-panel__close" aria-label="Close" onClick={onClose}>&times;</button>
        </div>
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
              const past = v < today;
              return (
                <button
                  type="button"
                  key={v}
                  className={`hs-cal__d${past ? ' is-off' : ''}${v === sel ? ' is-sel' : ''}`}
                  disabled={past}
                  onClick={() => setSel(v)}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        </div>
        <div className="hs-cal__foot">
          <span className="hs-cal__hint">{sel ? sel : 'Pick a date'}</span>
          <button type="button" className="hs-cal__apply" disabled={!sel} onClick={() => { onPick(sel); onClose(); }}>
            Apply
          </button>
        </div>
      </div>
    </>,
    document.body,
  );
}
