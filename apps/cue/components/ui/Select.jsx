'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import useMobile from './useMobile';
import Overlay from './Overlay';

function Chevron() {
  return (
    <svg className="hs-chev" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Select({
  label,
  value,
  onChange,
  options = [],
  placeholder = '',
  name,
  id,
  popup = false,
  className = '',
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isMobile = useMobile();
  const groupRef = useRef(null);
  const autoId = useId();
  const fieldId = id || `sel-${autoId}`;
  const asPortal = isMobile || popup;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open || asPortal) return;
    const onDoc = (e) => {
      if (groupRef.current && !groupRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, [open, asPortal]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const selected = options.find((o) => String(o.value) === String(value));

  const panel = (
    <div className={`hs-panel bk-panel${open ? ' open' : ''}${popup ? ' hs-panel--popup' : ''}`}>
      <div className="hs-panel__head">
        <h3>{label}</h3>
        <button type="button" className="hs-panel__close" aria-label="Close" onClick={() => setOpen(false)}>
          &times;
        </button>
      </div>
      <div className="hs-panel__body" role="listbox" aria-label={label}>
        {options.map((o) => (
          <button
            key={String(o.value)}
            type="button"
            role="option"
            aria-selected={String(o.value) === String(value)}
            className={`hs-opt bk-opt${String(o.value) === String(value) ? ' is-sel' : ''}`}
            onClick={() => {
              onChange(o.value);
              setOpen(false);
            }}
          >
            {o.flag && <img className="hs-opt__flag" src={`/assets/flags/${o.flag}.svg`} alt="" />}
            <span className="hs-opt__nm">{o.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`csel-group ${className}`.trim()} ref={groupRef}>
      <select name={name} id={fieldId} className="bk-native" value={value ?? ''} onChange={(e) => onChange(e.target.value)} tabIndex={-1} aria-hidden="true">
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={String(o.value)} value={o.value}>{o.label}</option>
        ))}
      </select>

      <button
        type="button"
        className="hs-control bk-control"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={`hs-control__val${!selected ? ' placeholder' : ''}${selected && selected.flag ? ' hs-control__val--flag' : ''}`}>
          {selected && selected.flag && <img className="hs-opt__flag" src={`/assets/flags/${selected.flag}.svg`} alt="" />}
          <span className="hs-opt__nm">{selected ? selected.label : placeholder}</span>
        </span>
        <Chevron />
      </button>

      {mounted && asPortal && open && createPortal(panel, document.body)}
      {mounted && asPortal && <Overlay open={open} onClose={() => setOpen(false)} />}
      {(!asPortal || !mounted) && panel}
    </div>
  );
}
