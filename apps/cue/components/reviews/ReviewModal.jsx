'use client';

import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { readLocal } from '@/lib/storage';
import { KEY, API_BASE } from '@/lib/constants';
import Select from '@/components/ui/Select';
import { COUNTRIES } from '@/content/shared/countries';
import { reviewSchema } from '@/lib/schemas';
import { validateWith } from '@/lib/validate';
import { SHELL, BOX, CLOSE, TITLE, GROUP, LABEL, INPUT, TEXTAREA, BTN, FIELD_ERR, SUCCESS_ICON, SUCCESS_TEXT } from '@/components/ui/modalClasses';
import ModalPresence from '@/components/ui/ModalPresence';
import { ROW_RULE } from '@/components/ui/separatorClasses';
import useBodyLock from '@/components/ui/useBodyLock';
import { useAccount } from '@/state/AccountProvider';

const COUNTRY_OPTIONS = COUNTRIES.map((c) => ({ value: c.code, label: c.name, flag: c.code }));

// Item key = (booking_ref, service), the pair the server de-dupes on; a service can repeat across bookings.
function itemKey({ ref, service }) { return `${ref}::${service}`; }

// Login-only review popup: one rating + message posted to every ticked past trip.
export default function ReviewModal({ open, prefill, onClose }) {
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [checked, setChecked] = useState([]);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [partial, setPartial] = useState([]);
  const { refreshTrips } = useAccount() || {};
  // Trips are re-read on CLOSE, not on success: prefill is a new object each render, so a mid-popup re-read resets the form.
  const sent = useRef(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open || !prefill) return;
    setName(view.name || '');
    setCountryCode('');
    // Every trip starts checked; the guest unticks what to skip.
    setChecked((view.items || []).map(itemKey));
    setRating(0);
    setMessage('');
    setErrors({});
    setError('');
    setPartial([]);
    setDone(false);
    sent.current = false;
  }, [open, prefill]);

  const lastPrefill = useRef(null);
  useBodyLock(open);

  // Render from the last prefill while the exit animation runs, since the live one is already gone.
  if (prefill) lastPrefill.current = prefill;
  const view = prefill || lastPrefill.current;
  if (!mounted || !view) return null;

  function close() {
    if (sent.current && refreshTrips) { sent.current = false; refreshTrips(); }
    onClose();
  }

  const items = view.items || [];
  const multi = items.length > 1;

  async function submit() {
    const picked = items.filter((it) => checked.includes(itemKey(it)));
    const { ok, errors: fieldErrors } = validateWith(reviewSchema, {
      picked: picked.map(itemKey),
      rating,
      message,
    });
    setErrors(fieldErrors);
    if (!ok) { setError(''); return; }
    setError('');
    setPartial([]);
    setBusy(true);
    const token = readLocal(KEY.token, '');
    const country = (COUNTRIES.find((c) => c.code === countryCode) || {}).name || '';
    const results = [];
    // One POST per ticked trip, all attempted; never stop at the first refusal (earlier ones are already live).
    for (const it of picked) {
      try {
        const res = await fetch(`${API_BASE}/reviews`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            booking_ref: it.ref,
            service: it.service,
            name: name.trim(),
            country,
            rating,
            message: message.trim(),
          }),
        });
        const d = await res.json();
        results.push({ it, ok: !!(d && d.ok), reason: (d && d.reason) || 'Something went wrong. Please try again.' });
      } catch (e) {
        results.push({ it, ok: false, reason: 'Something went wrong. Please try again.' });
      }
    }
    setBusy(false);
    if (results.some((r) => r.ok)) sent.current = true;
    const failed = results.filter((r) => !r.ok);
    if (failed.length === results.length) { setError(failed[0].reason); return; }
    // Partial success: show thank-you and list the trips that failed with the server's reason.
    setPartial(failed.map((r) => ({ service: r.it.service, reason: r.reason })));
    setDone(true);
  }

  // Star buttons and checklist rows for this modal; shell/box/title strings come from modalClasses.
  function star(active) { return `p-0 border-none bg-transparent text-[1.9rem] leading-none cursor-pointer transition-[color] duration-[var(--dur-fast)] ${active ? 'text-amber' : 'text-[#d8d2c4]'}`; }
  const CHECK_ROW = `flex items-start gap-[0.6rem] py-[0.5rem] ${ROW_RULE} cursor-pointer`;
  const CHECK_INPUT = 'mt-[0.2rem] w-4 h-4 flex-none accent-[var(--color-cta)]';
  const CHECK_SVC = 'font-semibold text-green text-body';
  const CHECK_META = 'block text-small text-muted mt-[0.1rem]';

  return createPortal(
    <ModalPresence open={!!open && !!prefill} onClose={close} label="Leave a review" box={BOX}>
        <button className={CLOSE} aria-label="Close" onClick={close}>&times;</button>
        <h3 className={TITLE}>Leave a Review</h3>

        {!done ? (
          <div data-step="write">
            <div className={GROUP}>
              <label className={LABEL} htmlFor="rvm-name">Your name</label>
              <input className={INPUT} type="text" id="rvm-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className={GROUP}>
              <label className={LABEL} htmlFor="rvm-country">Country (optional)</label>
              <Select
                id="rvm-country"
                label="Country"
                value={countryCode}
                onChange={setCountryCode}
                options={COUNTRY_OPTIONS}
                placeholder="Select your country"
              />
            </div>

            {multi && (
              <div className={GROUP}>
                <label className={LABEL}>Which trips are you reviewing?</label>
                <div>
                  {items.map((it) => {
                    const key = itemKey(it);
                    return (
                      <label key={key} className={CHECK_ROW}>
                        <input
                          className={CHECK_INPUT}
                          type="checkbox"
                          checked={checked.includes(key)}
                          onChange={(e) => {
                            setChecked((c) => (e.target.checked ? [...c, key] : c.filter((x) => x !== key)));
                            setErrors((v) => (v.picked ? { ...v, picked: undefined } : v));
                          }}
                        />
                        <span>
                          <span className={CHECK_SVC}>{it.service}</span>
                          {(it.tripName && it.tripName !== it.service) || it.date ? (
                            <span className={CHECK_META}>
                              {[it.tripName && it.tripName !== it.service ? it.tripName : null, it.date]
                                .filter(Boolean)
                                .join(' · ')}
                            </span>
                          ) : null}
                        </span>
                      </label>
                    );
                  })}
                </div>
                {errors.picked && <small role="alert" className={FIELD_ERR}>{errors.picked}</small>}
              </div>
            )}

            <div className={GROUP}>
              <label className={LABEL}>Overall Experience</label>
              <div className="flex gap-[0.3rem]">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    type="button"
                    key={n}
                    className={star(rating >= n)}
                    aria-label={`${n} star${n > 1 ? 's' : ''}`}
                    onClick={() => { setRating(n); setErrors((v) => (v.rating ? { ...v, rating: undefined } : v)); }}
                  >
                    &#9733;
                  </button>
                ))}
              </div>
              {errors.rating && <small role="alert" className={FIELD_ERR}>{errors.rating}</small>}
            </div>

            <div className={GROUP}>
              <label className={LABEL} htmlFor="rvm-message">Tell us about your trip</label>
              <textarea
                className={TEXTAREA}
                id="rvm-message"
                rows="4"
                placeholder="What would you like to share?"
                value={message}
                onChange={(e) => { setMessage(e.target.value); setErrors((v) => (v.message ? { ...v, message: undefined } : v)); }}
                aria-invalid={!!errors.message}
              />
              {errors.message && <small role="alert" className={FIELD_ERR}>{errors.message}</small>}
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
            {/* Reviews publish immediately once accepted, so never say "once approved". */}
            <p className={SUCCESS_TEXT}>
              {partial.length
                ? `Your review is live on the site. ${partial.length} of the trips you ticked could not be included:`
                : 'Your review is now live on the site.'}
            </p>
            {partial.length ? (
              <ul className="list-none text-left mx-auto mb-4 max-w-[22rem]">
                {partial.map((p) => (
                  <li key={p.service} className={`text-small text-muted py-[0.35rem] ${ROW_RULE}`}>
                    <span className="font-semibold text-green">{p.service}</span> - {p.reason}
                  </li>
                ))}
              </ul>
            ) : null}
            <button type="button" className={BTN} onClick={close}>Done</button>
          </div>
        )}
    </ModalPresence>,
    document.body,
  );
}
