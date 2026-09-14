'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';
import useMobile from './useMobile';
import Overlay from './Overlay';
import { CONTROL, CONTROL_RICH, CHEV, CONTROL_VAL, CONTROL_VAL_PLACEHOLDER, CONTROL_VAL_FLAG, CONTROL_FLAG_NM, CONTROL_IC, CONTROL_STACK, CONTROL_HINT, CONTROL_VAL_RICH, CONTROL_VAL_RICH_PLACEHOLDER, panelPopup, PANEL_HEAD, PANEL_HEAD_H3, PANEL_CLOSE, PANEL_BODY, opt, CSEL_GROUP, BK_NATIVE, HS_OPT_FLAG, HS_OPT_NM } from './hsClasses';

function Chevron() {
  return <ChevronDown className={CHEV} aria-hidden="true" />;
}

export default function Select({
  label,
  value,
  onChange,
  options = [],
  placeholder = '',
  name,
  id,
  popup = true,
  className = '',
  icon = null,
  hint = '',
}) {
  const rich = !!(icon || hint);
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

  // Panel = mode popup (default; semua pemakaian Select popup). Kalau nanti butuh
  // popup=false (dropdown nempel field / bottom-sheet), mode itu perlu ditambah lagi.
  const panel = (
    <div className={panelPopup(open)} data-portal="select" data-open={open ? '' : undefined}>
      <div className={PANEL_HEAD}>
        <h3 className={PANEL_HEAD_H3}>{label}</h3>
        <button type="button" className={PANEL_CLOSE} aria-label="Close" onClick={() => setOpen(false)}>
          &times;
        </button>
      </div>
      <div className={PANEL_BODY} role="listbox" aria-label={label}>
        {options.map((o) => (
          <button
            key={String(o.value)}
            type="button"
            role="option"
            aria-selected={String(o.value) === String(value)}
            aria-disabled={o.disabled || undefined}
            className={opt(String(o.value) === String(value), o.disabled)}
            disabled={!!o.disabled}
            onClick={() => {
              if (o.disabled) return;
              onChange(o.value);
              setOpen(false);
            }}
          >
            {o.flag && <img className={HS_OPT_FLAG} src={`/assets/flags/${o.flag}.svg`} alt="" />}
            <span className={HS_OPT_NM}>{o.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`${CSEL_GROUP} ${className}`.trim()} ref={groupRef}>
      <select name={name} id={fieldId} className={BK_NATIVE} value={value ?? ''} onChange={(e) => onChange(e.target.value)} tabIndex={-1} aria-hidden="true">
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={String(o.value)} value={o.value} disabled={o.disabled}>{o.label}</option>
        ))}
      </select>

      <button
        type="button"
        className={rich ? CONTROL_RICH : CONTROL}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {icon && <span className={CONTROL_IC} aria-hidden="true">{icon}</span>}
        {rich ? (
          <span className={CONTROL_STACK}>
            {hint && <span className={CONTROL_HINT}>{hint}</span>}
            <span className={!selected ? CONTROL_VAL_RICH_PLACEHOLDER : CONTROL_VAL_RICH}>
              {selected ? selected.label : placeholder}
            </span>
          </span>
        ) : (
          <span className={!selected ? CONTROL_VAL_PLACEHOLDER : (selected.flag ? `${CONTROL_VAL} ${CONTROL_VAL_FLAG}` : CONTROL_VAL)}>
            {selected && selected.flag && <img className={HS_OPT_FLAG} src={`/assets/flags/${selected.flag}.svg`} alt="" />}
            <span className={selected && selected.flag ? `${HS_OPT_NM} ${CONTROL_FLAG_NM}` : 'hs-opt__nm'}>{selected ? selected.label : placeholder}</span>
          </span>
        )}
        <Chevron />
      </button>

      {/* Panel is portal-mounted as soon as it's a portal context, not just while
          open - otherwise it renders straight into its "open" state on first paint
          (no prior "closed" frame for the CSS transition to animate from), which is
          what made it pop in instantly instead of transitioning in smoothly. */}
      {mounted && asPortal && createPortal(panel, document.body)}
      {mounted && asPortal && <Overlay open={open} elevated={popup} onClose={() => setOpen(false)} />}
      {(!asPortal || !mounted) && panel}
    </div>
  );
}
