'use client';

import { useEffect, useRef } from 'react';

const BOX =
  'flex-1 min-w-0 max-w-[2.6rem] h-[2.8rem] text-center font-body text-h3 font-semibold rounded-md ' +
  '[border:1.5px_solid_var(--line)] bg-white text-green ' +
  'focus:outline-none focus:[border-color:var(--color-gold)] focus:[box-shadow:var(--focus-ring)] ' +
  'aria-[invalid=true]:[border-color:var(--color-err)] aria-[invalid=true]:[box-shadow:0_0_0_3px_rgba(154,74,63,0.14)] ' +
  'disabled:opacity-50';

// CUE's 6-box code input: auto-advance, backspace steps back, arrows move, paste fills all; flex-1 + max-w fits 320px.
export default function OtpFields({ length = 6, value = '', onChange = () => {}, onComplete = null, error = false, disabled = false, autoFocus = false }) {
  const refs = useRef([]);
  const digits = Array.from({ length }, (_, index) => value[index] || '');

  useEffect(() => {
    if (autoFocus) refs.current[0]?.focus();
  }, [autoFocus]);

  function commit(next) {
    const joined = next.join('');
    onChange(joined);
    // next.every(Boolean), not joined.includes(''): every string includes '', so that never completed.
    if (joined.length === length && next.every(Boolean) && onComplete) onComplete(joined);
  }

  // Paste, autofill or IME can land several digits in one box; spread them across the following boxes.
  function spread(start, raw) {
    const next = [...digits];
    const fits = raw.slice(0, length - start).split('');
    fits.forEach((char, offset) => { next[start + offset] = char; });
    commit(next);
    refs.current[Math.min(start + fits.length, length - 1)]?.focus();
  }

  function handleChange(index) {
    return (e) => {
      const raw = e.target.value.replace(/\D/g, '');
      if (!raw) {
        const next = [...digits];
        next[index] = '';
        commit(next);
        return;
      }
      if (raw.length > 1) {
        spread(index, raw);
        return;
      }
      const next = [...digits];
      next[index] = raw;
      commit(next);
      if (index < length - 1) refs.current[index + 1]?.focus();
    };
  }

  function handleKeyDown(index) {
    return (e) => {
      if (e.key === 'Backspace' && !digits[index] && index > 0) {
        const next = [...digits];
        next[index - 1] = '';
        commit(next);
        refs.current[index - 1]?.focus();
      } else if (e.key === 'ArrowLeft' && index > 0) {
        e.preventDefault();
        refs.current[index - 1]?.focus();
      } else if (e.key === 'ArrowRight' && index < length - 1) {
        e.preventDefault();
        refs.current[index + 1]?.focus();
      }
    };
  }

  function handlePaste(index) {
    return (e) => {
      const raw = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
      if (!raw) return;
      e.preventDefault();
      spread(index, raw);
    };
  }

  return (
    <div className="flex gap-2 justify-center" role="group" aria-label="Verification code">
      {digits.map((digit, index) => (
        <input
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          ref={(input) => { refs.current[index] = input; }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          value={digit}
          disabled={disabled}
          aria-label={`Digit ${index + 1}`}
          aria-invalid={!!error}
          onChange={handleChange(index)}
          onKeyDown={handleKeyDown(index)}
          onPaste={handlePaste(index)}
          className={BOX}
        />
      ))}
    </div>
  );
}
