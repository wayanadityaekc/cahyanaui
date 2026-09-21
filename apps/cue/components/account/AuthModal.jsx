'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { createAccountSchema, signInSchema } from '@/lib/schemas';
import { validateWith } from '@/lib/validate';
import { BTN, FIELD_ERR, REFMSG, REFMSG_ERR } from '@/components/ui/modalClasses';
import { CONTACT_GROUP, CONTACT_LABEL, CONTACT_INPUT } from '@/components/ui/contactFieldClasses';
import { useAccount } from '@/state/AccountProvider';

export default function AuthModal({ open, onClose }) {
  const { requestLogin, createAccount } = useAccount();
  const [view, setView] = useState('signin'); // 'signin' | 'create'
  const [f, setF] = useState({ name: '', email: '', phone: '' });
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState('');
  const [ok, setOk] = useState('');

  const set = (k) => (e) => {
    const { value } = e.target;
    setF((v) => ({ ...v, [k]: value }));
    setErrors((v) => (v[k] ? { ...v, [k]: undefined } : v));
  };
  const reset = () => { setMsg(''); setOk(''); setErrors({}); };
  const close = () => { reset(); setF({ name: '', email: '', phone: '' }); onClose(); };

  const doSignIn = async () => {
    reset();
    const { ok: valid, errors: fieldErrors, data } = validateWith(signInSchema, f);
    setErrors(fieldErrors);
    if (!valid) return;
    setBusy(true);
    const sent = await requestLogin(data.email);
    setBusy(false);
    if (sent) setOk('Check your email for a sign-in link. It signs you in - no password needed.');
    else setMsg('Sorry, we could not send the link. Please try again, or reach us on WhatsApp.');
  };

  const doCreate = async () => {
    reset();
    const { ok: valid, errors: fieldErrors, data } = validateWith(createAccountSchema, f);
    setErrors(fieldErrors);
    if (!valid) return;
    setBusy(true);
    const res = await createAccount({ name: data.name, email: data.email, phone: data.phone });
    setBusy(false);
    if (res.ok) close();
    else setMsg(res.error || 'Sorry, we could not create your account. Please try again.');
  };

  const swap = (v) => { setView(v); reset(); };

  return (
    <Modal open={open} onClose={close} title={view === 'signin' ? 'Sign in' : 'Create your account'}>
      {view === 'signin' ? (
        <>
          <p className="m-0 mb-[1.1rem] text-muted text-small leading-[1.5]">Enter your email and we&apos;ll send you a secure sign-in link. No password needed.</p>
          <div className={CONTACT_GROUP}>
            <label className={CONTACT_LABEL} htmlFor="auth-email">Email</label>
            <input className={CONTACT_INPUT} type="email" id="auth-email" placeholder="you@email.com" value={f.email} onChange={set('email')} autoComplete="email" aria-invalid={!!errors.email} />
            {errors.email && <small className={FIELD_ERR}>{errors.email}</small>}
          </div>
          {msg && <small className={REFMSG_ERR}>{msg}</small>}
          {ok && <small className={REFMSG}>{ok}</small>}
          <button type="button" className={BTN} onClick={doSignIn} disabled={busy}>
            {busy ? 'Sending...' : 'Send link'}
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
            <label className={CONTACT_LABEL} htmlFor="auth-name">Your Name</label>
            <input className={CONTACT_INPUT} type="text" id="auth-name" placeholder="Enter your name" value={f.name} onChange={set('name')} autoComplete="name" aria-invalid={!!errors.name} />
            {errors.name && <small className={FIELD_ERR}>{errors.name}</small>}
          </div>
          <div className={CONTACT_GROUP}>
            <label className={CONTACT_LABEL} htmlFor="auth-cemail">Email</label>
            <input className={CONTACT_INPUT} type="email" id="auth-cemail" placeholder="you@email.com" value={f.email} onChange={set('email')} autoComplete="email" aria-invalid={!!errors.email} />
            {errors.email && <small className={FIELD_ERR}>{errors.email}</small>}
          </div>
          <div className={CONTACT_GROUP}>
            <label className={CONTACT_LABEL} htmlFor="auth-phone">Phone / WhatsApp</label>
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
