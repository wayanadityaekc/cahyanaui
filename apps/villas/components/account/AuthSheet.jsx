'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button, Field, Input, OtpFields } from '@cahyana/ui';
import SheetPresence from '@/components/ui/SheetPresence';
import { useAccount } from '@/components/providers/AccountProvider';
import { createAccountSchema, signInSchema } from '@/lib/schemas';

// Resend cooldown for the code; UX only, the server's login limiter is the real rate limit.
const RESEND_SECONDS = 30;
const EMPTY_FORM = { name: '', email: '', phone: '' };
const LINK_BUTTON = 'bg-transparent border-none p-0 cursor-pointer font-body text-small font-semibold text-gold underline';

// CUE's sign-in flow on the villa site's sheet: both views share one email -> 6-digit code stage.
export default function AuthSheet({ open = false, onClose = () => {} }) {
  const { requestLogin, verifyCode, createAccount } = useAccount();
  const [view, setView] = useState('signin');
  const [stage, setStage] = useState('email');
  const [form, setForm] = useState(EMPTY_FORM);
  const [codeEmail, setCodeEmail] = useState('');
  const [code, setCode] = useState('');
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [note, setNote] = useState('');
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = setInterval(() => setCooldown((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  function set(field) {
    return (e) => {
      const { value } = e.target;
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    };
  }
  function reset() { setErrors({}); setMsg(''); setNote(''); }
  function close() { reset(); setForm(EMPTY_FORM); setStage('email'); setCode(''); setView('signin'); onClose(); }

  // One validator for both views; Zod drops unknown keys, so every field must be in the schema.
  function check(schema) {
    const result = schema.safeParse(form);
    if (result.success) return result.data;
    const next = {};
    result.error.issues.forEach((issue) => { if (!next[issue.path[0]]) next[issue.path[0]] = issue.message; });
    setErrors(next);
    return null;
  }

  function toCodeStage(email) {
    setCodeEmail(email);
    setCode('');
    setStage('code');
    setCooldown(RESEND_SECONDS);
  }

  async function sendCode(email) {
    setBusy(true);
    const sent = await requestLogin(email);
    setBusy(false);
    if (!sent) { setMsg('Sorry, we could not send the code. Please try again, or reach us on WhatsApp.'); return; }
    reset();
    toCodeStage(email);
  }

  async function doSignIn() {
    reset();
    const data = check(signInSchema);
    if (!data) return;
    await sendCode(data.email);
  }

  async function doCreate() {
    reset();
    const data = check(createAccountSchema);
    if (!data) return;
    setBusy(true);
    const result = await createAccount(data);
    setBusy(false);
    if (result.ok) { close(); return; }
    // Email already has an account: the server emailed a code, so go to the code stage.
    if (result.signin) { toCodeStage(result.email); setNote(`You already have an account as ${result.email}.`); return; }
    setMsg(result.error || 'Sorry, we could not create your account. Please try again.');
  }

  async function doVerify(fullCode) {
    reset();
    setBusy(true);
    const result = await verifyCode(codeEmail, fullCode);
    setBusy(false);
    if (result.ok) { close(); return; }
    setCode('');
    setMsg(result.error || 'Sorry, something went wrong. Please try again.');
  }

  async function resend() {
    if (cooldown > 0 || busy) return;
    await sendCode(codeEmail);
  }

  function backToEmail() { setStage('email'); setCode(''); reset(); }
  function swap(nextView) { setView(nextView); setStage('email'); setCode(''); reset(); }

  let title = view === 'signin' ? 'Sign in' : 'Create your account';
  if (stage === 'code') title = 'Enter your code';

  return (
    <SheetPresence
      open={open}
      onClose={close}
      label={title}
      shell="fixed inset-0 z-[130] flex items-end sm:items-center justify-center bg-black/45"
      box="relative w-full sm:max-w-md"
    >
      <div className="relative bg-surface-raised rounded-t-xl sm:rounded-xl [box-shadow:var(--shadow-xl)] max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-line sticky top-0 bg-surface-raised z-10">
          <h3 className="text-h3 font-semibold text-gold">{title}</h3>
          <button type="button" onClick={close} aria-label="Close" className="text-gold cursor-pointer">
            <X className="w-[var(--icon-md)] h-[var(--icon-md)]" strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {stage === 'code' && (
            <>
              <p className="text-small text-muted text-center">
                We sent a 6-digit code to <b className="text-green">{codeEmail}</b>. Enter it below - it expires in 10 minutes.
              </p>
              <OtpFields value={code} onChange={setCode} onComplete={doVerify} error={!!msg} disabled={busy} autoFocus />
              {msg && <p role="alert" className="text-label text-err text-center">{msg}</p>}
              {note && <p role="status" data-signin-note className="text-label text-cta text-center">{note}</p>}
              <Button full onClick={() => doVerify(code)} disabled={busy || code.length < 6}>{busy ? 'Checking...' : 'Verify'}</Button>
              <p className="text-center text-small text-muted">
                {cooldown > 0 ? `Resend code in ${cooldown}s` : <button type="button" className={LINK_BUTTON} onClick={resend}>Resend code</button>}
                {' · '}
                <button type="button" className={LINK_BUTTON} onClick={backToEmail}>Change email</button>
              </p>
            </>
          )}

          {stage === 'email' && view === 'signin' && (
            <>
              <p className="text-small text-muted">
                Enter your email and we&apos;ll send you a 6-digit code. No password needed.
              </p>
              <Field label="Email" htmlFor="auth-email" error={errors.email}>
                <Input id="auth-email" type="email" autoComplete="email" placeholder="you@email.com" value={form.email} onChange={set('email')} invalid={!!errors.email} />
              </Field>
              {msg && <p role="alert" className="text-label text-err">{msg}</p>}
              <Button full onClick={doSignIn} disabled={busy}>{busy ? 'Sending...' : 'Send code'}</Button>
              <p className="text-center text-small text-muted">
                New here?{' '}
                <button type="button" className={LINK_BUTTON} onClick={() => swap('create')}>Create an account</button>
              </p>
            </>
          )}

          {stage === 'email' && view === 'create' && (
            <>
              <p className="text-small text-muted">
                No password - we&apos;ll email you a code whenever you need to sign in.
              </p>
              <Field label="Your name" htmlFor="auth-name" error={errors.name}>
                <Input id="auth-name" type="text" autoComplete="name" placeholder="Enter your name" value={form.name} onChange={set('name')} invalid={!!errors.name} />
              </Field>
              <Field label="Email" htmlFor="auth-cemail" error={errors.email}>
                <Input id="auth-cemail" type="email" autoComplete="email" placeholder="you@email.com" value={form.email} onChange={set('email')} invalid={!!errors.email} />
              </Field>
              <Field label="Phone / WhatsApp" htmlFor="auth-phone" error={errors.phone}>
                <Input id="auth-phone" type="tel" autoComplete="tel" placeholder="+62 ..." value={form.phone} onChange={set('phone')} invalid={!!errors.phone} />
              </Field>
              {msg && <p role="alert" className="text-label text-err">{msg}</p>}
              <Button full onClick={doCreate} disabled={busy}>{busy ? 'Creating...' : 'Create account'}</Button>
              <p className="text-center text-small text-muted">
                Already have an account?{' '}
                <button type="button" className={LINK_BUTTON} onClick={() => swap('signin')}>Sign in</button>
              </p>
            </>
          )}
        </div>
      </div>
    </SheetPresence>
  );
}
