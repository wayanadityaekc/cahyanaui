'use client';

import { useEffect, useRef } from 'react';

// 6-box code input: auto-advance, backspace steps back, arrows move, paste fills all; flex-1 + max-w fits 320px.
export default function OtpFields({ length = 6, value, onChange, onComplete, error, disabled, autoFocus }) {
  const refs = useRef([]);
  const digits = Array.from({ length }, (_, i) => value[i] || '');

  useEffect(() => {
    if (autoFocus) refs.current[0]?.focus();
  }, [autoFocus]);

  function commit(next) {
    const joined = next.join('');
    onChange(joined);
    // Use next.every(Boolean), not joined.includes('') - every string includes '', so that never completed.
    if (joined.length === length && next.every(Boolean)) onComplete && onComplete(joined);
  }

  // Paste, autofill or IME can land several digits in one box; spread them across the following boxes.
  function spread(i, raw) {
    const next = digits.slice();
    let pos = i;
    for (const char of raw) {
      if (pos >= length) break;
      next[pos] = char;
      pos += 1;
    }
    commit(next);
    refs.current[Math.min(pos, length - 1)]?.focus();
  }

  function handleChange(i) {
    return (e) => {
      const raw = e.target.value.replace(/\D/g, '');
      if (!raw) { const next = digits.slice(); next[i] = ''; commit(next); return; }
      if (raw.length > 1) { spread(i, raw); return; }
      const next = digits.slice();
      next[i] = raw;
      commit(next);
      if (i < length - 1) refs.current[i + 1]?.focus();
    };
  }

  function handleKeyDown(i) {
    return (e) => {
      if (e.key === 'Backspace' && !digits[i] && i > 0) {
        const next = digits.slice();
        next[i - 1] = '';
        commit(next);
        refs.current[i - 1]?.focus();
      } else if (e.key === 'ArrowLeft' && i > 0) {
        e.preventDefault();
        refs.current[i - 1]?.focus();
      } else if (e.key === 'ArrowRight' && i < length - 1) {
        e.preventDefault();
        refs.current[i + 1]?.focus();
      }
    };
  }

  function handlePaste(i) {
    return (e) => {
      const raw = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
      if (!raw) return;
      e.preventDefault();
      spread(i, raw);
    };
  }

  return (
    <div className="flex gap-2 justify-center" role="group" aria-label="Verification code">
      {digits.map((d, i) => (
        <input
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          ref={(input) => { refs.current[i] = input; }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          value={d}
          disabled={disabled}
          aria-invalid={!!error}
          onChange={handleChange(i)}
          onKeyDown={handleKeyDown(i)}
          onPaste={handlePaste(i)}
          className={
            'flex-1 min-w-0 max-w-[2.6rem] h-[2.8rem] text-center font-body text-h3 font-semibold rounded-md '
            + '[border:1.5px_solid_var(--line)] bg-white text-green '
            + 'focus:outline-none focus:[border-color:var(--color-gold)] focus:[box-shadow:var(--focus-ring)] '
            + 'aria-[invalid=true]:[border-color:var(--color-err)] aria-[invalid=true]:[box-shadow:0_0_0_3px_rgba(154,74,63,0.14)] '
            + 'disabled:opacity-50'
          }
        />
      ))}
    </div>
  );
}
