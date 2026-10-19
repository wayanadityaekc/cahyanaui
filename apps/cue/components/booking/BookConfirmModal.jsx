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
import {
  SHELL_WIDE,
  BOX_WIDE,
  CLOSE,
  LOGO,
  TITLE,
  BTN,
  SUCCESS_ICON,
  SUCCESS_TEXT,
} from '@/components/ui/modalClasses';
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

const EMPTY = {
  name: '',
  phone: '',
  email: '',
  pickup: '',
  dropoff: '',
  referral: '',
  time: '',
  flightNumber: '',
  flightDatetime: '',
};
const RESEND_SECONDS = 30;

export default function BookConfirmModal() {
  const { ctx: bookingContext, closeBooking } = useBooking();
  const { currency, stay, displayGuests } = useTripPrefs();
  const { referral, apply } = useReferral();
  const { account, setAccount, requestLogin, verifyCode } = useAccount();
  const pricing = usePricing();

  const [form, setForm] = useState(EMPTY);
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
    if (!bookingContext) {
      setForm(EMPTY);
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
    const only = bookingContext.lines && bookingContext.lines.length === 1 ? bookingContext.lines[0] : null;
    setForm((previousForm) => ({
      ...previousForm,
      referral: (referral && referral.code) || '',
      flightNumber: (only && only.flight_number) || '',
      flightDatetime: (only && only.flight_datetime) || '',
    }));
    setLineDT((bookingContext.lines || []).map((line) => ({ date: line.date || '', time: line.time || '' })));
    setStep(1);
    setDtErr({});
  }, [bookingContext, referral]);

  useEffect(() => {
    if (!bookingContext) return undefined;
    let cancelled = false;
    async function load() {
      try {
        const quoteResult = await quote({
          lines: bookingContext.lines,
          currency,
          stay,
          referral: (referral && referral.code) || '',
        });
        if (!cancelled && quoteResult && quoteResult.lines) setPriced(quoteResult);
      } catch (e) {}
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [bookingContext, currency, stay, referral]);

  useEffect(() => {
    if (!bookingContext) return;
    setForm((previousForm) => ({
      ...previousForm,
      name: previousForm.name || (account && account.name) || '',
      phone: previousForm.phone || (account && account.phone) || '',
      email: previousForm.email || (account && account.email) || '',
      pickup: previousForm.pickup || readLocal(KEY.pickup, ''),
      dropoff: previousForm.dropoff || readLocal(KEY.dropoff, ''),
    }));
  }, [bookingContext, account]);

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
    const cooldownTimer = setInterval(() => setOtpCooldown((secondsLeft) => Math.max(0, secondsLeft - 1)), 1000);
    return () => clearInterval(cooldownTimer);
  }, [otpCooldown]);
  async function doOtpVerify(code) {
    setOtpMsg('');
    setOtpBusy(true);
    const result = await verifyCode(signinEmail, code);
    setOtpBusy(false);
    if (result.ok) {
      setOtpVerified(true);
      setOtpCode('');
      return;
    }
    setOtpCode('');
    setOtpMsg(result.error || 'Sorry, something went wrong. Please try again.');
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
  useEffect(() => {
    setPayOn(readPayFlag());
  }, []);
  const lastCtx = useRef(null);
  useBodyLock(!!bookingContext);

  if (bookingContext) lastCtx.current = bookingContext;
  const view = bookingContext || lastCtx.current;
  if (!mounted || !view) return null;

  function set(fieldName) {
    return (event) => {
      const { value } = event.target;
      setForm((previousForm) => ({ ...previousForm, [fieldName]: value }));
      setErrors((previousErrors) =>
        previousErrors[fieldName] ? { ...previousErrors, [fieldName]: undefined } : previousErrors,
      );
    };
  }
  function setValue(fieldName) {
    return (value) => {
      setForm((previousForm) => ({ ...previousForm, [fieldName]: value }));
      setErrors((previousErrors) =>
        previousErrors[fieldName] ? { ...previousErrors, [fieldName]: undefined } : previousErrors,
      );
    };
  }

  const catalog = pricing && pricing.catalog;
  const lines = view.lines || [];
  const singleLine = lines.length === 1 ? lines[0] : null;
  function categoryOfLine({ service, type }) {
    const catalogItem = catalog && catalog.items.find((item) => item.name === service);
    return catalogItem ? catalogItem.category : type || null;
  }
  function isAirportLine({ service }) {
    return service === AIRPORT_ROUTE;
  }
  const isAirportRoute = !!singleLine && isAirportLine(singleLine);
  const needsFlight = isAirportRoute;
  function lineDateTime(lineIndex) {
    return lineDT[lineIndex] || { date: '', time: '' };
  }
  function setDT(lineIndex, fieldName, fieldValue) {
    setLineDT((prev) => {
      const next = prev.length ? [...prev] : lines.map((line) => ({ date: line.date || '', time: line.time || '' }));
      next[lineIndex] = { ...next[lineIndex], [fieldName]: fieldValue };
      return next;
    });
    setDtErr((prev) => (prev[lineIndex] ? { ...prev, [lineIndex]: undefined } : prev));
  }
  function dateOf(line, lineIndex) {
    return isAirportLine(line) && lineIndex === 0 && needsFlight
      ? (form.flightDatetime || '').slice(0, 10)
      : lineDateTime(lineIndex).date;
  }
  function timeOf(line, lineIndex) {
    return isAirportLine(line) && lineIndex === 0 && needsFlight
      ? (form.flightDatetime || '').slice(11, 16)
      : lineDateTime(lineIndex).time;
  }
  const flightNumberDisplay = needsFlight ? form.flightNumber || singleLine.flight_number || '' : '';

  function validate() {
    const { ok, errors: fieldErrors } = validateWith(
      bookingSchema({
        pickupOptional: !!bookingContext.pickupOptional,
        dropoffRequired: !!bookingContext.dropoffRequired,
        needsTime: false,
        needsFlight,
      }),
      form,
    );
    setErrors(fieldErrors);
    const dateErrors = {};
    (bookingContext.lines || []).forEach((line, index) => {
      if (isAirportLine(line) && index === 0 && needsFlight) return;
      if (!dateOf(line, index)) dateErrors[index] = 'Please pick a date.';
      else if (!timeOf(line, index)) dateErrors[index] = 'Please pick a start time.';
    });
    setDtErr(dateErrors);
    return ok && Object.keys(dateErrors).length === 0;
  }

  function payload() {
    return bookingPayload({
      ctx: bookingContext,
      f: form,
      referral,
      payOn,
      payOption,
      currency,
      stay,
      priced,
      displayGuests,
      singleLine,
      needsFlight,
      dateOf,
      timeOf,
    });
  }
  async function submit() {
    if (!validate()) {
      setError('');
      return;
    }
    setError('');
    setBusy(true);
    try {
      const inquiryResult = await submitInquiry(payload());
      if (!inquiryResult || inquiryResult.status !== 'saved')
        throw new Error((inquiryResult && inquiryResult.detail) || '');
      if (form.pickup) writeLocal(KEY.pickup, form.pickup);
      if (form.dropoff) writeLocal(KEY.dropoff, form.dropoff);
      if (inquiryResult.token && !readLocal(KEY.token, '')) {
        writeLocal(KEY.token, inquiryResult.token);
        if (inquiryResult.account) setAccount(inquiryResult.account);
      }
      if (!payOn && typeof bookingContext.onSuccess === 'function') bookingContext.onSuccess();
      setBookingRef(inquiryResult.ref || '');
      if (inquiryResult.signin_sent && inquiryResult.signin_email) {
        setSigninEmail(inquiryResult.signin_email);
        setOtpCooldown(RESEND_SECONDS);
      } else setSigninEmail('');
      setDone(true);
    } catch (e) {
      setError(e.message || 'Sorry, we could not send your booking. Please try again, or reach us on WhatsApp.');
    } finally {
      setBusy(false);
    }
  }

  function waText() {
    return whatsappText({
      ctx: bookingContext,
      f: form,
      displayGuests,
      singleLine,
      flightNumberDisplay,
      dateOf,
      timeOf,
      price: priceText(),
    });
  }

  function priceText() {
    return quotedPrice(priced);
  }

  async function applyRef() {
    const percent = await apply(form.referral);
    setRefMsg(percent ? { ok: true, text: PAY_COPY.referralOk } : { ok: false, text: PAY_COPY.referralBad });
  }

  function openWhatsApp() {
    if (!validate()) {
      setError('');
      setStep(1);
      return;
    }
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
    <ModalPresence
      open={!!bookingContext}
      onClose={paid ? () => {} : closeBooking}
      label="Booking confirmation"
      box={BOX_WIDE}
      shellClass={SHELL_WIDE}
    >
      {!paid && (
        <button className={CLOSE} aria-label="Close" onClick={closeBooking}>
          &times;
        </button>
      )}
      <img className={LOGO} src="/assets/images/logo.webp" alt="The Cahyana Logo" width="1005" height="324" />

      {!done ? (
        <div id="modal-form">
          <h3 className={TITLE}>Booking Confirmation</h3>
          <div className={STEPS} aria-hidden="true">
            {STEP_NAMES.map((stepName, index) => (
              <span className={stepBar(step >= index + 1)} key={stepName} />
            ))}
          </div>
          <p className={STEP_LABEL}>
            Step {step} of {lastStep} &middot; {STEP_NAMES[step - 1]}
          </p>

          {step === 1 ? (
            <DetailsStep
              f={form}
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
              onContinue={() => {
                if (validate()) {
                  setError('');
                  setStep(2);
                }
              }}
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
              f={form}
              price={priceText()}
              payOn={payOn}
              onContinue={() => {
                setError('');
                setStep(3);
              }}
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
                referral={form.referral}
                onReferral={(referralCode) => setForm((previousForm) => ({ ...previousForm, referral: referralCode }))}
                onApplyReferral={applyRef}
                refMsg={refMsg}
              />

              <BookActions error={error} busy={busy} submit={submit} openWhatsApp={openWhatsApp} />
              <button type="button" className={BACK_LINK} onClick={() => setStep(2)}>
                &lsaquo; Back
              </button>
            </>
          )}
        </div>
      ) : !payOn ? (
        <div className="text-center">
          <div className={SUCCESS_ICON}>&#10003;</div>
          <h3 className={TITLE}>Booking Received!</h3>
          <p className={SUCCESS_TEXT}>Thank you. We will email you shortly to confirm your booking.</p>
          {signinNote}
          <button className={BTN} onClick={closeBooking}>
            Done
          </button>
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
            if (bookingContext && typeof bookingContext.onSuccess === 'function') bookingContext.onSuccess();
          }}
        />
      )}
    </ModalPresence>,
    document.body,
  );
}
