'use client';

import { useState } from 'react';
import { GROUP_LABEL, ROWSET, ROW, PBAR, PBAR_L, PBAR_V, DETAILS_LI_ROW, DETAILS_TOGGLE, DETAILS_LI } from './confirmClasses.js';

/**
 * CUE's check step, as pieces the site assembles.
 *   ReadBackRows   a labelled group of label/value rows        rows: [[label, value]]
 *   ReadBackList   the "what's included" list; open by default, folds behind a toggle above 4 lines
 *   TotalBar       the amount the guest agrees to
 */
export function ReadBackRows({ label, rows = [] }) {
  const shown = rows.filter(([, value]) => value !== '' && value != null);
  if (!shown.length) return null;
  return (
    <>
      <p className={GROUP_LABEL}>{label}</p>
      <div className={ROWSET}>
        {shown.map(([name, value]) => <div className={ROW} key={name}><span>{name}</span><span>{value}</span></div>)}
      </div>
    </>
  );
}

export function ReadBackList({ label, lines = [], countLabel = (count) => `${count} items` }) {
  const [open, setOpen] = useState(false);
  if (!lines.length) return null;
  return (
    <>
      <p className={GROUP_LABEL}>{label}</p>
      {lines.length > 4 ? (
        <div className="mb-4">
          <button type="button" className={DETAILS_TOGGLE} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
            <span>{countLabel(lines.length)}</span>
            <span className={`text-[1.4rem] text-gold transition-transform duration-[var(--dur-slow)] ease-[ease] ${open ? '[transform:rotate(90deg)]' : ''}`}>&rsaquo;</span>
          </button>
          <ul className={`list-none overflow-hidden transition-[max-height] duration-[var(--dur-slow)] ease-[ease] ${open ? 'max-h-[320px]' : 'max-h-0'}`}>
            {lines.map((line, index) => <li className={DETAILS_LI} key={index}>{line}</li>)}
          </ul>
        </div>
      ) : (
        <ul className={`${ROWSET} list-none`}>
          {lines.map((line, index) => <li className={DETAILS_LI_ROW} key={index}>{line}</li>)}
        </ul>
      )}
    </>
  );
}

export function TotalBar({ label = 'Total', value = '-' }) {
  return (
    <div className={PBAR}>
      <span className={PBAR_L}>{label}</span>
      <span className={PBAR_V} data-total>{value}</span>
    </div>
  );
}
