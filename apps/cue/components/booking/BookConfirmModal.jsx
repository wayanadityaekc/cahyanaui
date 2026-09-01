'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useBooking } from '@/state/BookingProvider';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import { useReferral } from '@/state/ReferralProvider';
import { useAccount } from '@/state/AccountProvider';
import { quote, submitInquiry } from '@/lib/api';
import { readLocal, writeLocal } from '@/lib/storage';
import { KEY, WHATSAPP_NUMBER } from '@/lib/constants';
import PayChips from './PayChips';

const EMPTY = { name: '', phone: '', email: '', pickup: '', dropoff: '', referral: '' };

export default function BookConfirmModal() {
  const { ctx, closeBooking } = useBooking();
  const { currency, stay, displayGuests } = useTripPrefs();
  const { referral, apply } = useReferral();
  const { setAccount } = useAccount();

  const [f, setF] = useState(EMPTY);
  const [priced, setPriced] = useState(null);
  const [refMsg, setRefMsg] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!ctx) {
      setF(EMPTY);
      setPriced(null);
      setDone(false);
      setError('');
      setRefMsg(null);
      return;
    }
    setF((v) => ({ ...v, referral: (referral && referral.code) || '' }));
    let cancelled = false;
    quote({ lines: ctx.lines, currency, stay, referral: (referral && referral.code) || '' })
      .then((d) => !cancelled && d && d.lines && setPriced(d))
      .catch(() => {});
    return () => { cancelled = true; };
  }, [ctx, currency, stay, referral]);

  if (!mounted || !ctx) return null;

  const set = (k) => (e) => setF((v) => ({ ...v, [k]: e.target.value }));

  const validate = () => {
    if (!f.name.trim()) return 'Please enter your name.';
    if (!f.phone.trim()) return 'Please enter your phone number.';
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) return 'Please enter a valid email address.';
    if (!ctx.pickupOptional && !f.pickup.trim()) return 'Please enter your pick-up location.';
    if (ctx.dropoffRequired && !f.dropoff.trim()) return 'Please enter your drop-off location.';
    return '';
  };

  const payload = () => ({
    type: ctx.type,
    service: ctx.service,
    name: f.name,
    phone: f.phone,
    email: f.email,
    referral: (referral && referral.code) || '',
    stay: stay || '',
    lines: ctx.lines.map((l) => ({
      type: l.type,
      service: l.service,
      date: l.date || '',
      time: l.time || '',
      guests: String(l.guests || displayGuests),
      pickup: l.pickup || f.pickup,
      dropoff: l.dropoff || f.dropoff,
      day_no: l.day_no != null ? l.day_no : null,
      flight_number: l.flight_number || '',
      flight_datetime: l.flight_datetime || '',
      mode: l.mode || 'standard',
      area: l.area || '',
      duration: l.duration || '',
      extra: l.extra != null ? l.extra : 0,
      return: !!l.return,
    })),
  });

  const submit = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setBusy(true);
    try {
      const d = await submitInquiry(payload());
      if (!d || d.status !== 'saved') throw new Error((d && d.detail) || '');
      if (d.token && !readLocal(KEY.token, '')) {
        writeLocal(KEY.token, d.token);
        if (d.account) setAccount(d.account);
      }
      if (typeof ctx.onSuccess === 'function') ctx.onSuccess();
      setDone(true);
    } catch (e) {
      setError(e.message || 'Sorry, we could not send your booking. Please try again, or reach us on WhatsApp.');
    } finally {
      setBusy(false);
    }
  };

  const waText = () => {
    const lines = ctx.lines
      .map((l) => `- ${l.day_no ? 'Day ' + l.day_no + ' · ' : ''}${l.date || 'TBD'} · ${l.service} · ${l.guests || displayGuests} pax`)
      .join('\n');
    return `Hello, I'd like to book:\nService: ${ctx.service}\nName: ${f.name}\nPhone: ${f.phone}\nEmail: ${f.email}\n${lines}\nPick-up: ${f.pickup || '-'}\nDrop-off: ${f.dropoff || '-'}\nPrice: ${priceText()}`;
  };

  const priceText = () => {
    if (!priced) return '-';
    const s = priced.symbol || '$';
    return s + priced.total.display.toLocaleString(s === 'Rp' ? 'id-ID' : 'en-US');
  };

  const applyRef = async () => {
    const pct = await apply(f.referral);
    setRefMsg(pct ? { ok: true, text: `Referral applied - ${pct}% off!` } : { ok: false, text: 'Code not valid.' });
  };

  return createPortal(
    <div className="modal active" id="booking-modal" onClick={(e) => e.target === e.currentTarget && closeBooking()}>
      <div className="modal__box">
        <button className="modal__close" aria-label="Close" onClick={closeBooking}>&times;</button>
        <img className="modal__logo" src="/assets/images/logo.webp" alt="The Cahyana Logo" width="1005" height="324" />

        {!done ? (
          <div id="modal-form">
            <h3 className="modal__title">Confirm Your Booking</h3>

            <div className="modal__group">
              <label htmlFor="booker-name">Your Name</label>
              <input type="text" id="booker-name" placeholder="Enter your name" value={f.name} onChange={set('name')} />
            </div>
            <div className="modal__group">
              <label htmlFor="booker-phone">Phone Number</label>
              <input type="tel" id="booker-phone" placeholder="e.g. +61 412 345 678" value={f.phone} onChange={set('phone')} />
            </div>
            <div className="modal__group">
              <label htmlFor="booker-email">Email</label>
              <input type="email" id="booker-email" placeholder="you@email.com" value={f.email} onChange={set('email')} />
            </div>
            <div className="modal__group">
              <label htmlFor="pickup">Pick-up Location</label>
              <input type="text" id="pickup" placeholder="Hotel / villa name or area" value={f.pickup} onChange={set('pickup')} />
            </div>
            {ctx.dropoffRequired !== false && (
              <div className="modal__group">
                <label htmlFor="dropoff">Drop-off Location</label>
                <input type="text" id="dropoff" placeholder="Where should we drop you off?" value={f.dropoff} onChange={set('dropoff')} />
              </div>
            )}
            <div className="modal__group">
              <label htmlFor="referral">Referral Code (optional)</label>
              <div className="modal__referral">
                <input type="text" id="referral" placeholder="Enter code" value={f.referral} onChange={set('referral')} />
                <button type="button" onClick={applyRef}>Apply</button>
              </div>
              {refMsg && <small className={`modal__referral-msg ${refMsg.ok ? 'success' : 'error'}`}>{refMsg.text}</small>}
            </div>

            <div className="modal__summary">
              <div className="modal__row"><span>Guests</span><span>{ctx.guests || displayGuests}</span></div>
              <div className="modal__row"><span>Service</span><span>{ctx.service}</span></div>
              <div className="modal__row"><span>Date</span><span>{ctx.date || '-'}</span></div>
              {priced && priced.referral && (
                <div className="modal__row"><span>Referral</span><span>{priced.referral.code} ({priced.referral.pct}%)</span></div>
              )}
              <div className="modal__row"><span>Price</span><span id="sum-price">{priceText()}</span></div>
            </div>

            {ctx.detailLines && ctx.detailLines.length > 0 && (
              <div className={`modal__details${detailsOpen ? ' active' : ''}`}>
                <button type="button" className="modal__details-toggle" onClick={() => setDetailsOpen((v) => !v)}>
                  <span>{ctx.detailsTitle || "What's included"}</span>
                  <span className="modal__details-arrow">&rsaquo;</span>
                </button>
                <ul className="modal__details-list">
                  {ctx.detailLines.map((d, i) => <li key={i}>{d}</li>)}
                </ul>
              </div>
            )}

            <PayChips className="modal__pay" logosClass="modal__pay-logos" chipClass="modal__pay-chip" svgClass="modal__pay-svg" />

            {error && <small className="modal__referral-msg error">{error}</small>}

            <button className="modal__btn" onClick={submit} disabled={busy}>{busy ? 'Sending...' : 'Book Now'}</button>
            <button
              className="modal__btn modal__btn--wa"
              onClick={() => {
                const err = validate();
                if (err) { setError(err); return; }
                window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText())}`, '_blank');
              }}
            >
              Discuss via WhatsApp
            </button>
          </div>
        ) : (
          <div className="modal__success" style={{ display: 'block' }}>
            <div className="modal__success-icon">&#10003;</div>
            <h3 className="modal__title">Booking Received!</h3>
            <p>Thank you. We will email you shortly to confirm your booking.</p>
            <button className="modal__btn" onClick={closeBooking}>Done</button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
