'use client';

import { useEffect, useRef } from 'react';

export default function OtpFields({ length = 6, value, onChange, onComplete, error, disabled, autoFocus }) {
  const refs = useRef([]);
  const digits = Array.from({ length }, (unusedValue, index) => value[index] || '');

  useEffect(() => {
    if (autoFocus) refs.current[0]?.focus();
  }, [autoFocus]);

  function commit(next) {
    const joined = next.join('');
    onChange(joined);
    if (joined.length === length && next.every(Boolean)) onComplete && onComplete(joined);
  }

  function spread(digitIndex, raw) {
    const next = digits.slice();
    let pos = digitIndex;
    for (const char of raw) {
      if (pos >= length) break;
      next[pos] = char;
      pos += 1;
    }
    commit(next);
    refs.current[Math.min(pos, length - 1)]?.focus();
  }

  function handleChange(digitIndex) {
    return (event) => {
      const raw = event.target.value.replace(/\D/g, '');
      if (!raw) {
        const next = digits.slice();
        next[digitIndex] = '';
        commit(next);
        return;
      }
      if (raw.length > 1) {
        spread(digitIndex, raw);
        return;
      }
      const next = digits.slice();
      next[digitIndex] = raw;
      commit(next);
      if (digitIndex < length - 1) refs.current[digitIndex + 1]?.focus();
    };
  }

  function handleKeyDown(digitIndex) {
    return (event) => {
      if (event.key === 'Backspace' && !digits[digitIndex] && digitIndex > 0) {
        const next = digits.slice();
        next[digitIndex - 1] = '';
        commit(next);
        refs.current[digitIndex - 1]?.focus();
      } else if (event.key === 'ArrowLeft' && digitIndex > 0) {
        event.preventDefault();
        refs.current[digitIndex - 1]?.focus();
      } else if (event.key === 'ArrowRight' && digitIndex < length - 1) {
        event.preventDefault();
        refs.current[digitIndex + 1]?.focus();
      }
    };
  }

  function handlePaste(digitIndex) {
    return (event) => {
      const raw = (event.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
      if (!raw) return;
      event.preventDefault();
      spread(digitIndex, raw);
    };
  }

  return (
    <div className="flex gap-2 justify-center" role="group" aria-label="Verification code">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(input) => {
            refs.current[index] = input;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          value={digit}
          disabled={disabled}
          aria-invalid={!!error}
          onChange={handleChange(index)}
          onKeyDown={handleKeyDown(index)}
          onPaste={handlePaste(index)}
          className={
            'flex-1 min-w-0 max-w-[2.6rem] h-[2.8rem] text-center font-body text-h3 font-semibold rounded-md ' +
            '[border:1.5px_solid_var(--line)] bg-white text-green ' +
            'focus:outline-none focus:[border-color:var(--color-gold)] focus:[box-shadow:var(--focus-ring)] ' +
            'aria-[invalid=true]:[border-color:var(--color-err)] aria-[invalid=true]:[box-shadow:0_0_0_3px_rgba(154,74,63,0.14)] ' +
            'disabled:opacity-50'
          }
        />
      ))}
    </div>
  );
}
