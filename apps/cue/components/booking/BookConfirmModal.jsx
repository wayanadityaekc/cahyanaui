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
const RESEND_SECONDS = 30;

export default function BookConfirmModal() {
  const { ctx, closeBooking } = useBooking();
  const { currency, stay, displayGuests } = useTripPrefs();
  const { referral, apply } = useReferral();
  const { account, setAccount, requestLogin, verifyCode } = useAccount();
  const pricing = usePricing();

  const [f, setF] = useState(EMPTY);
  const [priced, setPriced] = useState(null);
  const [step, setStep] = useState(1);
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
      flightNumber: (only && only.flight_number) || '',
      flightDatetime: (only && only.flight_datetime) || '',
    }));
    setLineDT((ctx.lines || []).map((l) => ({ date: l.date || '', time: l.time || '' })));
    setStep(1);
    setDtErr({});
  }, [ctx, referral]);

  useEffect(() => {
    if (!ctx) return undefined;
    let cancelled = false;
    async function load() {
      try {
        const d = await quote({ lines: ctx.lines, currency, stay, referral: (referral && referral.code) || '' });
        if (!cancelled && d && d.lines) setPriced(d);
      } catch (e) {}
    }
    load();
    return () => { cancelled = true; };
  }, [ctx, currency, stay, referral]);

  useEffect(() => {
    if (!ctx) return;
    setF((v) => ({
      ...v,
      name: v.name || (account && account.name) || '',
      phone: v.phone || (account && account.phone) || '',
      email: v.email || (account && account.email) || '',
      pickup: v.pickup || readLocal(KEY.pickup, ''),
      dropoff: v.dropoff || readLocal(KEY.dropoff, ''),
    }));
  }, [ctx, account]);

  const [payOption, setPayOption] = useState('deposit');
  const [payRail, setPayRail] = useState(DEFAULT_RAIL);
  const [bookingRef, setBookingRef] = useState('');
  const [signinEmail, setSigninEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpMsg, setOtpMsg] = useState('');
  const [otpBusy, setOtpBusy] = useState(false);
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
  const [payOn, setPayOn] = useState(PAY_DEFAULT);
  useEffect(() => { setPayOn(readPayFlag()); }, []);
  const lastCtx = useRef(null);
  useBodyLock(!!ctx);

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
  function setValue(k) {
    return (value) => {
      setF((v) => ({ ...v, [k]: value }));
      setErrors((v) => (v[k] ? { ...v, [k]: undefined } : v));
    };
  }

  const catalog = pricing && pricing.catalog;
  const lines = view.lines || [];
  const singleLine = lines.length === 1 ? lines[0] : null;
  function categoryOfLine({ service, type }) {
    const c = catalog && catalog.items.find((i) => i.name === service);
    return c ? c.category : type || null;
  }
  function isAirportLine({ service }) { return service === AIRPORT_ROUTE; }
  const isAirportRoute = !!singleLine && isAirportLine(singleLine);
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
  function dateOf(l, i) { return (isAirportLine(l) && i === 0 && needsFlight ? (f.flightDatetime || '').slice(0, 10) : lineDateTime(i).date); }
  function timeOf(l, i) { return (isAirportLine(l) && i === 0 && needsFlight ? (f.flightDatetime || '').slice(11, 16) : lineDateTime(i).time); }
  const flightNumberDisplay = needsFlight ? f.flightNumber || singleLine.flight_number || '' : '';

  function validate() {
    const { ok, errors: fieldErrors } = validateWith(
      bookingSchema({
        pickupOptional: !!ctx.pickupOptional,
        dropoffRequired: !!ctx.dropoffRequired,
        needsTime: false,
        needsFlight,
      }),
      f,
    );
    setErrors(fieldErrors);
    const dateErrors = {};
    (ctx.lines || []).forEach((l, i) => {
      if (isAirportLine(l) && i === 0 && needsFlight) return;
      if (!dateOf(l, i)) dateErrors[i] = 'Please pick a date.';
      else if (!timeOf(l, i)) dateErrors[i] = 'Please pick a start time.';
    });
    setDtErr(dateErrors);
    return ok && Object.keys(dateErrors).length === 0;
  }

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
      if (f.pickup) writeLocal(KEY.pickup, f.pickup);
      if (f.dropoff) writeLocal(KEY.dropoff, f.dropoff);
      if (d.token && !readLocal(KEY.token, '')) {
        writeLocal(KEY.token, d.token);
        if (d.account) setAccount(d.account);
      }
      if (!payOn && typeof ctx.onSuccess === 'function') ctx.onSuccess();
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


  function openWhatsApp() {
    if (!validate()) { setError(''); setStep(1); return; }
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText())}`, '_blank');
  }

  const lastStep = payOn ? 3 : 2;
  const STEP_NAMES = payOn ? ['Your details', 'Check', 'Payment'] : ['Your details', 'Check & book'];
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
                <PaymentStep
                  option={payOption}
                  onOption={setPayOption}
                  rail={payRail}
                  onRail={setPayRail}
                  totalIdr={baseTotalIdr(priced)}
                  totalUsd={baseTotalUsd(priced)}
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
              if (ctx && typeof ctx.onSuccess === 'function') ctx.onSuccess();
            }}
          />
        )}
    </ModalPresence>,
    document.body,
  );
}
