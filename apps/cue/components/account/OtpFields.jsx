'use client';

import { useEffect, useRef } from 'react';

/**
 * 6-box verification-code input (WO2, Sep 2026 - sign-in by code, not a link:
 * Wayan, "kirim kode konfirmasi ... 6 angka untuk dimasukkan"). One box per
 * digit - the common bank/GitHub-2FA/Stripe shape, and Flowbite's own OTP
 * pattern is the same boxes. Reference note: ui.shadcn.com and flowbite.com
 * were both unreachable from this session (network policy blocks them), so
 * this is built from that well-known shape rather than a fetched spec - happy
 * to match a specific screenshot if Wayan has one. (shadcn's InputOTP is a
 * different technique - one hidden input overlaid with rendered "slots" - which
 * would be a fair alternative to build later, but isn't reachable to copy
 * today either.)
 *
 * Auto-advances on entry, backspace clears then steps back, arrow keys move
 * focus, and pasting a full code (from the keyboard's "paste code from
 * Messages/Mail" suggestion, or a password manager) fills every box at once
 * from wherever the paste lands.
 *
 * `flex-1` + a `max-w` cap (not a fixed width) so the row shrinks to fit a
 * 320px popup without overlapping the modal's own padding, and does not
 * balloon on a wide screen either.
 */
export default function OtpFields({ length = 6, value, onChange, onComplete, error, disabled, autoFocus }) {
  const refs = useRef([]);
  const digits = Array.from({ length }, (_, i) => value[i] || '');

  useEffect(() => {
    if (autoFocus) refs.current[0]?.focus();
  }, [autoFocus]);

  function commit(next) {
    const joined = next.join('');
    onChange(joined);
    // next.every(Boolean), NOT joined.includes('') - every string "includes"
    // the empty string, so that check was always true and onComplete never
    // fired on a real 6th digit; only Verify (which reads `code` directly)
    // ever completed a code.
    if (joined.length === length && next.every(Boolean)) onComplete && onComplete(joined);
  }

  // A paste, autofill, or fast IME input can land several digits in one box at
  // once - spread them across this box and the ones after it.
  function spread(i, raw) {
    const next = digits.slice();
    let pos = i;
    for (const ch of raw) {
      if (pos >= length) break;
      next[pos] = ch;
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
          ref={(el) => { refs.current[i] = el; }}
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
