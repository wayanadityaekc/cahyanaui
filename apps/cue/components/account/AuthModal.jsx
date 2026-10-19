'use client';

import { useEffect, useState } from 'react';
import Modal from '@/components/ui/Modal';
import { createAccountSchema, signInSchema } from '@/lib/schemas';
import { validateWith } from '@/lib/validate';
import { BTN, FIELD_ERR, REFMSG, REFMSG_ERR } from '@/components/ui/modalClasses';
import { CONTACT_GROUP, CONTACT_INPUT } from '@/components/ui/contactFieldClasses';
import { FIELD_LABEL } from '@/components/ui/formClasses';
import { useAccount } from '@/state/AccountProvider';
import OtpFields from './OtpFields';

const COOLDOWN_TICK_MS = 1000;
const OTP_CODE_LENGTH = 6;

const RESEND_SECONDS = 30;

export default function AuthModal({ open, onClose, reason, onSignedIn }) {
  const isForBooking = reason === 'book';
  const { requestLogin, verifyCode, createAccount } = useAccount();
  const [view, setView] = useState('signin');
  const [stage, setStage] = useState('email');
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [codeEmail, setCodeEmail] = useState('');
  const [code, setCode] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [ok, setOk] = useState('');
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const cooldownTimer = setInterval(
      () => setCooldown((secondsLeft) => Math.max(0, secondsLeft - 1)),
      COOLDOWN_TICK_MS,
    );
    return () => clearInterval(cooldownTimer);
  }, [cooldown]);

  function set(fieldName) {
    return (event) => {
      const { value } = event.target;
      setForm((previousForm) => ({ ...previousForm, [fieldName]: value }));
      setErrors((previousErrors) =>
        previousErrors[fieldName] ? { ...previousErrors, [fieldName]: undefined } : previousErrors,
      );
    };
  }
  function reset() {
    setMessage('');
    setOk('');
    setErrors({});
  }
  function handleClose() {
    reset();
    setForm({ name: '', email: '', phone: '' });
    setStage('email');
    setCode('');
    onClose();
  }

  async function sendCode(email) {
    setIsBusy(true);
    const sent = await requestLogin(email);
    setIsBusy(false);
    if (!sent) {
      setMessage('Sorry, we could not send the code. Please try again, or reach us on WhatsApp.');
      return;
    }
    setCodeEmail(email);
    setCode('');
    setStage('code');
    setCooldown(RESEND_SECONDS);
    reset();
  }

  async function handleSignIn() {
    reset();
    const { ok: valid, errors: fieldErrors, data } = validateWith(signInSchema, form);
    setErrors(fieldErrors);
    if (!valid) return;
    await sendCode(data.email);
  }

  async function handleAccountCreate() {
    reset();
    const { ok: valid, errors: fieldErrors, data } = validateWith(createAccountSchema, form);
    setErrors(fieldErrors);
    if (!valid) return;
    setIsBusy(true);
    const result = await createAccount({ name: data.name, email: data.email, phone: data.phone });
    setIsBusy(false);
    if (result.ok) {
      reset();
      setForm({ name: '', email: '', phone: '' });
      (onSignedIn || onClose)();
      return;
    }
    if (result.signin) {
      setCodeEmail(result.email);
      setCode('');
      setStage('code');
      setCooldown(RESEND_SECONDS);
      setOk(`You already have an account as ${result.email}.`);
      return;
    }
    setMessage(result.error || 'Sorry, we could not create your account. Please try again.');
  }

  async function handleCodeVerify(fullCode) {
    reset();
    setIsBusy(true);
    const result = await verifyCode(codeEmail, fullCode);
    setIsBusy(false);
    if (result.ok) {
      reset();
      setForm({ name: '', email: '', phone: '' });
      setStage('email');
      setCode('');
      (onSignedIn || onClose)();
      return;
    }
    setCode('');
    setMessage(result.error || 'Sorry, something went wrong. Please try again.');
  }

  async function resendCode() {
    if (cooldown > 0 || isBusy) return;
    await sendCode(codeEmail);
  }

  function returnToEmail() {
    setStage('email');
    setCode('');
    reset();
  }
  function swap(nextView) {
    setView(nextView);
    setStage('email');
    setCode('');
    reset();
  }

  function pickAuthTitle() {
    if (stage === 'code') return 'Enter your code';
    if (view === 'signin') {
      if (isForBooking) return 'Sign in to book';
      return 'Sign in';
    }
    return 'Create your account';
  }

  const title = pickAuthTitle();

  function renderAuthStage() {
    if (stage === 'code')
      return (
        <>
          <p className="m-0 mb-[1.1rem] text-muted text-small leading-[1.5] text-center">
            We sent a 6-digit code to <b className="text-green">{codeEmail}</b>. Enter it below - it expires in 10
            minutes.
          </p>
          <OtpFields
            value={code}
            onChange={setCode}
            onComplete={handleCodeVerify}
            error={!!message}
            disabled={isBusy}
            autoFocus
          />
          {message && (
            <small role="alert" className={`${REFMSG_ERR} block text-center mt-3`}>
              {message}
            </small>
          )}
          {ok && (
            <small role="status" data-signin-note className={`${REFMSG} block text-center mt-3`}>
              {ok}
            </small>
          )}
          <button
            type="button"
            className={`${BTN} mt-4`}
            onClick={() => handleCodeVerify(code)}
            disabled={isBusy || code.length < OTP_CODE_LENGTH}
          >
            {isBusy ? 'Checking...' : 'Verify'}
          </button>
          <p className="mt-4 text-center text-small text-muted">
            {cooldown > 0 ? (
              `Resend code in ${cooldown}s`
            ) : (
              <button
                type="button"
                className="bg-transparent border-none p-0 cursor-pointer font-body text-small text-gold font-semibold underline hover:text-gold-d"
                onClick={resendCode}
              >
                Resend code
              </button>
            )}
            {' · '}
            <button
              type="button"
              className="bg-transparent border-none p-0 cursor-pointer font-body text-small text-gold font-semibold underline hover:text-gold-d"
              onClick={returnToEmail}
            >
              Change email
            </button>
          </p>
        </>
      );
    if (view === 'signin')
      return (
        <>
          <p className="m-0 mb-[1.1rem] text-muted text-small leading-[1.5]">
            {isForBooking ? (
              <>
                Your trip is saved. Enter your email and we&apos;ll send a 6-digit code to sign in - no password needed.
              </>
            ) : (
              <>Enter your email and we&apos;ll send you a 6-digit code. No password needed.</>
            )}
          </p>
          <div className={CONTACT_GROUP}>
            <label className={FIELD_LABEL} htmlFor="auth-email">
              Email
            </label>
            <input
              className={CONTACT_INPUT}
              type="email"
              id="auth-email"
              placeholder="you@email.com"
              value={form.email}
              onChange={set('email')}
              autoComplete="email"
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <small role="alert" className={FIELD_ERR}>
                {errors.email}
              </small>
            )}
          </div>
          {message && (
            <small role="alert" className={REFMSG_ERR}>
              {message}
            </small>
          )}
          <button type="button" className={BTN} onClick={handleSignIn} disabled={isBusy}>
            {isBusy ? 'Sending...' : 'Send code'}
          </button>
          <p className="mt-4 text-center text-small text-muted">
            New here?{' '}
            <button
              type="button"
              className="bg-transparent border-none p-0 cursor-pointer font-body text-small text-gold font-semibold underline hover:text-gold-d"
              onClick={() => swap('create')}
            >
              Create an account
            </button>
          </p>
        </>
      );
    return (
      <>
        <p className="m-0 mb-[1.1rem] text-muted text-small leading-[1.5]">
          No password - we&apos;ll recognise you by email &amp; phone.
        </p>
        <div className={CONTACT_GROUP}>
          <label className={FIELD_LABEL} htmlFor="auth-name">
            Your Name
          </label>
          <input
            className={CONTACT_INPUT}
            type="text"
            id="auth-name"
            placeholder="Enter your name"
            value={form.name}
            onChange={set('name')}
            autoComplete="name"
            aria-invalid={!!errors.name}
          />
          {errors.name && (
            <small role="alert" className={FIELD_ERR}>
              {errors.name}
            </small>
          )}
        </div>
        <div className={CONTACT_GROUP}>
          <label className={FIELD_LABEL} htmlFor="auth-cemail">
            Email
          </label>
          <input
            className={CONTACT_INPUT}
            type="email"
            id="auth-cemail"
            placeholder="you@email.com"
            value={form.email}
            onChange={set('email')}
            autoComplete="email"
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <small role="alert" className={FIELD_ERR}>
              {errors.email}
            </small>
          )}
        </div>
        <div className={CONTACT_GROUP}>
          <label className={FIELD_LABEL} htmlFor="auth-phone">
            Phone / WhatsApp
          </label>
          <input
            className={CONTACT_INPUT}
            type="tel"
            id="auth-phone"
            placeholder="+62 ..."
            value={form.phone}
            onChange={set('phone')}
            autoComplete="tel"
            aria-invalid={!!errors.phone}
          />
          {errors.phone && (
            <small role="alert" className={FIELD_ERR}>
              {errors.phone}
            </small>
          )}
        </div>
        {message && (
          <small role="alert" className={REFMSG_ERR}>
            {message}
          </small>
        )}
        <button type="button" className={BTN} onClick={handleAccountCreate} disabled={isBusy}>
          {isBusy ? 'Creating...' : 'Create Account'}
        </button>
        <p className="mt-4 text-center text-small text-muted">
          Already have an account?{' '}
          <button
            type="button"
            className="bg-transparent border-none p-0 cursor-pointer font-body text-small text-gold font-semibold underline hover:text-gold-d"
            onClick={() => swap('signin')}
          >
            Sign in
          </button>
        </p>
      </>
    );
  }

  return (
    <Modal open={open} onClose={handleClose} title={title}>
      {renderAuthStage()}
    </Modal>
  );
}
