'use client';

import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useBooking } from '@/state/BookingProvider';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import { useReferral } from '@/state/ReferralProvider';
import { useAccount } from '@/state/AccountProvider';
import { usePricing } from '@/state/PricingProvider';
import { quote, submitInquiry } from '@/lib/api';
import { bookingSchema } from '@/lib/schemas';
import { validateWith } from '@/lib/validate';
import { readLocal, writeLocal } from '@/lib/storage';
import { KEY, WHATSAPP_NUMBER } from '@/lib/constants';
import PayChips from './PayChips';
import DateTimeField from '@/components/ui/DateTimeField';
import DateField from '@/components/ui/DateField';
import { AIRPORT_ROUTE, fmtTime, fmtDate } from '@/content/shared/timeSlots';
import { withSymbol } from '@/components/Price';
import { SHELL_WIDE, BOX_WIDE, CLOSE, LOGO, TITLE, GROUP, LABEL, INPUT, BTN, BTN_WA, STACK, FIELD_ERR, SUCCESS_ICON, SUCCESS_TEXT, REFMSG_ERR } from '@/components/ui/modalClasses';
import OtpFields from '@/components/account/OtpFields';
import PaymentStep from './PaymentStep';
import { readPayFlag, PAY_DEFAULT } from '@/lib/payFlag';
import { railFor, DEFAULT_RAIL } from '@/lib/rails';
import { baseTotal, baseTotalIdr, baseTotalUsd, PAY_COPY } from '@/lib/payment';
import PayPalCheckout from './PayPalCheckout';
import DokuCheckout from './DokuCheckout';
import PayWaiting from './PayWaiting';
import ModalPresence from '@/components/ui/ModalPresence';
import useBodyLock from '@/components/ui/useBodyLock';

const EMPTY = { name: '', phone: '', email: '', pickup: '', dropoff: '', referral: '', time: '', flightNumber: '', flightDatetime: '' };
// Seconds before the sign-in code can be resent; same cooldown as AuthModal.
const RESEND_SECONDS = 30;

