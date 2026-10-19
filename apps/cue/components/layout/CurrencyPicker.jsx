'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import { CURRENCIES } from '@/lib/constants';

function wrap(variant) {
  return `relative${variant === 'navbar' ? ' ml-auto flex-none' : ''}`;
}
const CURBTN_BASE = 'flex items-center gap-[0.45rem] w-full bg-white font-body text-field text-green cursor-pointer';
function curbtn(variant) {
  return variant === 'hero'
    ? `${CURBTN_BASE} py-0 px-3 h-[var(--field-h)] rounded-md font-normal [border:1px_solid_var(--line)] hover:[border-color:var(--color-gold)]`
    : `${CURBTN_BASE} py-0 px-3 h-[var(--field-h)] rounded-md font-semibold [border:1px_solid_var(--line)]`;
}
const CURCODE = 'flex-[1_1_auto] text-left';
const CURCARET =
  'w-[14px] h-[14px] text-muted flex-none [transition:transform_var(--dur-fast)_ease] [[aria-expanded=true]_&]:[transform:rotate(180deg)]';
function curlist(variant, open) {
  return (
    `absolute left-0 right-0 mt-1 mx-0 mb-0 p-1 list-none bg-white [border:1px_solid_var(--line)] z-10 max-h-[15rem] overflow-y-auto overscroll-contain ` +
    `transition-[opacity,transform] duration-[var(--dur)] ease-[var(--ease-out)] motion-reduce:transition-none ` +
    `${open ? 'opacity-100 visible pointer-events-auto [transform:translateY(0)]' : 'opacity-0 invisible pointer-events-none [transform:translateY(-4px)]'} ` +
    `${variant === 'hero' ? 'rounded-md' : 'rounded-sm'}`
  );
}
const CUROPT =
  'flex items-center gap-[0.45rem] py-[0.45rem] px-[0.4rem] rounded-sm text-[1rem] font-semibold text-green cursor-pointer hover:bg-cream';
const FLAG =
  'inline-block w-5 h-[14px] rounded-[2px] overflow-hidden flex-none [box-shadow:0_0_0_1px_rgba(0,0,0,0.06)] [&_svg]:block [&_svg]:w-full [&_svg]:h-full';

function Flag({ code }) {
  return (
    <span className={FLAG}>
      <svg viewBox="0 0 60 40" aria-hidden="true">
        <use href={`#flag-${code.toLowerCase()}`} />
      </svg>
    </span>
  );
}

export default function CurrencyPicker({ variant = 'default', id = 'acct-cur' }) {
  const { currency, setCurrency } = useTripPrefs();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    function onDoc(event) {
      if (ref.current && !ref.current.contains(event.target)) setIsOpen(false);
    }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, [isOpen]);

  return (
    <div className={wrap(variant)} data-cur ref={ref}>
      <button
        type="button"
        className={curbtn(variant)}
        id={id}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((wasOpen) => !wasOpen)}
      >
        <Flag code={currency} />
        <span className={CURCODE}>{currency}</span>
        <ChevronDown className={CURCARET} aria-hidden="true" />
      </button>
      <ul className={curlist(variant, isOpen)} role="listbox" aria-label="Currency">
        {CURRENCIES.map((currencyItem) => (
          <li
            key={currencyItem}
            className={CUROPT}
            role="option"
            aria-selected={currencyItem === currency}
            onClick={() => {
              setCurrency(currencyItem);
              setIsOpen(false);
            }}
          >
            <Flag code={currencyItem} />
            {currencyItem}
          </li>
        ))}
      </ul>
    </div>
  );
}
