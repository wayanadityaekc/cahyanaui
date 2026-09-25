'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button, Field, Input } from '@cahyana/ui';
import SheetPresence from '@/components/ui/SheetPresence';
import { useAccount } from '@/components/providers/AccountProvider';
import { createAccountSchema, signInSchema } from '@/lib/schemas';

// Sign in / create an account. The same passwordless account the tour site
// uses, because it is one family and one guest record.
//
// SAME SHELL AS BOOK YOUR STAY, deliberately: SheetPresence, the same scrim,
// the same bottom-sheet-on-a-phone / centred-card-on-a-desktop pair. A second
// dialog shape is a second thing to learn for no reason - this site has one.
//
// NO PASSWORD FIELD, and none is coming: creating an account signs you in on
// the spot, and signing in again mails a link that carries the session. There
// is nothing to store, forget or leak.
const TITLE = { signin: 'Sign in', create: 'Create your account' };

export default function AuthSheet({ open, onClose }) {
  const { requestLogin, createAccount } = useAccount();
  const [view, setView] = useState('signin');
  const [f, setF] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState('');

  const set = (k) => (e) => {
    const { value } = e.target;
    setF((v) => ({ ...v, [k]: value }));
    setErrors((v) => (v[k] ? { ...v, [k]: undefined } : v));
  };
  const reset = () => { setErrors({}); setMsg(''); setSent(''); };
  const swap = (v) => { setView(v); reset(); };
  const close = () => { reset(); setF({ name: '', email: '', phone: '' }); setView('signin'); onClose(); };

  // One validator for both views. Zod DROPS keys it does not know about, so a
  // field has to be in the schema even when it has no rule of its own or its
  // value disappears on the way through.
  const check = (schema) => {
    const r = schema.safeParse(f);
    if (r.success) return r.data;
    const next = {};
    r.error.issues.forEach((i) => { if (!next[i.path[0]]) next[i.path[0]] = i.message; });
    setErrors(next);
    return null;
  };

  const doSignIn = async () => {
    reset();
    const data = check(signInSchema);
    if (!data) return;
    setBusy(true);
    const okSent = await requestLogin(data.email);
    setBusy(false);
    if (okSent) setSent('Check your email for a sign-in link. It signs you in - no password needed.');
    else setMsg('We could not send the link. Please try again, or message us on WhatsApp.');
  };

  const doCreate = async () => {
    reset();
    const data = check(createAccountSchema);
    if (!data) return;
    setBusy(true);
    const res = await createAccount(data);
    setBusy(false);
    if (res.ok) close();
    else setMsg(res.error || 'We could not create your account. Please try again.');
  };

  return (
    <SheetPresence
      open={open}
      onClose={close}
      shell="fixed inset-0 z-[130] flex items-end sm:items-center justify-center bg-black/45"
      box="relative w-full sm:max-w-md"
    >
      <div className="relative bg-white rounded-t-xl sm:rounded-xl [box-shadow:var(--shadow-xl)] max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-line sticky top-0 bg-white z-10">
          <h3 className="text-h3 font-semibold text-gold">{TITLE[view]}</h3>
          <button type="button" onClick={close} aria-label="Close" className="text-gold cursor-pointer">
            <X className="w-[var(--icon-md)] h-[var(--icon-md)]" strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {view === 'signin' ? (
            <>
              <p className="text-small text-muted">
                Enter your email and we&apos;ll send you a sign-in link. No password needed.
              </p>
              <Field label="Email" htmlFor="auth-email" error={errors.email}>
                <Input id="auth-email" type="email" autoComplete="email" placeholder="you@email.com" value={f.email} onChange={set('email')} invalid={!!errors.email} />
              </Field>
              {msg && <p role="alert" className="text-label text-err">{msg}</p>}
              {sent && <p className="text-label text-cta">{sent}</p>}
              <Button full onClick={doSignIn} disabled={busy}>{busy ? 'Sending...' : 'Send link'}</Button>
              <p className="text-center text-small text-muted">
                New here?{' '}
                <button type="button" className="bg-transparent border-none p-0 cursor-pointer font-body text-small font-semibold text-gold underline" onClick={() => swap('create')}>
                  Create an account
                </button>
              </p>
            </>
          ) : (
            <>
              <p className="text-small text-muted">
                No password - we&apos;ll recognise you by your email and phone.
              </p>
              <Field label="Your name" htmlFor="auth-name" error={errors.name}>
                <Input id="auth-name" type="text" autoComplete="name" placeholder="Enter your name" value={f.name} onChange={set('name')} invalid={!!errors.name} />
              </Field>
              <Field label="Email" htmlFor="auth-cemail" error={errors.email}>
                <Input id="auth-cemail" type="email" autoComplete="email" placeholder="you@email.com" value={f.email} onChange={set('email')} invalid={!!errors.email} />
              </Field>
              <Field label="Phone / WhatsApp" htmlFor="auth-phone" error={errors.phone}>
                <Input id="auth-phone" type="tel" autoComplete="tel" placeholder="+62 ..." value={f.phone} onChange={set('phone')} invalid={!!errors.phone} />
              </Field>
              {msg && <p role="alert" className="text-label text-err">{msg}</p>}
              <Button full onClick={doCreate} disabled={busy}>{busy ? 'Creating...' : 'Create account'}</Button>
              <p className="text-center text-small text-muted">
                Already have an account?{' '}
                <button type="button" className="bg-transparent border-none p-0 cursor-pointer font-body text-small font-semibold text-gold underline" onClick={() => swap('signin')}>
                  Sign in
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </SheetPresence>
  );
}
