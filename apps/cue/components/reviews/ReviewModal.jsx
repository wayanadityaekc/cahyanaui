'use client';

import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { readLocal } from '@/lib/storage';
import { KEY, API_BASE } from '@/lib/constants';
import Select from '@/components/ui/Select';
import { COUNTRIES } from '@/content/shared/countries';
import { reviewSchema } from '@/lib/schemas';
import { validateWith } from '@/lib/validate';
import {
  SHELL,
  BOX,
  CLOSE,
  TITLE,
  GROUP,
  LABEL,
  INPUT,
  TEXTAREA,
  BTN,
  FIELD_ERR,
  SUCCESS_ICON,
  SUCCESS_TEXT,
} from '@/components/ui/modalClasses';
import ModalPresence from '@/components/ui/ModalPresence';
import LoadFallback from '@/components/ui/LoadFallback';
import { ROW_RULE } from '@/components/ui/separatorClasses';
import useBodyLock from '@/components/ui/useBodyLock';
import { useAccount } from '@/state/AccountProvider';

const COUNTRY_OPTIONS = COUNTRIES.map((country) => ({ value: country.code, label: country.name, flag: country.code }));

function buildItemKey({ ref, service }) {
  return `${ref}::${service}`;
}

export default function ReviewModal({ open = false, prefill = null, onClose = () => {} }) {
  const [isMounted, setIsMounted] = useState(false);
  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [checked, setChecked] = useState([]);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [partial, setPartial] = useState([]);
  const { refreshTrips } = useAccount() || {};
  const sent = useRef(false);

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    if (!open || !prefill) return;
    setName(view.name || '');
    setCountryCode('');
    setChecked((view.items || []).map(buildItemKey));
    setRating(0);
    setMessage('');
    setErrors({});
    setError('');
    setPartial([]);
    setIsDone(false);
    sent.current = false;
  }, [open, prefill]);

  const lastPrefill = useRef(null);
  useBodyLock(open);

  if (prefill) lastPrefill.current = prefill;
  const view = prefill || lastPrefill.current;
  if (!isMounted || !view) return null;

  function handleClose() {
    if (sent.current && refreshTrips) {
      sent.current = false;
      refreshTrips();
    }
    onClose();
  }

  const items = view.items || [];
  const hasMultipleItems = items.length > 1;

  async function handleReviewSubmit() {
    const picked = items.filter((it) => checked.includes(buildItemKey(it)));
    const { ok, errors: fieldErrors } = validateWith(reviewSchema, {
      picked: picked.map(buildItemKey),
      rating,
      message,
    });
    setErrors(fieldErrors);
    if (!ok) {
      setError('');
      return;
    }
    setError('');
    setPartial([]);
    setIsBusy(true);
    const token = readLocal(KEY.token, '');
    const country = (COUNTRIES.find((countryItem) => countryItem.code === countryCode) || {}).name || '';
    const results = [];
    for (const it of picked) {
      try {
        const response = await fetch(`${API_BASE}/reviews`, {
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
        const data = await response.json();
        results.push({
          it,
          ok: !!(data && data.ok),
          reason: (data && data.reason) || 'Something went wrong. Please try again.',
        });
      } catch (e) {
        results.push({ it, ok: false, reason: 'Something went wrong. Please try again.' });
      }
    }
    setIsBusy(false);
    if (results.some((result) => result.ok)) sent.current = true;
    const failed = results.filter((result) => !result.ok);
    if (failed.length === results.length) {
      setError(failed[0].reason);
      return;
    }
    setPartial(failed.map((failure) => ({ service: failure.it.service, reason: failure.reason })));
    setIsDone(true);
  }

  function buildStarClass(active) {
    return `p-0 border-none bg-transparent text-[1.9rem] leading-none cursor-pointer transition-[color] duration-[var(--dur-fast)] ${active ? 'text-amber' : 'text-[#d8d2c4]'}`;
  }
  const CHECK_ROW = `flex items-start gap-[0.6rem] py-[0.5rem] ${ROW_RULE} cursor-pointer`;
  const CHECK_INPUT = 'mt-[0.2rem] w-4 h-4 flex-none accent-[var(--color-cta)]';
  const CHECK_SVC = 'font-semibold text-green text-body';
  const CHECK_META = 'block text-small text-muted mt-[0.1rem]';

  return createPortal(
    <ModalPresence open={!!open && !!prefill} onClose={handleClose} label="Leave a review" box={BOX}>
      <button className={CLOSE} aria-label="Close" onClick={handleClose}>
        &times;
      </button>
      <h3 className={TITLE}>Leave a Review</h3>

      {!isDone && !items.length ? (
        <div className="text-center">
          <LoadFallback className="mb-4" />
          <button type="button" className={BTN} onClick={handleClose}>
            Close
          </button>
        </div>
      ) : !isDone ? (
        <div data-step="write">
          <div className={GROUP}>
            <label className={LABEL} htmlFor="rvm-name">
              Your name
            </label>
            <input
              className={INPUT}
              type="text"
              id="rvm-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className={GROUP}>
            <label className={LABEL} htmlFor="rvm-country">
              Country (optional)
            </label>
            <Select
              id="rvm-country"
              label="Country"
              value={countryCode}
              onChange={setCountryCode}
              options={COUNTRY_OPTIONS}
              placeholder="Select your country"
            />
          </div>

          {hasMultipleItems && (
            <div className={GROUP}>
              <label className={LABEL}>Which trips are you reviewing?</label>
              <div>
                {items.map((it) => {
                  const key = buildItemKey(it);
                  return (
                    <label key={key} className={CHECK_ROW}>
                      <input
                        className={CHECK_INPUT}
                        type="checkbox"
                        checked={checked.includes(key)}
                        onChange={(event) => {
                          setChecked((previousChecked) =>
                            event.target.checked
                              ? [...previousChecked, key]
                              : previousChecked.filter((checkedKey) => checkedKey !== key),
                          );
                          setErrors((previousErrors) =>
                            previousErrors.picked ? { ...previousErrors, picked: undefined } : previousErrors,
                          );
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
              {errors.picked && (
                <small role="alert" className={FIELD_ERR}>
                  {errors.picked}
                </small>
              )}
            </div>
          )}

          <div className={GROUP}>
            <label className={LABEL}>Overall Experience</label>
            <div className="flex gap-[0.3rem]">
              {[1, 2, 3, 4, 5].map((starNumber) => (
                <button
                  type="button"
                  key={starNumber}
                  className={buildStarClass(rating >= starNumber)}
                  aria-label={`${starNumber} star${starNumber > 1 ? 's' : ''}`}
                  onClick={() => {
                    setRating(starNumber);
                    setErrors((previousErrors) =>
                      previousErrors.rating ? { ...previousErrors, rating: undefined } : previousErrors,
                    );
                  }}
                >
                  &#9733;
                </button>
              ))}
            </div>
            {errors.rating && (
              <small role="alert" className={FIELD_ERR}>
                {errors.rating}
              </small>
            )}
          </div>

          <div className={GROUP}>
            <label className={LABEL} htmlFor="rvm-message">
              Tell us about your trip
            </label>
            <textarea
              className={TEXTAREA}
              id="rvm-message"
              rows="4"
              placeholder="What would you like to share?"
              value={message}
              onChange={(event) => {
                setMessage(event.target.value);
                setErrors((previousErrors) =>
                  previousErrors.message ? { ...previousErrors, message: undefined } : previousErrors,
                );
              }}
              aria-invalid={!!errors.message}
            />
            {errors.message && (
              <small role="alert" className={FIELD_ERR}>
                {errors.message}
              </small>
            )}
          </div>

          {error && <p className="mt-[-0.4rem] mb-4 text-small text-err">{error}</p>}
          <button type="button" className={BTN} onClick={handleReviewSubmit} disabled={isBusy}>
            {isBusy ? 'Sending...' : 'Submit review'}
          </button>
        </div>
      ) : (
        <div className="text-center">
          <div className={SUCCESS_ICON}>&#10003;</div>
          <h3 className={TITLE}>Thank you!</h3>
          <p className={SUCCESS_TEXT}>
            {partial.length
              ? `Your review is live on the site. ${partial.length} of the trips you ticked could not be included:`
              : 'Your review is now live on the site.'}
          </p>
          {partial.length ? (
            <ul className="list-none text-left mx-auto mb-4 max-w-[22rem]">
              {partial.map((partialFailure) => (
                <li key={partialFailure.service} className={`text-small text-muted py-[0.35rem] ${ROW_RULE}`}>
                  <span className="font-semibold text-green">{partialFailure.service}</span> - {partialFailure.reason}
                </li>
              ))}
            </ul>
          ) : null}
          <button type="button" className={BTN} onClick={handleClose}>
            Done
          </button>
        </div>
      )}
    </ModalPresence>,
    document.body,
  );
}
