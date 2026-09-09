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
import { withSymbol } from '@/components/Price';
import { SHELL, BOX, CLOSE, LOGO, TITLE, GROUP, LABEL, INPUT, BTN, BTN_WA, STACK, SUCCESS_ICON, SUCCESS_TEXT } from '@/components/ui/modalClasses';
import useBodyLock from '@/components/ui/useBodyLock';

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

  useBodyLock(!!ctx);

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

  // The quote already fetched above is what the guest sees, so send it with the
  // booking. Without it the server stores nothing and the confirmation email
  // reads "$0 / Rp0" - which is what happened to CUE-007.
  const payload = () => ({
    type: ctx.type,
    service: ctx.service,
    name: f.name,
    phone: f.phone,
    email: f.email,
    referral: (referral && referral.code) || '',
    stay: stay || '',
    lines: ctx.lines.map((l, i) => {
      const p = priced && priced.lines && priced.lines[i] && priced.lines[i].ok ? priced.lines[i] : null;
      return {
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
        price_usd: p ? p.price_usd : null,
        price_idr: p ? p.price_idr : null,
      };
    }),
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

  // Tailwind-native (migrasi Fase 2, opsi B): shell/box/close/logo/title/group/input/
  // btn(+wa)/success pakai konstanta shared (modalClasses.js). Bagian yang ISOLATED ke
  // modal ini (referral input-group, summary/row, details accordion, pay chips) di-inline
  // utility + CSS-nya DIHAPUS di commit ini. .modal__referral-msg TETEP CSS (dipakai 6
  // komponen), jadi msg di sini juga di-inline biar CSS-nya bisa dihapus nanti barengan.
  const REFERRAL_INPUT = 'flex-1 px-[0.65rem] py-2 h-[var(--field-h)] [border:1px_solid_#d8d2c4] rounded-sm font-body text-field text-green';
  const REFERRAL_BTN = 'px-[1.1rem] py-0 border-none rounded-sm font-semibold text-cream bg-green cursor-pointer';
  const refMsgCls = (ok) => `block mt-[0.4rem] text-small ${ok ? 'text-ok' : 'text-err'}`;
  const ROW = 'flex justify-between gap-4 py-[0.65rem] [border-bottom:1px_solid_#eee] text-body [&>span:first-child]:font-semibold [&>span:last-child]:text-right [&>span:last-child]:text-gold [&>span:last-child]:font-semibold last:[border-bottom:none]';
  const DETAILS_TOGGLE = 'flex items-center justify-between w-full py-[0.85rem] px-0 font-body text-[1rem] font-semibold text-green bg-transparent border-none cursor-pointer';
  const DETAILS_LI = "relative pt-[0.4rem] pr-0 pb-[0.4rem] pl-5 text-body leading-[var(--lh-body)] text-muted [&::before]:content-['•'] [&::before]:absolute [&::before]:left-[0.25rem] [&::before]:text-gold";
  return createPortal(
    <div className={SHELL} onClick={(e) => e.target === e.currentTarget && closeBooking()}>
      <div className={BOX}>
        <button className={CLOSE} aria-label="Close" onClick={closeBooking}>&times;</button>
        <img className={LOGO} src="/assets/images/logo.webp" alt="The Cahyana Logo" width="1005" height="324" />

        {!done ? (
          <div id="modal-form">
            <h3 className={TITLE}>Confirm Your Booking</h3>

            <div className={GROUP}>
              <label className={LABEL} htmlFor="booker-name">Your Name</label>
              <input className={INPUT} type="text" id="booker-name" placeholder="Enter your name" value={f.name} onChange={set('name')} />
            </div>
            <div className={GROUP}>
              <label className={LABEL} htmlFor="booker-phone">Phone Number</label>
              <input className={INPUT} type="tel" id="booker-phone" placeholder="e.g. +61 412 345 678" value={f.phone} onChange={set('phone')} />
            </div>
            <div className={GROUP}>
              <label className={LABEL} htmlFor="booker-email">Email</label>
              <input className={INPUT} type="email" id="booker-email" placeholder="you@email.com" value={f.email} onChange={set('email')} />
            </div>
            <div className={GROUP}>
              <label className={LABEL} htmlFor="pickup">Pick-up Location</label>
              <input className={INPUT} type="text" id="pickup" placeholder="Hotel / villa name or area" value={f.pickup} onChange={set('pickup')} />
            </div>
            {ctx.dropoffRequired !== false && (
              <div className={GROUP}>
                <label className={LABEL} htmlFor="dropoff">Drop-off Location</label>
                <input className={INPUT} type="text" id="dropoff" placeholder="Where should we drop you off?" value={f.dropoff} onChange={set('dropoff')} />
              </div>
            )}
            <div className={GROUP}>
              <label className={LABEL} htmlFor="referral">Referral Code (optional)</label>
              <div className="flex gap-2">
                <input className={REFERRAL_INPUT} type="text" id="referral" placeholder="Enter code" value={f.referral} onChange={set('referral')} />
                <button className={REFERRAL_BTN} type="button" onClick={applyRef}>Apply</button>
              </div>
              {refMsg && <small className={refMsgCls(refMsg.ok)}>{refMsg.text}</small>}
            </div>

            <div className="my-5 [border-top:1px_solid_#eee]">
              <div className={ROW}><span>Guests</span><span>{ctx.guests || displayGuests}</span></div>
              <div className={ROW}><span>Service</span><span>{ctx.service}</span></div>
              <div className={ROW}><span>Date</span><span>{ctx.date || '-'}</span></div>
              {priced && priced.referral && (
                <div className={ROW}><span>Referral</span><span>{priced.referral.code} ({priced.referral.pct}%)</span></div>
              )}
              <div className={ROW}><span>Price</span><span id="sum-price">{withSymbol(priceText())}</span></div>
            </div>

            {ctx.detailLines && ctx.detailLines.length > 0 && (
              <div className="mb-5 [border-top:1px_solid_#eee]">
                <button type="button" className={DETAILS_TOGGLE} onClick={() => setDetailsOpen((v) => !v)}>
                  <span>{ctx.detailsTitle || "What's included"}</span>
                  <span className={`text-[1.4rem] text-gold transition-transform duration-[var(--dur-slow)] ease-[ease] ${detailsOpen ? '[transform:rotate(90deg)]' : ''}`}>&rsaquo;</span>
                </button>
                <ul className={`list-none overflow-hidden transition-[max-height] duration-[var(--dur-slow)] ease-[ease] ${detailsOpen ? 'max-h-[320px]' : 'max-h-0'}`}>
                  {ctx.detailLines.map((d, i) => <li className={DETAILS_LI} key={i}>{d}</li>)}
                </ul>
              </div>
            )}

            <PayChips
              className="mt-[1.1rem] mb-[1.35rem] text-center"
              logosClass="flex flex-wrap items-center justify-center gap-2"
              chipClass="inline-flex items-center justify-center h-[30px] min-w-[46px] px-[0.55rem] bg-white [border:1px_solid_#e2ddd0] rounded-sm transition-transform duration-[var(--dur)] ease-[var(--ease-out)] hover:[transform:translateY(-2px)]"
              svgClass="block h-[var(--icon-sm)] w-auto"
            />

            {error && <small className="block mt-[0.4rem] text-small text-err">{error}</small>}

            <button className={BTN} onClick={submit} disabled={busy}>{busy ? 'Sending...' : 'Book Now'}</button>
            <button
              className={`${BTN_WA} ${STACK}`}
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
          <div className="text-center">
            <div className={SUCCESS_ICON}>&#10003;</div>
            <h3 className={TITLE}>Booking Received!</h3>
            <p className={SUCCESS_TEXT}>Thank you. We will email you shortly to confirm your booking.</p>
            <button className={BTN} onClick={closeBooking}>Done</button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
