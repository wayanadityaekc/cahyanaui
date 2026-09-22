'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { overlay, panelDateSheet, PANEL_HEAD_SHEET, PANEL_HEAD_H3, PANEL_CLOSE_SHEET, HS_CAL, CAL_CAP, CAL_CAP_SPAN, CAL_CAP_BTN, CAL_GRID, CAL_DOW, calDay, CAL_FOOT, CAL_HINT, CAL_APPLY } from '@/components/ui/hsClasses';
import useBodyLock from '@/components/ui/useBodyLock';
import TimeChoice from '@/components/ui/TimeChoice';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DOW = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function iso(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Centred calendar popup, same shell as the original bookDatePopup.
//
// withTime asks for the start time in the SAME panel (Sep 2026, Wayan: "ini pake di
// tiap date, kalo user milih date di booking form udah langsung milih jam"), the same
// prop DateField takes and the same TimeChoice control - the Apply row it sits next to
// was already here. onPick then hands back (date, time); callers that ignore the second
// argument keep working.
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
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Stay portal-mounted once mounted (not gated on `open`) so the sheet/backdrop have
  // a "closed" frame to transition FROM - `overlay`/`panelDateSheet` already carry the
  // open/closed classes, they just weren't getting a chance to animate between them.
  if (!mounted) return null;

  const today = iso(new Date());
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const total = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < first.getDay(); i++) cells.push(null);
  for (let d = 1; d <= total; d++) cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));

  return createPortal(
    <>
      <div className={overlay(open, false)} onClick={onClose} />
      <div className={panelDateSheet(open)}>
        <div className={PANEL_HEAD_SHEET}>
          <h3 className={PANEL_HEAD_H3}>{title}</h3>
          <button type="button" className={PANEL_CLOSE_SHEET} aria-label="Close" onClick={onClose}>&times;</button>
        </div>
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
        <div className={CAL_FOOT} data-cal-foot>
          {withTime ? (
            <div className="flex-1 min-w-0">
              <TimeChoice category={category} itemName={itemName} value={time} onChange={setTime} id="datepopup-time" />
            </div>
          ) : (
            <span className={CAL_HINT}>{sel ? sel : 'Pick a date'}</span>
          )}
          {/* self-end only with the time control: it brings a label the button does
              not have, so the row's items-center would sit the button 11.5px high.
              The plain hint row has no label and stays centred. */}
          <button type="button" className={`${CAL_APPLY}${withTime ? ' self-end' : ''}`} disabled={!sel} onClick={() => { onPick(sel, time); onClose(); }}>
            Apply
          </button>
        </div>
      </div>
    </>,
    document.body,
  );
}
