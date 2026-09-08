'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { readLocal } from '@/lib/storage';
import { KEY, API_BASE } from '@/lib/constants';
import { SHELL, BOX, CLOSE, TITLE, GROUP, LABEL, INPUT, TEXTAREA, BTN, SUCCESS_ICON, SUCCESS_TEXT } from '@/components/ui/modalClasses';

// Login-only, exactly as the server gate requires: opened only from a real
// booking card in My Trips, with a booking_ref that belongs to the account.
// One rating + message per tour, so a custom itinerary can be reviewed per tour.
export default function ReviewModal({ open, prefill, onClose }) {
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [checked, setChecked] = useState([]);
  const [blocks, setBlocks] = useState({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open || !prefill) return;
    setName(prefill.name || '');
    setCountry('');
    setChecked(prefill.items || []);
    setBlocks(Object.fromEntries((prefill.items || []).map((s) => [s, { rating: 0, message: '' }])));
    setError('');
    setDone(false);
  }, [open, prefill]);

  if (!mounted || !open || !prefill) return null;

  const setBlock = (service, patch) =>
    setBlocks((b) => ({ ...b, [service]: { ...b[service], ...patch } }));

  const submit = async () => {
    const picked = (prefill.items || []).filter((s) => checked.includes(s));
    if (!picked.length) return setError('Please pick which tour you are reviewing.');
    for (const s of picked) {
      const b = blocks[s] || {};
      if (!b.rating) return setError('Please give a star rating.');
      if (!b.message || !b.message.trim()) return setError('Please write your review.');
    }
    setError('');
    setBusy(true);
    try {
      const token = readLocal(KEY.token, '');
      for (const s of picked) {
        const d = await fetch(`${API_BASE}/reviews`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            booking_ref: prefill.ref,
            service: s,
            name: name.trim(),
            country: country.trim(),
            rating: blocks[s].rating,
            message: blocks[s].message.trim(),
          }),
        }).then((r) => r.json());
        if (!d || !d.ok) throw new Error((d && d.reason) || 'Something went wrong. Please try again.');
      }
      setDone(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const multi = (prefill.items || []).length > 1;

  // Tailwind-native (migrasi Fase 2, opsi B): shell/box/close/title/group/btn/success
  // pakai konstanta shared (modalClasses.js) - .modal* CSS masih ada (dipakai modal
  // lain), baru dihapus kalau semua modal udah pindah. Yang ISOLATED ke ReviewModal
  // (.rating/.rating__star/.rvm-block/.review-modal__error) di-inline utility + CSS-nya
  // DIHAPUS di commit ini.
  const star = (on) =>
    `p-0 border-none bg-transparent text-[1.7rem] leading-none cursor-pointer transition-[color] duration-[var(--dur-fast)] ${on ? 'text-amber' : 'text-[#d8d2c4]'}`;
  return createPortal(
    <div className={SHELL} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={BOX}>
        <button className={CLOSE} aria-label="Close" onClick={onClose}>&times;</button>
        <h3 className={TITLE}>Leave a Review</h3>

        {!done ? (
          <div data-step="write">
            <div className={GROUP}>
              <label className={LABEL} htmlFor="rvm-name">Your name</label>
              <input className={INPUT} type="text" id="rvm-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className={GROUP}>
              <label className={LABEL} htmlFor="rvm-country">Country (optional)</label>
              <input className={INPUT} type="text" id="rvm-country" value={country} onChange={(e) => setCountry(e.target.value)} />
            </div>

            {multi && (
              <div>
                {(prefill.items || []).map((s) => (
                  <label key={s} className={GROUP}>
                    <input
                      className={INPUT}
                      type="checkbox"
                      checked={checked.includes(s)}
                      onChange={(e) =>
                        setChecked((c) => (e.target.checked ? [...c, s] : c.filter((x) => x !== s)))
                      }
                    />{' '}
                    {s}
                  </label>
                ))}
              </div>
            )}

            <div>
              {(prefill.items || [])
                .filter((s) => checked.includes(s))
                .map((s) => (
                  <div className="mb-[1.2rem] pb-4 [border-bottom:1px_solid_var(--line)] last-of-type:border-b-0 last-of-type:pb-0" key={s}>
                    <p className="mb-2 text-body text-green"><strong>{s}</strong></p>
                    <div className="flex gap-[0.3rem] mb-[0.7rem]">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          type="button"
                          key={n}
                          className={star((blocks[s] && blocks[s].rating) >= n)}
                          aria-label={`${n} star${n > 1 ? 's' : ''}`}
                          onClick={() => setBlock(s, { rating: n })}
                        >
                          &#9733;
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-col mb-0">
                      <textarea
                        className={TEXTAREA}
                        rows="3"
                        placeholder={`Your review for ${s}`}
                        value={(blocks[s] && blocks[s].message) || ''}
                        onChange={(e) => setBlock(s, { message: e.target.value })}
                      />
                    </div>
                  </div>
                ))}
            </div>

            {error && <p className="mt-[-0.4rem] mb-4 text-small text-err">{error}</p>}
            <button type="button" className={BTN} onClick={submit} disabled={busy}>
              {busy ? 'Sending...' : 'Submit review'}
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className={SUCCESS_ICON}>&#10003;</div>
            <h3 className={TITLE}>Thank you!</h3>
            <p className={SUCCESS_TEXT}>Your review has been submitted and will appear once approved.</p>
            <button type="button" className={BTN} onClick={onClose}>Done</button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
