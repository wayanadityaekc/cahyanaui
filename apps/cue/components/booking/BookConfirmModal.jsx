'use client';

import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useBooking } from '@/state/BookingProvider';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import { useReferral } from '@/state/ReferralProvider';
import { useAccount } from '@/state/AccountProvider';
import { usePricing } from '@/state/PricingProvider';
import { quote, submitInquiry } from '@/lib/api';
import { buildBookingSchema } from '@/lib/schemas';
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
import { calculateBaseTotal, calculateBaseTotalIdr, calculateBaseTotalUsd, PAY_COPY } from '@/lib/payment';
import { buildBookingPayload, priceText as quotedPrice, buildWhatsappText } from '@/lib/bookingPayload';
import DetailsStep from './DetailsStep';
import CheckStep from './CheckStep';
import BookActions from './BookActions';
import SigninNote from './SigninNote';
import PaymentScreen from './PaymentScreen';
import { STEPS, stepBar, STEP_LABEL, BACK_LINK } from './bookingModalClasses';
import ModalPresence from '@/components/ui/ModalPresence';
import useBodyLock from '@/components/ui/useBodyLock';

const COOLDOWN_TICK_MS = 1000;
const DATE_STRING_LENGTH = 10;
const TIME_START_INDEX = 11;
const TIME_END_INDEX = 16;
const STEP_COUNT_WITH_PAYMENT = 3;
const PAYMENT_STEP_NUMBER = 3;

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
  const { ctx: bookingContext, closeBooking: handleBookingClose } = useBooking();
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
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    if (!bookingContext) {
      setForm(EMPTY);
      setPriced(null);
      setIsDone(false);
      setSigninEmail('');
      setOtpCode('');
      setOtpMsg('');
      setIsOtpVerified(false);
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
        const hasQuoteLines = !cancelled && quoteResult && quoteResult.lines;
        if (hasQuoteLines) setPriced(quoteResult);
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
  const [isOtpBusy, setIsOtpBusy] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);
  useEffect(() => {
    if (otpCooldown <= 0) return undefined;
    const cooldownTimer = setInterval(
      () => setOtpCooldown((secondsLeft) => Math.max(0, secondsLeft - 1)),
      COOLDOWN_TICK_MS,
    );
    return () => clearInterval(cooldownTimer);
  }, [otpCooldown]);
  async function verifyOtpCode(code) {
    setOtpMsg('');
    setIsOtpBusy(true);
    const result = await verifyCode(signinEmail, code);
    setIsOtpBusy(false);
    if (result.ok) {
      setIsOtpVerified(true);
      setOtpCode('');
      return;
    }
    setOtpCode('');
    setOtpMsg(result.error || 'Sorry, something went wrong. Please try again.');
  }
  async function resendOtpCode() {
    if (otpCooldown > 0 || isOtpBusy) return;
    setIsOtpBusy(true);
    await requestLogin(signinEmail);
    setIsOtpBusy(false);
    setOtpCode('');
    setOtpMsg('');
    setOtpCooldown(RESEND_SECONDS);
  }
  const [isPaid, setIsPaid] = useState(false);
  const [payOn, setPayOn] = useState(PAY_DEFAULT);
  useEffect(() => {
    setPayOn(readPayFlag());
  }, []);
  const lastCtx = useRef(null);
  useBodyLock(!!bookingContext);

  if (bookingContext) lastCtx.current = bookingContext;
  const view = bookingContext || lastCtx.current;
  if (!isMounted || !view) return null;

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
  function findLineCategory({ service, type }) {
    const catalogItem = catalog && catalog.items.find((item) => item.name === service);
    return catalogItem ? catalogItem.category : type || null;
  }
  function isAirportLine({ service }) {
    return service === AIRPORT_ROUTE;
  }
  const isAirportRoute = !!singleLine && isAirportLine(singleLine);
  const needsFlight = isAirportRoute;
  function findLineDateTime(lineIndex) {
    return lineDT[lineIndex] || { date: '', time: '' };
  }
  function setDT(lineIndex, fieldName, fieldValue) {
    setLineDT((prev) => {
      const nextLineTimes = prev.length
        ? [...prev]
        : lines.map((line) => ({ date: line.date || '', time: line.time || '' }));
      nextLineTimes[lineIndex] = { ...nextLineTimes[lineIndex], [fieldName]: fieldValue };
      return nextLineTimes;
    });
    setDtErr((prev) => (prev[lineIndex] ? { ...prev, [lineIndex]: undefined } : prev));
  }
  function findLineDate(line, lineIndex) {
    return isAirportLine(line) && lineIndex === 0 && needsFlight
      ? (form.flightDatetime || '').slice(0, DATE_STRING_LENGTH)
      : findLineDateTime(lineIndex).date;
  }
  function timeOf(line, lineIndex) {
    return isAirportLine(line) && lineIndex === 0 && needsFlight
      ? (form.flightDatetime || '').slice(TIME_START_INDEX, TIME_END_INDEX)
      : findLineDateTime(lineIndex).time;
  }
  const flightNumberDisplay = needsFlight ? form.flightNumber || singleLine.flight_number || '' : '';

  function validate() {
    const { ok, errors: fieldErrors } = validateWith(
      buildBookingSchema({
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
      const isFlightDetailsNeeded = isAirportLine(line) && index === 0 && needsFlight;
      if (isFlightDetailsNeeded) return;
      if (!findLineDate(line, index)) dateErrors[index] = 'Please pick a date.';
      else if (!timeOf(line, index)) dateErrors[index] = 'Please pick a start time.';
    });
    setDtErr(dateErrors);
    return ok && Object.keys(dateErrors).length === 0;
  }

  function buildBookingPayload() {
    return buildBookingPayload({
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
      dateOf: findLineDate,
      timeOf,
    });
  }
  async function submit() {
    if (!validate()) {
      setError('');
      return;
    }
    setError('');
    setIsBusy(true);
    try {
      const inquiryResult = await submitInquiry(buildBookingPayload());
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
      setIsDone(true);
    } catch (e) {
      setError(e.message || 'Sorry, we could not send your booking. Please try again, or reach us on WhatsApp.');
    } finally {
      setIsBusy(false);
    }
  }

  function buildWhatsappText() {
    return buildWhatsappText({
      ctx: bookingContext,
      f: form,
      displayGuests,
      singleLine,
      flightNumberDisplay,
      dateOf: findLineDate,
      timeOf,
      price: priceText(),
    });
  }

  function priceText() {
    return quotedPrice(priced);
  }

  async function handleReferralApply() {
    const percent = await apply(form.referral);
    setRefMsg(percent ? { ok: true, text: PAY_COPY.referralOk } : { ok: false, text: PAY_COPY.referralBad });
  }

  function openWhatsApp() {
    if (!validate()) {
      setError('');
      setStep(1);
      return;
    }
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsappText())}`, '_blank');
  }

  const lastStep = payOn ? STEP_COUNT_WITH_PAYMENT : 2;
  const STEP_NAMES = payOn ? ['Your details', 'Check', 'Payment'] : ['Your details', 'Check & book'];
  const signinNote = signinEmail ? (
    <SigninNote
      otpVerified={isOtpVerified}
      signinEmail={signinEmail}
      otpCode={otpCode}
      setOtpCode={setOtpCode}
      doOtpVerify={verifyOtpCode}
      otpMsg={otpMsg}
      otpBusy={isOtpBusy}
      otpCooldown={otpCooldown}
      resendOtp={resendOtpCode}
    />
  ) : null;
  return createPortal(
    <ModalPresence
      open={!!bookingContext}
      onClose={isPaid ? () => {} : handleBookingClose}
      label="Booking confirmation"
      box={BOX_WIDE}
      shellClass={SHELL_WIDE}
    >
      {!isPaid && (
        <button className={CLOSE} aria-label="Close" onClick={handleBookingClose}>
          &times;
        </button>
      )}
      <img className={LOGO} src="/assets/images/logo.webp" alt="The Cahyana Logo" width="1005" height="324" />

      {!isDone ? (
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
              lineDateTime={findLineDateTime}
              setDT={setDT}
              categoryOfLine={findLineCategory}
              dtErr={dtErr}
              onContinue={() => {
                if (!validate()) return;
                setError('');
                setStep(2);
              }}
            />
          ) : step === 2 ? (
            <CheckStep
              view={view}
              singleLine={singleLine}
              dateOf={findLineDate}
              timeOf={timeOf}
              isAirportRoute={isAirportRoute}
              flightNumberDisplay={flightNumberDisplay}
              displayGuests={displayGuests}
              priced={priced}
              detailsOpen={isDetailsOpen}
              setDetailsOpen={setIsDetailsOpen}
              f={form}
              price={priceText()}
              payOn={payOn}
              onContinue={() => {
                setError('');
                setStep(PAYMENT_STEP_NUMBER);
              }}
              error={error}
              busy={isBusy}
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
                totalIdr={calculateBaseTotalIdr(priced)}
                totalUsd={calculateBaseTotalUsd(priced)}
                total={calculateBaseTotal(priced)}
                symbol={(priced && priced.symbol) || '$'}
                currency={currency || 'USD'}
                stay={stay || ''}
                hasReferral={!!(priced && priced.referral)}
                referral={form.referral}
                onReferral={(referralCode) => setForm((previousForm) => ({ ...previousForm, referral: referralCode }))}
                onApplyReferral={handleReferralApply}
                refMsg={refMsg}
              />

              <BookActions error={error} busy={isBusy} submit={submit} openWhatsApp={openWhatsApp} />
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
          <button className={BTN} onClick={handleBookingClose}>
            Done
          </button>
        </div>
      ) : (
        <PaymentScreen
          paid={isPaid}
          bookingRef={bookingRef}
          closeBooking={handleBookingClose}
          signinNote={signinNote}
          payRail={payRail}
          payOption={payOption}
          currency={currency}
          onPaid={() => {
            setIsPaid(true);
            if (bookingContext && typeof bookingContext.onSuccess === 'function') bookingContext.onSuccess();
          }}
        />
      )}
    </ModalPresence>,
    document.body,
  );
}
