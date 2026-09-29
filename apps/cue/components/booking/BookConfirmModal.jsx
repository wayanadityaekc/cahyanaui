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
import { AIRPORT_ROUTE } from '@/content/shared/timeSlots';
import { SHELL_WIDE, BOX_WIDE, CLOSE, LOGO, TITLE, BTN, SUCCESS_ICON, SUCCESS_TEXT } from '@/components/ui/modalClasses';
import PaymentStep from './PaymentStep';
import { readPayFlag, PAY_DEFAULT } from '@/lib/payFlag';
import { DEFAULT_RAIL } from '@/lib/rails';
import { baseTotal, baseTotalIdr, baseTotalUsd, PAY_COPY } from '@/lib/payment';
import { bookingPayload, priceText as quotedPrice, whatsappText } from '@/lib/bookingPayload';
import DetailsStep from './DetailsStep';
import CheckStep from './CheckStep';
import BookActions from './BookActions';
import SigninNote from './SigninNote';
import PaymentScreen from './PaymentScreen';
import { STEPS, stepBar, STEP_LABEL, BACK_LINK } from './bookingModalClasses';
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

  // Booking request for the server (pure builder in lib/bookingPayload.js).
  function payload() {
    return bookingPayload({ ctx, f, referral, payOn, payOption, currency, stay, priced, displayGuests, singleLine, needsFlight, dateOf, timeOf });
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
    return whatsappText({ ctx, f, displayGuests, singleLine, flightNumberDisplay, dateOf, timeOf, price: priceText() });
  }

  function priceText() { return quotedPrice(priced); }

  async function applyRef() {
    const pct = await apply(f.referral);
    setRefMsg(pct ? { ok: true, text: PAY_COPY.referralOk } : { ok: false, text: PAY_COPY.referralBad });
  }


  // WhatsApp fallback: validate first (back to step 1 if something is missing), then open the prefilled chat.
  function openWhatsApp() {
    if (!validate()) { setError(''); setStep(1); return; }
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText())}`, '_blank');
  }

  // Step-count chrome: three steps with payment on, two without.
  const lastStep = payOn ? 3 : 2;
  const STEP_NAMES = payOn ? ['Your details', 'Check', 'Payment'] : ['Your details', 'Check & book'];
  // Sign-in code entry, shown on both success screens when the server emailed a code.
  const signinNote = signinEmail ? (
    <SigninNote
      otpVerified={otpVerified}
      signinEmail={signinEmail}
      otpCode={otpCode}
      setOtpCode={setOtpCode}
      doOtpVerify={doOtpVerify}
      otpMsg={otpMsg}
      otpBusy={otpBusy}
      otpCooldown={otpCooldown}
      resendOtp={resendOtp}
    />
  ) : null;
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
              <DetailsStep
                f={f}
                errors={errors}
                set={set}
                setValue={setValue}
                view={view}
                lines={lines}
                needsFlight={needsFlight}
                isAirportLine={isAirportLine}
                lineDateTime={lineDateTime}
                setDT={setDT}
                categoryOfLine={categoryOfLine}
                dtErr={dtErr}
                onContinue={() => { if (validate()) { setError(''); setStep(2); } }}
              />
            ) : step === 2 ? (
              <CheckStep
                view={view}
                singleLine={singleLine}
                dateOf={dateOf}
                timeOf={timeOf}
                isAirportRoute={isAirportRoute}
                flightNumberDisplay={flightNumberDisplay}
                displayGuests={displayGuests}
                priced={priced}
                detailsOpen={detailsOpen}
                setDetailsOpen={setDetailsOpen}
                f={f}
                price={priceText()}
                payOn={payOn}
                onContinue={() => { setError(''); setStep(3); }}
                error={error}
                busy={busy}
                submit={submit}
                openWhatsApp={openWhatsApp}
                onEdit={() => setStep(1)}
              />
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

                <BookActions error={error} busy={busy} submit={submit} openWhatsApp={openWhatsApp} />
                <button type="button" className={BACK_LINK} onClick={() => setStep(2)}>&lsaquo; Back</button>
              </>
            )}

          </div>
        ) : !payOn ? (
          <div className="text-center">
            <div className={SUCCESS_ICON}>&#10003;</div>
            <h3 className={TITLE}>Booking Received!</h3>
            <p className={SUCCESS_TEXT}>Thank you. We will email you shortly to confirm your booking.</p>
            {signinNote}
            <button className={BTN} onClick={closeBooking}>Done</button>
          </div>
        ) : (
          <PaymentScreen
            paid={paid}
            bookingRef={bookingRef}
            closeBooking={closeBooking}
            signinNote={signinNote}
            payRail={payRail}
            payOption={payOption}
            currency={currency}
            onPaid={() => {
              setPaid(true);
              // Clear the cart on capture, not on the webhook, so a guest whose status poll fails cannot pay twice.
              if (ctx && typeof ctx.onSuccess === 'function') ctx.onSuccess();
            }}
          />
        )}
    </ModalPresence>,
    document.body,
  );
}
