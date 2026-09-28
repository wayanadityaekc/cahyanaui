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

// Guests can ask for another code this often. Not a security control (the
// server's own loginLimiter is that) - just stops a guest hammering "Resend"
// while the first email is still in flight.
const RESEND_SECONDS = 30;

// `reason="book"` = opened by the booking gate (WO2): same form, copy that says why
// we are asking and that the trip is safe. `onSignedIn` fires instead of onClose when
// a guest signs in (a NEW account, or a code verified), so the gate can open the held
// booking instead of treating the popup closing as "never mind".
//
// STAGE, sitting alongside `view`: 'email' (the address form) or 'code' (six
// boxes). Both `view`s ('signin' and 'create' landing on an email that already
// has an account) go through the same 'code' stage and the same verifyCode()
// call - one door, one mechanic, whichever way the guest arrived (28 Sep 2026,
// Wayan: send a 6-digit code instead of a sign-in link - it works wherever the
// guest reads the email, same device or not, which a link never could).
export default function AuthModal({ open, onClose, reason, onSignedIn }) {
  const forBook = reason === 'book';
  const { requestLogin, verifyCode, createAccount } = useAccount();
  const [view, setView] = useState('signin'); // 'signin' | 'create'
  const [stage, setStage] = useState('email'); // 'email' | 'code'
  const [f, setF] = useState({ name: '', email: '', phone: '' });
  const [codeEmail, setCodeEmail] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState('');
  const [ok, setOk] = useState('');
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const t = setInterval(() => setCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const set = (k) => (e) => {
    const { value } = e.target;
    setF((v) => ({ ...v, [k]: value }));
    setErrors((v) => (v[k] ? { ...v, [k]: undefined } : v));
  };
  const reset = () => { setMsg(''); setOk(''); setErrors({}); };
  const close = () => { reset(); setF({ name: '', email: '', phone: '' }); setStage('email'); setCode(''); onClose(); };

  const sendCode = async (email) => {
    setBusy(true);
    const sent = await requestLogin(email);
    setBusy(false);
    if (!sent) { setMsg('Sorry, we could not send the code. Please try again, or reach us on WhatsApp.'); return; }
    setCodeEmail(email);
    setCode('');
    setStage('code');
    setCooldown(RESEND_SECONDS);
    reset();
  };

  const doSignIn = async () => {
    reset();
    const { ok: valid, errors: fieldErrors, data } = validateWith(signInSchema, f);
    setErrors(fieldErrors);
    if (!valid) return;
    await sendCode(data.email);
  };

  const doCreate = async () => {
    reset();
    const { ok: valid, errors: fieldErrors, data } = validateWith(createAccountSchema, f);
    setErrors(fieldErrors);
    if (!valid) return;
    setBusy(true);
    const res = await createAccount({ name: data.name, email: data.email, phone: data.phone });
    setBusy(false);
    if (res.ok) { reset(); setF({ name: '', email: '', phone: '' }); (onSignedIn || onClose)(); return; }
    // The email already has an account: the server already emailed it a code
    // (same as an explicit sign-in) rather than handing this browser a login.
    if (res.signin) { setCodeEmail(res.email); setCode(''); setStage('code'); setCooldown(RESEND_SECONDS); setOk(`You already have an account as ${res.email}.`); return; }
    setMsg(res.error || 'Sorry, we could not create your account. Please try again.');
  };

  const doVerify = async (fullCode) => {
    reset();
    setBusy(true);
    const res = await verifyCode(codeEmail, fullCode);
    setBusy(false);
    if (res.ok) { reset(); setF({ name: '', email: '', phone: '' }); setStage('email'); setCode(''); (onSignedIn || onClose)(); return; }
    setCode('');
    setMsg(res.error || 'Sorry, something went wrong. Please try again.');
  };

  const resend = async () => {
    if (cooldown > 0 || busy) return;
    await sendCode(codeEmail);
  };

  const backToEmail = () => { setStage('email'); setCode(''); reset(); };
  const swap = (v) => { setView(v); setStage('email'); setCode(''); reset(); };

  const title = stage === 'code'
    ? 'Enter your code'
    : view === 'signin' ? (forBook ? 'Sign in to book' : 'Sign in') : 'Create your account';

  return (
    <Modal open={open} onClose={close} title={title}>
      {stage === 'code' ? (
        <>
          <p className="m-0 mb-[1.1rem] text-muted text-small leading-[1.5] text-center">
            We sent a 6-digit code to <b className="text-green">{codeEmail}</b>. Enter it below - it expires in 10 minutes.
          </p>
          <OtpFields
            value={code}
            onChange={setCode}
            onComplete={doVerify}
            error={!!msg}
            disabled={busy}
            autoFocus
          />
          {msg && <small className={`${REFMSG_ERR} block text-center mt-3`}>{msg}</small>}
          {ok && <small data-signin-note className={`${REFMSG} block text-center mt-3`}>{ok}</small>}
          <button type="button" className={`${BTN} mt-4`} onClick={() => doVerify(code)} disabled={busy || code.length < 6}>
            {busy ? 'Checking...' : 'Verify'}
          </button>
          <p className="mt-4 text-center text-small text-muted">
            {cooldown > 0 ? `Resend code in ${cooldown}s` : (
              <button type="button" className="bg-transparent border-none p-0 cursor-pointer font-body text-small text-gold font-semibold underline hover:text-gold-d" onClick={resend}>Resend code</button>
            )}
            {' · '}
            <button type="button" className="bg-transparent border-none p-0 cursor-pointer font-body text-small text-gold font-semibold underline hover:text-gold-d" onClick={backToEmail}>Change email</button>
          </p>
        </>
      ) : view === 'signin' ? (
        <>
          <p className="m-0 mb-[1.1rem] text-muted text-small leading-[1.5]">
            {forBook
              ? <>Your trip is saved. Enter your email and we&apos;ll send a 6-digit code to sign in - no password needed.</>
              : <>Enter your email and we&apos;ll send you a 6-digit code. No password needed.</>}
          </p>
          <div className={CONTACT_GROUP}>
            <label className={FIELD_LABEL} htmlFor="auth-email">Email</label>
            <input className={CONTACT_INPUT} type="email" id="auth-email" placeholder="you@email.com" value={f.email} onChange={set('email')} autoComplete="email" aria-invalid={!!errors.email} />
            {errors.email && <small className={FIELD_ERR}>{errors.email}</small>}
          </div>
          {msg && <small className={REFMSG_ERR}>{msg}</small>}
          <button type="button" className={BTN} onClick={doSignIn} disabled={busy}>
            {busy ? 'Sending...' : 'Send code'}
          </button>
          <p className="mt-4 text-center text-small text-muted">
            New here?{' '}
            <button type="button" className="bg-transparent border-none p-0 cursor-pointer font-body text-small text-gold font-semibold underline hover:text-gold-d" onClick={() => swap('create')}>Create an account</button>
          </p>
        </>
      ) : (
        <>
          <p className="m-0 mb-[1.1rem] text-muted text-small leading-[1.5]">No password - we&apos;ll recognise you by email &amp; phone.</p>
          <div className={CONTACT_GROUP}>
            <label className={FIELD_LABEL} htmlFor="auth-name">Your Name</label>
            <input className={CONTACT_INPUT} type="text" id="auth-name" placeholder="Enter your name" value={f.name} onChange={set('name')} autoComplete="name" aria-invalid={!!errors.name} />
            {errors.name && <small className={FIELD_ERR}>{errors.name}</small>}
          </div>
          <div className={CONTACT_GROUP}>
            <label className={FIELD_LABEL} htmlFor="auth-cemail">Email</label>
            <input className={CONTACT_INPUT} type="email" id="auth-cemail" placeholder="you@email.com" value={f.email} onChange={set('email')} autoComplete="email" aria-invalid={!!errors.email} />
            {errors.email && <small className={FIELD_ERR}>{errors.email}</small>}
          </div>
          <div className={CONTACT_GROUP}>
            <label className={FIELD_LABEL} htmlFor="auth-phone">Phone / WhatsApp</label>
            <input className={CONTACT_INPUT} type="tel" id="auth-phone" placeholder="+62 ..." value={f.phone} onChange={set('phone')} autoComplete="tel" aria-invalid={!!errors.phone} />
            {errors.phone && <small className={FIELD_ERR}>{errors.phone}</small>}
          </div>
          {msg && <small className={REFMSG_ERR}>{msg}</small>}
          <button type="button" className={BTN} onClick={doCreate} disabled={busy}>
            {busy ? 'Creating...' : 'Create Account'}
          </button>
          <p className="mt-4 text-center text-small text-muted">
            Already have an account?{' '}
            <button type="button" className="bg-transparent border-none p-0 cursor-pointer font-body text-small text-gold font-semibold underline hover:text-gold-d" onClick={() => swap('signin')}>Sign in</button>
          </p>
        </>
      )}
    </Modal>
  );
}