export default function BookConfirmModal() {
  const { ctx, closeBooking } = useBooking();
  const { currency, stay, displayGuests } = useTripPrefs();
  const { referral, apply } = useReferral();
  const { account, setAccount, requestLogin, verifyCode } = useAccount();
  const pricing = usePricing();

  const [f, setF] = useState(EMPTY);
  const [priced, setPriced] = useState(null);
  // Current step: 1 = details, 2 = check, 3 = payment (only when payment is on).
  const [step, setStep] = useState(1);
  // Date and time held PER LINE (a start time belongs to an item), seeded from each line and editable here.
  const [lineDT, setLineDT] = useState([]);
  const [dtErr, setDtErr] = useState({});
  const [refMsg, setRefMsg] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [errors, setErrors] = useState({});
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
      setSigninEmail('');
      setOtpCode('');
      setOtpMsg('');
      setOtpVerified(false);
      setOtpCooldown(0);
      setStep(1);
      setLineDT([]);
      setDtErr({});
      setErrors({});
      setError('');
      setRefMsg(null);
      return;
    }
    const only = ctx.lines && ctx.lines.length === 1 ? ctx.lines[0] : null;
    setF((v) => ({
      ...v,
      referral: (referral && referral.code) || '',
      // Autofill, both of them: the airport form already asked for these.
      flightNumber: (only && only.flight_number) || '',
      flightDatetime: (only && only.flight_datetime) || '',
    }));
    setLineDT((ctx.lines || []).map((l) => ({ date: l.date || '', time: l.time || '' })));
    setStep(1);
    setDtErr({});
  }, [ctx, referral]);

  // Quote fetch is kept separate from the reset effect: a currency change must reprice, not send the guest back to step 1.
  useEffect(() => {
    if (!ctx) return undefined;
    let cancelled = false;
    // price the lines in the popup
    async function load() {
      try {
        const d = await quote({ lines: ctx.lines, currency, stay, referral: (referral && referral.code) || '' });
        if (!cancelled && d && d.lines) setPriced(d);
      } catch (e) {}
    }
    load();
    return () => { cancelled = true; };
  }, [ctx, currency, stay, referral]);

  // Autofill contact fields from the account, only where still empty (account loads after mount, so never overwrite).
  useEffect(() => {
    if (!ctx) return;
    setF((v) => ({
      ...v,
      name: v.name || (account && account.name) || '',
      phone: v.phone || (account && account.phone) || '',
      email: v.email || (account && account.email) || '',
      // Addresses are not on the account, so they come from this device.
      pickup: v.pickup || readLocal(KEY.pickup, ''),
      dropoff: v.dropoff || readLocal(KEY.dropoff, ''),
    }));
  }, [ctx, account]);

  // Payment option the guest picked; only the choice is sent (pay_option), the server computes the amount.
  const [payOption, setPayOption] = useState('deposit');
  // Payment rail: Card (DOKU) by default, PayPal if chosen; the server never swaps the chosen rail.
  const [payRail, setPayRail] = useState(DEFAULT_RAIL);
  // Booking ref once saved; the booking exists from here whether or not payment succeeds.
  const [bookingRef, setBookingRef] = useState('');
  // Existing-account email: the server sends that inbox a 6-digit code instead of a login, entered here.
  const [signinEmail, setSigninEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpMsg, setOtpMsg] = useState('');
  const [otpBusy, setOtpBusy] = useState(false);
  // Code entry only signs the guest in; the booking is already saved and does not depend on it.
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);
  useEffect(() => {
    if (otpCooldown <= 0) return undefined;
    const t = setInterval(() => setOtpCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [otpCooldown]);
  async function doOtpVerify(code) {
    setOtpMsg('');
    setOtpBusy(true);
    const res = await verifyCode(signinEmail, code);
    setOtpBusy(false);
    if (res.ok) { setOtpVerified(true); setOtpCode(''); return; }
    setOtpCode('');
    setOtpMsg(res.error || 'Sorry, something went wrong. Please try again.');
  }
  async function resendOtp() {
    if (otpCooldown > 0 || otpBusy) return;
    setOtpBusy(true);
    await requestLogin(signinEmail);
    setOtpBusy(false);
    setOtpCode('');
    setOtpMsg('');
    setOtpCooldown(RESEND_SECONDS);
  }
  const [paid, setPaid] = useState(false);
  // Online payment on/off (lib/payFlag.js); read in an effect, not initial state, so first paint matches the static HTML.
  const [payOn, setPayOn] = useState(PAY_DEFAULT);
  useEffect(() => { setPayOn(readPayFlag()); }, []);
  const lastCtx = useRef(null);
  useBodyLock(!!ctx);

  // While closing, markup reads the last ctx for the exit animation; anything that ACTS must still read the live ctx.
  if (ctx) lastCtx.current = ctx;
  const view = ctx || lastCtx.current;
  if (!mounted || !view) return null;

  function set(k) {
    return (e) => {
      const { value } = e.target;
      setF((v) => ({ ...v, [k]: value }));
      setErrors((v) => (v[k] ? { ...v, [k]: undefined } : v));
    };
  }
  // Custom controls (Select / DateTimeField) hand back a value, not an event.
  function setValue(k) {
    return (value) => {
      setF((v) => ({ ...v, [k]: value }));
      setErrors((v) => (v[k] ? { ...v, [k]: undefined } : v));
    };
  }

  // Every line carries its own date and time, edited per line in step 1; there is no separate pickup-time field.
  const catalog = pricing && pricing.catalog;
  const lines = view.lines || [];
  const singleLine = lines.length === 1 ? lines[0] : null;
  // Start-time category comes from the pricing catalog, not line.type (cart and detail pages send 'tour' for everything).
  function categoryOfLine({ service, type }) {
    const c = catalog && catalog.items.find((i) => i.name === service);
    return c ? c.category : type || null;
  }
  function isAirportLine({ service }) { return service === AIRPORT_ROUTE; }
  const isAirportRoute = !!singleLine && isAirportLine(singleLine);
  // The airport leg gets no second date control: its flight date/time is the pick-up time, with real minutes.
  const needsFlight = isAirportRoute;
  function lineDateTime(i) { return lineDT[i] || { date: '', time: '' }; }
  function setDT(i, k, v) {
    setLineDT((prev) => {
      const next = prev.length ? [...prev] : lines.map((l) => ({ date: l.date || '', time: l.time || '' }));
      next[i] = { ...next[i], [k]: v };
      return next;
    });
    setDtErr((prev) => (prev[i] ? { ...prev, [i]: undefined } : prev));
  }
  // Date/time each line carries: the airport leg reads the flight field, others their own date control.
  function dateOf(l, i) { return (isAirportLine(l) && i === 0 && needsFlight ? (f.flightDatetime || '').slice(0, 10) : lineDateTime(i).date); }
  function timeOf(l, i) { return (isAirportLine(l) && i === 0 && needsFlight ? (f.flightDatetime || '').slice(11, 16) : lineDateTime(i).time); }
  const flightNumberDisplay = needsFlight ? f.flightNumber || singleLine.flight_number || '' : '';

  // Schema built per render from the same flags that show the fields; Book Now and WhatsApp both run this.
  function validate() {
    const { ok, errors: fieldErrors } = validateWith(
      bookingSchema({
        pickupOptional: !!ctx.pickupOptional,
        dropoffRequired: !!ctx.dropoffRequired,
        // Time is not a schema field; it is validated per line below.
        needsTime: false,
        needsFlight,
      }),
      f,
    );
    setErrors(fieldErrors);
    // Per-line date and time check (the schema can only hold one time field).
    const dateErrors = {};
    (ctx.lines || []).forEach((l, i) => {
      if (isAirportLine(l) && i === 0 && needsFlight) return; // covered by the flight field
      if (!dateOf(l, i)) dateErrors[i] = 'Please pick a date.';
      else if (!timeOf(l, i)) dateErrors[i] = 'Please pick a start time.';
    });
    setDtErr(dateErrors);
    return ok && Object.keys(dateErrors).length === 0;
  }

  // Send the fetched quote with the booking, or the server stores nothing and the email shows $0.
  function payload() {
    return ({
      type: ctx.type,
      service: ctx.service,
      name: f.name,
      phone: f.phone,
      email: f.email,
      referral: (referral && referral.code) || '',
      // Only the option the guest picked; the server never trusts an amount from the browser.
      pay_option: payOn ? payOption : '',
      // Quoted currency, so the server invoices the same number the guest agreed to.
      currency: currency || 'USD',
      stay: stay || '',
      lines: ctx.lines.map((l, i) => {
        const p = priced && priced.lines && priced.lines[i] && priced.lines[i].ok ? priced.lines[i] : null;
        // Each line sends its own date/time (falling back to what it arrived with); flight fields only for a single airport line.
        const isTarget = !!singleLine && i === 0;
        return {
          type: l.type,
          service: l.service,
          date: dateOf(l, i) || l.date || '',
          time: timeOf(l, i) || l.time || '',
          guests: String(l.guests || displayGuests),
          pickup: l.pickup || f.pickup,
          dropoff: l.dropoff || f.dropoff,
          day_no: l.day_no != null ? l.day_no : null,
          flight_number: (isTarget && needsFlight ? f.flightNumber || l.flight_number : l.flight_number) || '',
          flight_datetime: (isTarget && needsFlight ? f.flightDatetime || l.flight_datetime : l.flight_datetime) || '',
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
  }

  async function submit() {
    if (!validate()) { setError(''); return; }
    setError('');
    setBusy(true);
    try {
      const d = await submitInquiry(payload());
      if (!d || d.status !== 'saved') throw new Error((d && d.detail) || '');
      // Remember the addresses so the next booking on this device starts filled in.
      if (f.pickup) writeLocal(KEY.pickup, f.pickup);
      if (f.dropoff) writeLocal(KEY.dropoff, f.dropoff);
      if (d.token && !readLocal(KEY.token, '')) {
        writeLocal(KEY.token, d.token);
        if (d.account) setAccount(d.account);
      }
      // Clear the cart only when nothing is paid online; with payment on it clears in onPaid, not while still pending.
      if (!payOn && typeof ctx.onSuccess === 'function') ctx.onSuccess();
      // With payment on the booking is saved pending (confirmed only by the provider webhook), so show the payment step.
      setBookingRef(d.ref || '');
      if (d.signin_sent && d.signin_email) { setSigninEmail(d.signin_email); setOtpCooldown(RESEND_SECONDS); }
      else setSigninEmail('');
      setDone(true);
    } catch (e) {
      setError(e.message || 'Sorry, we could not send your booking. Please try again, or reach us on WhatsApp.');
    } finally {
      setBusy(false);
    }
  }

  function waText() {
    const rowText = ctx.lines
      .map((l, i) => {
        const d = dateOf(l, i) || l.date || 'TBD';
        const t = timeOf(l, i);
        return `- ${l.day_no ? `Day ${l.day_no} · ` : ''}${d}${t ? ` · ${fmtTime(t)}` : ''} · ${l.service} · ${l.guests || displayGuests} pax`;
      })
      .join('\n');
    const flightLine = flightNumberDisplay ? `\nFlight: ${flightNumberDisplay} (${f.flightDatetime || singleLine.flight_datetime || 'TBD'})` : '';
    return `Hello, I'd like to book:\nService: ${ctx.service}\nName: ${f.name}\nPhone: ${f.phone}\nEmail: ${f.email}\n${rowText}\nPick-up: ${f.pickup || '-'}\nDrop-off: ${f.dropoff || '-'}${flightLine}\nPrice: ${priceText()}`;
  }

  function priceText() {
    if (!priced) return '-';
    const s = priced.symbol || '$';
    return s + priced.total.display.toLocaleString(s === 'Rp' ? 'id-ID' : 'en-US');
  }

  async function applyRef() {
    const pct = await apply(f.referral);
    setRefMsg(pct ? { ok: true, text: PAY_COPY.referralOk } : { ok: false, text: PAY_COPY.referralBad });
  }

  // Shared chrome comes from modalClasses.js; strings used only by this modal are defined inline below.
  const ROW = 'flex justify-between gap-4 py-[0.65rem] [border-bottom:1px_solid_var(--line)] text-body [&>span:first-child]:font-semibold [&>span:last-child]:text-right [&>span:last-child]:text-gold [&>span:last-child]:font-semibold last:[border-bottom:none]';
  // Two-step chrome. Isolated to this modal, same as ROW below.
  const lastStep = payOn ? 3 : 2;
  const STEP_NAMES = payOn ? ['Your details', 'Check', 'Payment'] : ['Your details', 'Check & book'];
  const STEPS = 'flex gap-[6px] mb-2';
  function stepBar(active) { return `flex-1 h-[3px] rounded-[2px] ${active ? 'bg-cta' : 'bg-line'}`; }
  const STEP_LABEL = 'mb-[0.9rem] text-center text-label font-medium tracking-[0.1em] uppercase text-muted';
  const GROUP_LABEL = 'mb-[0.4rem] text-label font-medium tracking-[0.12em] uppercase text-muted';
  const ROWSET = 'mb-4 [border-top:1px_solid_var(--line)]';
  // Total gets its own bar on the check screen: it is the number the guest agrees to.
  const PBAR = 'flex items-center justify-between gap-[10px] py-[10px] px-3 rounded-md bg-cream [border:1px_solid_var(--line)]';
  const PBAR_L = 'text-body font-medium text-green';
  const PBAR_V = 'text-[1.15rem] font-semibold text-amber';
  const BACK_LINK = 'block w-full pt-[10px] text-center text-body font-medium text-green bg-transparent border-none cursor-pointer';
  const HINT = 'block mt-[0.35rem] text-small text-muted';
  const DETAILS_LI_ROW = "relative py-[0.5rem] pr-0 pl-[1.1rem] [border-bottom:1px_solid_var(--line)] text-body leading-[var(--lh-body)] text-muted [&::before]:content-['•'] [&::before]:absolute [&::before]:left-[0.15rem] [&::before]:text-gold last:[border-bottom:none]";
  const DETAILS_TOGGLE = 'flex items-center justify-between w-full py-[0.85rem] px-0 font-body text-[1rem] font-semibold text-green bg-transparent border-none cursor-pointer';
  const DETAILS_LI = "relative pt-[0.4rem] pr-0 pb-[0.4rem] pl-5 text-body leading-[var(--lh-body)] text-muted [&::before]:content-['•'] [&::before]:absolute [&::before]:left-[0.25rem] [&::before]:text-gold";
  // Sign-in code entry shown on both success screens; the booking is already saved either way.
  function signinNote() {
    return (
      <div data-signin-note className="-mt-3 mb-6">
        {otpVerified ? (
          <p className="text-small text-muted leading-[var(--lh-body)]">
            Signed in as <strong className="text-green">{signinEmail}</strong>.
          </p>
        ) : (
          <>
            <p className="mb-3 text-small text-muted leading-[var(--lh-body)] text-center">
              You booked as <strong className="text-green">{signinEmail}</strong>. Enter the
              6-digit code we sent that inbox to sign in.
            </p>
            <OtpFields
              length={6}
              value={otpCode}
              onChange={setOtpCode}
              onComplete={doOtpVerify}
              error={!!otpMsg}
              disabled={otpBusy}
            />
            {otpMsg && <small role="alert" className={`${REFMSG_ERR} text-center mt-3`}>{otpMsg}</small>}
            <p className="mt-3 text-center text-small text-muted">
              {otpCooldown > 0 ? `Resend code in ${otpCooldown}s` : (
                <button type="button" className="bg-transparent border-none p-0 cursor-pointer font-body text-small text-gold font-semibold underline hover:text-gold-d" onClick={resendOtp}>Resend code</button>
              )}
            </p>
          </>
        )}
      </div>
    );
  }
  return createPortal(
    <ModalPresence open={!!ctx} onClose={paid ? () => {} : closeBooking} label="Booking confirmation" box={BOX_WIDE} shellClass={SHELL_WIDE}>
        {!paid && <button className={CLOSE} aria-label="Close" onClick={closeBooking}>&times;</button>}
        <img className={LOGO} src="/assets/images/logo.webp" alt="The Cahyana Logo" width="1005" height="324" />

        {!done ? (
          <div id="modal-form">
            <h3 className={TITLE}>Booking Confirmation</h3>
            <div className={STEPS} aria-hidden="true">
              {STEP_NAMES.map((n, i) => <span className={stepBar(step >= i + 1)} key={n} />)}
            </div>
            <p className={STEP_LABEL}>
              Step {step} of {lastStep} &middot; {STEP_NAMES[step - 1]}
            </p>

            {step === 1 ? (
              <>
                <div className={GROUP}>
                  <label className={LABEL} htmlFor="booker-name">Your Name</label>
                  <input className={INPUT} type="text" id="booker-name" placeholder="Enter your name" value={f.name} onChange={set('name')} aria-invalid={!!errors.name} />
                  {errors.name && <small role="alert" className={FIELD_ERR}>{errors.name}</small>}
                </div>
                <div className={GROUP}>
                  <label className={LABEL} htmlFor="booker-phone">Phone Number</label>
                  <input className={INPUT} type="tel" id="booker-phone" placeholder="e.g. +61 412 345 678" value={f.phone} onChange={set('phone')} aria-invalid={!!errors.phone} />
                  {errors.phone && <small role="alert" className={FIELD_ERR}>{errors.phone}</small>}
                </div>
                <div className={GROUP}>
                  <label className={LABEL} htmlFor="booker-email">Email</label>
                  <input className={INPUT} type="email" id="booker-email" placeholder="you@email.com" value={f.email} onChange={set('email')} aria-invalid={!!errors.email} />
                  {errors.email && <small role="alert" className={FIELD_ERR}>{errors.email}</small>}
                </div>
                <div className={GROUP}>
                  <label className={LABEL} htmlFor="pickup">Pick-up Location</label>
                  <input className={INPUT} type="text" id="pickup" placeholder="Hotel / villa name or area" value={f.pickup} onChange={set('pickup')} aria-invalid={!!errors.pickup} />
                  {errors.pickup && <small role="alert" className={FIELD_ERR}>{errors.pickup}</small>}
                </div>
                {view.dropoffRequired !== false && (
                  <div className={GROUP}>
                    <label className={LABEL} htmlFor="dropoff">Drop-off Location</label>
                    <input className={INPUT} type="text" id="dropoff" placeholder="Where should we drop you off?" value={f.dropoff} onChange={set('dropoff')} aria-invalid={!!errors.dropoff} />
                    {errors.dropoff && <small role="alert" className={FIELD_ERR}>{errors.dropoff}</small>}
                  </div>
                )}
                {needsFlight && (
                  <div className={GROUP}>
                    <label className={LABEL} htmlFor="flight-number">Flight Number</label>
                    <input className={INPUT} type="text" id="flight-number" placeholder="e.g. QZ7501" value={f.flightNumber} onChange={set('flightNumber')} aria-invalid={!!errors.flightNumber} />
                    {errors.flightNumber && <small role="alert" className={FIELD_ERR}>{errors.flightNumber}</small>}
                  </div>
                )}

                {lines.map((l, i) =>
                  isAirportLine(l) && i === 0 && needsFlight ? (
                    // Airport leg: one flight date/time control with real minutes; do not add a second date field here.
                    <div className={GROUP} key={`dt${i}`}>
                      <label className={LABEL} htmlFor="flight-datetime">Flight date &amp; time</label>
                      <DateTimeField id="flight-datetime" label="Flight date & time" value={f.flightDatetime} onChange={setValue('flightDatetime')} />
                      <small className={HINT}>We use this as your pick-up time, so you are collected for this flight.</small>
                      {errors.flightDatetime && <small role="alert" className={FIELD_ERR}>{errors.flightDatetime}</small>}
                    </div>
                  ) : (
                    <div className={GROUP} key={`dt${i}`}>
                      <label className={LABEL} htmlFor={`bk-dt-${i}`}>
                        {lines.length > 1 ? `${l.day_no ? `Day ${l.day_no} · ` : ''}${l.service}` : 'Date & time'}
                      </label>
                      <DateField
                        id={`bk-dt-${i}`}
                        label="Date & time"
                        value={lineDateTime(i).date}
                        onChange={(v) => setDT(i, 'date', v)}
                        placeholder="Select date"
                        withTime
                        time={lineDateTime(i).time}
                        onTimeChange={(v) => setDT(i, 'time', v)}
                        category={categoryOfLine(l)}
                        itemName={l.service}
                      />
                      {dtErr[i] && <small role="alert" className={FIELD_ERR}>{dtErr[i]}</small>}
                    </div>
                  ),
                )}

                <button className={BTN} onClick={() => { if (validate()) { setError(''); setStep(2); } }}>Continue</button>
              </>
            ) : step === 2 ? (
              <>
                <p className={GROUP_LABEL}>Your trip</p>
                <div className={ROWSET}>
                  <div className={ROW}><span>Service</span><span>{view.service}</span></div>
                  {singleLine ? (
                    <>
                      <div className={ROW}><span>Date</span><span>{fmtDate(dateOf(singleLine, 0)) || '-'}</span></div>
                      {isAirportRoute ? (
                        <div className={ROW}><span>Flight</span><span>{flightNumberDisplay || '-'}{timeOf(singleLine, 0) ? ` · ${fmtTime(timeOf(singleLine, 0))}` : ''}</span></div>
                      ) : (
                        <div className={ROW}><span>Time</span><span>{timeOf(singleLine, 0) ? fmtTime(timeOf(singleLine, 0)) : '-'}</span></div>
                      )}
                    </>
                  ) : null}
                  <div className={ROW}><span>Guests</span><span>{view.guests || displayGuests}</span></div>
                  {priced && priced.referral && (
                    <div className={ROW}><span>Referral</span><span>{priced.referral.code} ({priced.referral.pct}%)</span></div>
                  )}
                </div>

                {view.detailLines && view.detailLines.length > 0 && (
                  <>
                    <p className={GROUP_LABEL}>{view.detailsTitle || "What's included"}</p>
                    {/* Item list is open by default; above 4 rows it folds behind a toggle to avoid scrolling on small phones. */}
                    {view.detailLines.length > 4 ? (
                      <div className="mb-4">
                        <button type="button" className={DETAILS_TOGGLE} onClick={() => setDetailsOpen((v) => !v)}>
                          <span>{view.detailLines.length} items</span>
                          <span className={`text-[1.4rem] text-gold transition-transform duration-[var(--dur-slow)] ease-[ease] ${detailsOpen ? '[transform:rotate(90deg)]' : ''}`}>&rsaquo;</span>
                        </button>
                        <ul className={`list-none overflow-hidden transition-[max-height] duration-[var(--dur-slow)] ease-[ease] ${detailsOpen ? 'max-h-[320px]' : 'max-h-0'}`}>
                          {view.detailLines.map((d, i) => <li className={DETAILS_LI} key={i}>{d}</li>)}
                        </ul>
                      </div>
                    ) : (
                      <ul className={`${ROWSET} list-none`}>
                        {view.detailLines.map((d, i) => <li className={DETAILS_LI_ROW} key={i}>{d}</li>)}
                      </ul>
                    )}
                  </>
                )}

                <p className={GROUP_LABEL}>You</p>
                <div className={ROWSET}>
                  <div className={ROW}><span>Name</span><span>{f.name}</span></div>
                  <div className={ROW}><span>Phone</span><span>{f.phone}</span></div>
                  <div className={ROW}><span>Email</span><span>{f.email}</span></div>
                  {f.pickup && <div className={ROW}><span>Pick-up</span><span>{f.pickup}</span></div>}
                  {f.dropoff && <div className={ROW}><span>Drop-off</span><span>{f.dropoff}</span></div>}
                </div>

                <div className={PBAR}>
                  <span className={PBAR_L}>Total</span>
                  <span className={PBAR_V} id="sum-price">{withSymbol(priceText())}</span>
                </div>

                {payOn && (
                  <button className={`${BTN} ${STACK}`} onClick={() => { setError(''); setStep(3); }}>Continue</button>
                )}

                {!payOn && (
                  <>
                <PayChips
                  className="mt-[1.1rem] mb-[1.35rem] text-center"
                  logosClass="flex flex-wrap items-center justify-center gap-2"
                  chipClass="inline-flex items-center justify-center h-[30px] min-w-[46px] px-[0.55rem] bg-white [border:1px_solid_var(--line)] rounded-sm transition-transform duration-[var(--dur)] ease-[var(--ease-out)] hover:[transform:translateY(-2px)]"
                  svgClass="block h-[var(--icon-sm)] w-auto"
                />

                {error && <small className="block mt-[0.4rem] text-small text-err">{error}</small>}

                <button className={BTN} onClick={submit} disabled={busy}>{busy ? 'Sending...' : 'Book Now'}</button>
                <button
                  className={`${BTN_WA} ${STACK}`}
                  onClick={() => {
                    if (!validate()) { setError(''); setStep(1); return; }
                    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText())}`, '_blank');
                  }}
                >
                  Discuss via WhatsApp
                </button>
                  </>
                )}
                {/* Edit details goes last as a text link, so Book Now stays the one primary action. */}
                <button type="button" className={BACK_LINK} onClick={() => setStep(1)}>&lsaquo; Edit details</button>
              </>
            ) : (
              <>
                {/* Step 3: choose how much of the agreed total to pay now; each option shows its own amount. */}
                <PaymentStep
                  option={payOption}
                  onOption={setPayOption}
                  rail={payRail}
                  onRail={setPayRail}
                  totalIdr={baseTotalIdr(priced)}
                  totalUsd={baseTotalUsd(priced)}
                  // baseTotal, not priced.total: the quote already applies the referral discount, which is its own option here.
                  total={baseTotal(priced)}
                  symbol={(priced && priced.symbol) || '$'}
                  currency={currency || 'USD'}
                  stay={stay || ''}
                  hasReferral={!!(priced && priced.referral)}
                  referral={f.referral}
                  onReferral={(v) => setF((x) => ({ ...x, referral: v }))}
                  onApplyReferral={applyRef}
                  refMsg={refMsg}
                />

                <PayChips
                  className="mt-[1.1rem] mb-[1.35rem] text-center"
                  logosClass="flex flex-wrap items-center justify-center gap-2"
                  chipClass="inline-flex items-center justify-center h-[30px] min-w-[46px] px-[0.55rem] bg-white [border:1px_solid_var(--line)] rounded-sm transition-transform duration-[var(--dur)] ease-[var(--ease-out)] hover:[transform:translateY(-2px)]"
                  svgClass="block h-[var(--icon-sm)] w-auto"
                />

                {error && <small className="block mt-[0.4rem] text-small text-err">{error}</small>}

                <button className={BTN} onClick={submit} disabled={busy}>{busy ? 'Sending...' : 'Book Now'}</button>
                <button
                  className={`${BTN_WA} ${STACK}`}
                  onClick={() => {
                    if (!validate()) { setError(''); setStep(1); return; }
                    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText())}`, '_blank');
                  }}
                >
                  Discuss via WhatsApp
                </button>
                <button type="button" className={BACK_LINK} onClick={() => setStep(2)}>&lsaquo; Back</button>
              </>
            )}

          </div>
        ) : !payOn ? (
          <div className="text-center">
            <div className={SUCCESS_ICON}>&#10003;</div>
            <h3 className={TITLE}>Booking Received!</h3>
            <p className={SUCCESS_TEXT}>Thank you. We will email you shortly to confirm your booking.</p>
            {signinEmail ? signinNote() : null}
            <button className={BTN} onClick={closeBooking}>Done</button>
          </div>
        ) : (
          <div>
            {paid ? (
              // Card charged but not yet confirmed: lock the screen and poll the server until the webhook marks it paid.
              <PayWaiting
                bookingRef={bookingRef}
                onClose={closeBooking}
              />
            ) : (
              <>
                <h3 className={TITLE}>Almost there - just the payment</h3>
                <p className={SUCCESS_TEXT}>
                  Your booking is saved{bookingRef ? ` (${bookingRef})` : ''}. It is confirmed once this payment
                  goes through. Nothing is lost if you close this - you can pay later.
                </p>
                {signinEmail ? signinNote() : null}
                {bookingRef && railFor(payRail) === 'doku' ? (
                  // DOKU is hosted, so no onPaid: do not clear the cart on the way out; My Trips checks status on return.
                  <DokuCheckout
                    bookingRef={bookingRef}
                    option={payOption}
                  />
                ) : bookingRef ? (
                  <PayPalCheckout
                    bookingRef={bookingRef}
                    option={payOption}
                    copy={PAY_COPY}
                    currency={currency}
                    onPaid={() => {
                      setPaid(true);
                      // Clear the cart on capture, not on the webhook, so a guest whose status poll fails cannot pay twice.
                      if (ctx && typeof ctx.onSuccess === 'function') ctx.onSuccess();
                    }}
                  />
                ) : (
                  <p className="text-small text-err">We could not read your booking reference. Please contact us.</p>
                )}
              </>
            )}
          </div>
        )}
    </ModalPresence>,
    document.body,
  );
}
