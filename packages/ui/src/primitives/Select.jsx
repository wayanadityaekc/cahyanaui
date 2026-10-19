'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import useMobile from '../lib/useMobile.js';
import Overlay from './Overlay.jsx';
import {
  CONTROL,
  CONTROL_RICH,
  CHEV,
  CONTROL_VAL,
  CONTROL_VAL_PLACEHOLDER,
  CONTROL_VAL_FLAG,
  CONTROL_FLAG_NM,
  CONTROL_IC,
  CONTROL_STACK,
  CONTROL_HINT,
  CONTROL_VAL_RICH,
  CONTROL_VAL_RICH_PLACEHOLDER,
  panelPopup,
  PANEL_HEAD,
  PANEL_HEAD_H3,
  PANEL_CLOSE,
  PANEL_BODY,
  opt,
  CSEL_GROUP,
  BK_NATIVE,
  HS_OPT_FLAG,
  HS_OPT_NM,
} from './controlClasses.js';

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
  const hasIconOrHint = !!(icon || hint);
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useMobile();
  const groupRef = useRef(null);
  const autoId = useId();
  const fieldId = id || `sel-${autoId}`;
  const asPortal = isMobile || popup;

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    if (!isOpen || asPortal) return;
    function handleOutsidePointerDown(event) {
      if (groupRef.current && !groupRef.current.contains(event.target)) setIsOpen(false);
    }
    document.addEventListener('click', handleOutsidePointerDown);
    return () => document.removeEventListener('click', handleOutsidePointerDown);
  }, [isOpen, asPortal]);

  useEffect(() => {
    if (!isOpen) return;
    function handleEscapeKeyDown(event) {
      return event.key === 'Escape' && setIsOpen(false);
    }
    document.addEventListener('keydown', handleEscapeKeyDown);
    return () => document.removeEventListener('keydown', handleEscapeKeyDown);
  }, [isOpen]);

  const selected = options.find((option) => String(option.value) === String(value));

  const panel = (
    <div className={panelPopup(isOpen)} data-portal="select" data-open={isOpen ? '' : undefined}>
      <div className={PANEL_HEAD}>
        <h3 className={PANEL_HEAD_H3}>{label}</h3>
        <button type="button" className={PANEL_CLOSE} aria-label="Close" onClick={() => setIsOpen(false)}>
          &times;
        </button>
      </div>
      <div className={PANEL_BODY} role="listbox" aria-label={label}>
        {options.map((option) => (
          <button
            key={String(option.value)}
            type="button"
            role="option"
            aria-selected={String(option.value) === String(value)}
            aria-disabled={option.disabled || undefined}
            className={opt(String(option.value) === String(value), option.disabled)}
            disabled={!!option.disabled}
            onClick={() => {
              if (option.disabled) return;
              onChange(option.value);
              setIsOpen(false);
            }}
          >
            {option.flag && <img className={HS_OPT_FLAG} src={`/assets/flags/${option.flag}.svg`} alt="" />}
            <span className={HS_OPT_NM}>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  function pickControlClasses() {
    if (!selected) return CONTROL_VAL_PLACEHOLDER;
    if (selected.flag) return `${CONTROL_VAL} ${CONTROL_VAL_FLAG}`;
    return CONTROL_VAL;
  }

  return (
    <div className={clsx(CSEL_GROUP, className)} ref={groupRef}>
      <select
        name={name}
        id={fieldId}
        className={BK_NATIVE}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        tabIndex={-1}
        aria-hidden="true"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={String(option.value)} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>

      <button
        type="button"
        className={hasIconOrHint ? CONTROL_RICH : CONTROL}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((wasOpen) => !wasOpen)}
      >
        {icon && (
          <span className={CONTROL_IC} aria-hidden="true">
            {icon}
          </span>
        )}
        {hasIconOrHint ? (
          <span className={CONTROL_STACK}>
            {hint && <span className={CONTROL_HINT}>{hint}</span>}
            <span className={!selected ? CONTROL_VAL_RICH_PLACEHOLDER : CONTROL_VAL_RICH}>
              {selected ? selected.label : placeholder}
            </span>
          </span>
        ) : (
          <span className={pickControlClasses()}>
            {selected && selected.flag && (
              <img className={HS_OPT_FLAG} src={`/assets/flags/${selected.flag}.svg`} alt="" />
            )}
            <span className={selected && selected.flag ? `${HS_OPT_NM} ${CONTROL_FLAG_NM}` : 'hs-opt__nm'}>
              {selected ? selected.label : placeholder}
            </span>
          </span>
        )}
        <Chevron />
      </button>

      {isMounted && asPortal && createPortal(panel, document.body)}
      {isMounted && asPortal && <Overlay open={isOpen} elevated={popup} onClose={() => setIsOpen(false)} />}
      {(!asPortal || !isMounted) && panel}
    </div>
  );
}
