'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { useAccount } from '@/state/AccountProvider';

const EMAIL_RE = /^\S+@\S+\.\S+$/;

export default function AuthModal({ open, onClose }) {
  const { requestLogin, createAccount } = useAccount();
  const [view, setView] = useState('signin'); // 'signin' | 'create'
  const [f, setF] = useState({ name: '', email: '', phone: '' });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [ok, setOk] = useState('');

  const set = (k) => (e) => setF((v) => ({ ...v, [k]: e.target.value }));
  const reset = () => { setMsg(''); setOk(''); };
  const close = () => { reset(); setF({ name: '', email: '', phone: '' }); onClose(); };

  const doSignIn = async () => {
    reset();
    if (!EMAIL_RE.test(f.email.trim())) return setMsg('Please enter a valid email address.');
    setBusy(true);
    const sent = await requestLogin(f.email.trim());
    setBusy(false);
    if (sent) setOk('Check your email for a sign-in link. It signs you in - no password needed.');
    else setMsg('Sorry, we could not send the link. Please try again, or reach us on WhatsApp.');
  };

  const doCreate = async () => {
    reset();
    if (!f.name.trim()) return setMsg('Please enter your name.');
    if (!EMAIL_RE.test(f.email.trim())) return setMsg('Please enter a valid email address.');
    if (!f.phone.trim()) return setMsg('Please enter your phone number.');
    setBusy(true);
    const res = await createAccount({ name: f.name.trim(), email: f.email.trim(), phone: f.phone.trim() });
    setBusy(false);
    if (res.ok) close();
    else setMsg(res.error || 'Sorry, we could not create your account. Please try again.');
  };

  const swap = (v) => { setView(v); reset(); };

  return (
    <Modal open={open} onClose={close} title={view === 'signin' ? 'Sign in' : 'Create your account'} className="auth-modal">
      {view === 'signin' ? (
        <>
          <p className="auth-modal__lead">Enter your email and we&apos;ll send you a secure sign-in link. No password needed.</p>
          <div className="contact__group">
            <label htmlFor="auth-email">Email</label>
            <input type="email" id="auth-email" placeholder="you@email.com" value={f.email} onChange={set('email')} autoComplete="email" />
          </div>
          {msg && <small className="modal__referral-msg error">{msg}</small>}
          {ok && <small className="modal__referral-msg">{ok}</small>}
          <button type="button" className="modal__btn" onClick={doSignIn} disabled={busy}>
            {busy ? 'Sending...' : 'Email me a sign-in link'}
          </button>
          <p className="auth-modal__swap">
            New here?{' '}
            <button type="button" className="auth-modal__link" onClick={() => swap('create')}>Create an account</button>
          </p>
        </>
      ) : (
        <>
          <p className="auth-modal__lead">No password - we&apos;ll recognise you by email &amp; phone.</p>
          <div className="contact__group">
            <label htmlFor="auth-name">Your Name</label>
            <input type="text" id="auth-name" placeholder="Enter your name" value={f.name} onChange={set('name')} autoComplete="name" />
          </div>
          <div className="contact__group">
            <label htmlFor="auth-cemail">Email</label>
            <input type="email" id="auth-cemail" placeholder="you@email.com" value={f.email} onChange={set('email')} autoComplete="email" />
          </div>
          <div className="contact__group">
            <label htmlFor="auth-phone">Phone / WhatsApp</label>
            <input type="tel" id="auth-phone" placeholder="+62 ..." value={f.phone} onChange={set('phone')} autoComplete="tel" />
          </div>
          {msg && <small className="modal__referral-msg error">{msg}</small>}
          <button type="button" className="modal__btn" onClick={doCreate} disabled={busy}>
            {busy ? 'Creating...' : 'Create Account'}
          </button>
          <p className="auth-modal__swap">
            Already have an account?{' '}
            <button type="button" className="auth-modal__link" onClick={() => swap('signin')}>Sign in</button>
          </p>
        </>
      )}
    </Modal>
  );
}
