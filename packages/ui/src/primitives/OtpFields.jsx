'use client';

import { useEffect, useRef } from 'react';

const BOX =
  'flex-1 min-w-0 max-w-[2.6rem] h-[2.8rem] text-center font-body text-h3 font-semibold rounded-md ' +
  '[border:1.5px_solid_var(--line)] bg-white text-green ' +
  'focus:outline-none focus:[border-color:var(--color-gold)] focus:[box-shadow:var(--focus-ring)] ' +
  'aria-[invalid=true]:[border-color:var(--color-err)] aria-[invalid=true]:[box-shadow:0_0_0_3px_rgba(154,74,63,0.14)] ' +
  'disabled:opacity-50';

export default function OtpFields({
  length = 6,
  value = '',
  onChange = () => {},
  onComplete = null,
  error = false,
  disabled = false,
  autoFocus = false,
}) {
  const refs = useRef([]);
  const digits = Array.from({ length }, (unusedValue, index) => value[index] || '');

  useEffect(() => {
    if (autoFocus) refs.current[0]?.focus();
  }, [autoFocus]);

  function commit(next) {
    const joined = next.join('');
    onChange(joined);
    if (joined.length === length && next.every(Boolean) && onComplete) onComplete(joined);
  }

  function spreadPastedDigits(start, raw) {
    const nextDigits = [...digits];
    const fits = raw.slice(0, length - start).split('');
    fits.forEach((char, offset) => {
      nextDigits[start + offset] = char;
    });
    commit(nextDigits);
    refs.current[Math.min(start + fits.length, length - 1)]?.focus();
  }

  function handleChange(index) {
    return (event) => {
      const raw = event.target.value.replace(/\D/g, '');
      if (!raw) {
        const nextDigits = [...digits];
        nextDigits[index] = '';
        commit(nextDigits);
        return;
      }
      if (raw.length > 1) {
        spreadPastedDigits(index, raw);
        return;
      }
      const nextDigitsItem = [...digits];
      nextDigitsItem[index] = raw;
      commit(nextDigitsItem);
      if (index < length - 1) refs.current[index + 1]?.focus();
    };
  }

  function handleKeyDown(index) {
    return (event) => {
      if (event.key === 'Backspace' && !digits[index] && index > 0) {
        const nextDigits = [...digits];
        nextDigits[index - 1] = '';
        commit(nextDigits);
        refs.current[index - 1]?.focus();
      } else if (event.key === 'ArrowLeft' && index > 0) {
        event.preventDefault();
        refs.current[index - 1]?.focus();
      } else if (event.key === 'ArrowRight' && index < length - 1) {
        event.preventDefault();
        refs.current[index + 1]?.focus();
      }
    };
  }

  function handlePaste(index) {
    return (event) => {
      const raw = (event.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
      if (!raw) return;
      event.preventDefault();
      spreadPastedDigits(index, raw);
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
