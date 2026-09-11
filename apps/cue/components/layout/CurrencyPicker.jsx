'use client';

import { useEffect, useRef, useState } from 'react';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import { CURRENCIES } from '@/lib/constants';

// Tailwind-native (full-portable). `variant`: 'navbar' (ml-auto di kluster akun) /
// 'hero' (tombol seukuran field di search form) / 'default'. Catatan: opsi aktif
// dulu di-scope `.acct__curopt.is-active` tapi JSX nge-set aria-selected -> highlight
// gak pernah muncul (bug lama). Direplikasi apa adanya (no active bg) biar zero-diff.
const wrap = (v) => `relative${v === 'navbar' ? ' ml-auto flex-none' : ''}`;
const CURBTN_BASE = 'flex items-center gap-[0.45rem] w-full bg-white font-body text-field text-green cursor-pointer';
const curbtn = (v) =>
  v === 'hero'
    ? `${CURBTN_BASE} py-0 px-[0.85rem] h-[var(--field-h)] rounded-md font-normal [border:1px_solid_var(--line)] hover:[border-color:var(--color-gold)]`
    : `${CURBTN_BASE} py-2 px-[0.65rem] rounded-pill font-semibold [border:1px_solid_#d8d2c4]`;
const CURCODE = 'flex-[1_1_auto] text-left';
const CURCARET = 'w-[14px] h-[14px] text-muted flex-none [transition:transform_var(--dur-fast)_ease] [[aria-expanded=true]_&]:[transform:rotate(180deg)]';
// Was an instant `hidden` attribute snap - now fades+lifts in (element stays mounted,
// only opacity/transform/pointer-events toggle, so the transition actually plays).
const curlist = (v, open) =>
  `absolute left-0 right-0 mt-1 mx-0 mb-0 p-1 list-none bg-white [border:1px_solid_#e4dcc8] [box-shadow:0_10px_24px_rgba(31,61,43,0.16)] z-10 ` +
  `transition-[opacity,transform] duration-[var(--dur)] ease-[var(--ease-out)] motion-reduce:transition-none ` +
  `${open ? 'opacity-100 visible pointer-events-auto [transform:translateY(0)]' : 'opacity-0 invisible pointer-events-none [transform:translateY(-4px)]'} ` +
  `${v === 'hero' ? 'rounded-md' : 'rounded-sm'}`;
const CUROPT = 'flex items-center gap-[0.45rem] py-[0.45rem] px-[0.4rem] rounded-sm text-[1rem] font-semibold text-green cursor-pointer hover:bg-cream';
const FLAG = 'inline-block w-5 h-[14px] rounded-[2px] overflow-hidden flex-none [box-shadow:0_0_0_1px_rgba(0,0,0,0.06)] [&_svg]:block [&_svg]:w-full [&_svg]:h-full';

function Flag({ code }) {
  return (
    <span className={FLAG}>
      <svg viewBox="0 0 60 40" aria-hidden="true">
        <use href={`#flag-${code.toLowerCase()}`} />
      </svg>
    </span>
  );
}

export default function CurrencyPicker({ variant = 'default' }) {
  const { currency, setCurrency } = useTripPrefs();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, [open]);

  return (
    <div className={wrap(variant)} data-cur ref={ref}>
      <button
        type="button"
        className={curbtn(variant)}
        id="acct-cur"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Flag code={currency} />
        <span className={CURCODE}>{currency}</span>
        <svg className={CURCARET} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <ul className={curlist(variant, open)} role="listbox" aria-label="Currency">
        {CURRENCIES.map((c) => (
          <li
            key={c}
            className={CUROPT}
            role="option"
            aria-selected={c === currency}
            onClick={() => {
              setCurrency(c);
              setOpen(false);
            }}
          >
            <Flag code={c} />
            {c}
          </li>
        ))}
      </ul>
    </div>
  );
}
