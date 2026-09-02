'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { readLocal } from '@/lib/storage';
import { KEY, API_BASE } from '@/lib/constants';

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

  return createPortal(
    <div className="modal active" id="review-modal" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal__box">
        <button className="modal__close" aria-label="Close" onClick={onClose}>&times;</button>
        <h3 className="modal__title">Leave a Review</h3>

        {!done ? (
          <div data-step="write">
            <div className="modal__group">
              <label htmlFor="rvm-name">Your name</label>
              <input type="text" id="rvm-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="modal__group">
              <label htmlFor="rvm-country">Country (optional)</label>
              <input type="text" id="rvm-country" value={country} onChange={(e) => setCountry(e.target.value)} />
            </div>

            {multi && (
              <div id="rvm-checklist">
                {(prefill.items || []).map((s) => (
                  <label key={s} className="modal__group">
                    <input
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

            <div id="rvm-blocks">
              {(prefill.items || [])
                .filter((s) => checked.includes(s))
                .map((s, idx) => (
                  <div className="rvm-block" data-idx={idx} data-service={s} key={s}>
                    <p className="modal__sub"><strong>{s}</strong></p>
                    <div className="rating">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          type="button"
                          key={n}
                          className={`rating__star${(blocks[s] && blocks[s].rating) >= n ? ' active' : ''}`}
                          aria-label={`${n} star${n > 1 ? 's' : ''}`}
                          onClick={() => setBlock(s, { rating: n })}
                        >
                          &#9733;
                        </button>
                      ))}
                    </div>
                    <div className="modal__group">
                      <textarea
                        rows="3"
                        placeholder={`Your review for ${s}`}
                        value={(blocks[s] && blocks[s].message) || ''}
                        onChange={(e) => setBlock(s, { message: e.target.value })}
                      />
                    </div>
                  </div>
                ))}
            </div>

            {error && <p className="review-modal__error">{error}</p>}
            <button type="button" className="modal__btn" onClick={submit} disabled={busy}>
              {busy ? 'Sending...' : 'Submit review'}
            </button>
          </div>
        ) : (
          <div className="modal__success" style={{ display: 'block' }}>
            <div className="modal__success-icon">&#10003;</div>
            <h3 className="modal__title">Thank you!</h3>
            <p>Your review has been submitted and will appear once approved.</p>
            <button type="button" className="modal__btn" onClick={onClose}>Done</button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
