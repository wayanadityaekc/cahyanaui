'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Modal from '@/components/ui/Modal';
import { createAccountSchema, signInSchema } from '@/lib/schemas';
import { BTN, FIELD_ERR, REFMSG, REFMSG_ERR } from '@/components/ui/modalClasses';
import { CONTACT_GROUP, CONTACT_LABEL, CONTACT_INPUT } from '@/components/ui/contactFieldClasses';
import { useAccount } from '@/state/AccountProvider';

export default function AuthModal({ open, onClose }) {
  const { requestLogin, createAccount } = useAccount();
  const [view, setView] = useState('signin'); // 'signin' | 'create'
  const [msg, setMsg] = useState('');
  const [ok, setOk] = useState('');

  // One form per view rather than a schema that swaps underneath a single form -
  // the two views never render together, and keeping them separate avoids a
  // resolver that has to know which view is active.
  const signIn = useForm({ resolver: zodResolver(signInSchema), defaultValues: { email: '' } });
  const create = useForm({
    resolver: zodResolver(createAccountSchema),
    defaultValues: { name: '', email: '', phone: '' },
  });

  const reset = () => { setMsg(''); setOk(''); };
  const close = () => { reset(); signIn.reset(); create.reset(); onClose(); };

  const doSignIn = signIn.handleSubmit(async ({ email }) => {
    reset();
    const sent = await requestLogin(email);
    if (sent) setOk('Check your email for a sign-in link. It signs you in - no password needed.');
    else setMsg('Sorry, we could not send the link. Please try again, or reach us on WhatsApp.');
  });

  const doCreate = create.handleSubmit(async (data) => {
    reset();
    const res = await createAccount({ name: data.name, email: data.email, phone: data.phone });
    if (res.ok) close();
    else setMsg(res.error || 'Sorry, we could not create your account. Please try again.');
  });

  // Carry the email across when swapping views, which the single shared state
  // used to do for free - a guest who typed it on one view shouldn't retype it.
  const swap = (v) => {
    const from = v === 'create' ? signIn : create;
    const to = v === 'create' ? create : signIn;
    const email = from.getValues('email');
    if (email) to.setValue('email', email);
    setView(v);
    reset();
  };

  return (
    <Modal open={open} onClose={close} title={view === 'signin' ? 'Sign in' : 'Create your account'}>
      {view === 'signin' ? (
        <>
          <p className="m-0 mb-[1.1rem] text-muted text-small leading-[1.5]">Enter your email and we&apos;ll send you a secure sign-in link. No password needed.</p>
          <div className={CONTACT_GROUP}>
            <label className={CONTACT_LABEL} htmlFor="auth-email">Email</label>
            <input className={CONTACT_INPUT} type="email" id="auth-email" placeholder="you@email.com" {...signIn.register('email')} autoComplete="email" aria-invalid={!!signIn.formState.errors.email} />
            {signIn.formState.errors.email && <small className={FIELD_ERR}>{signIn.formState.errors.email.message}</small>}
          </div>
          {msg && <small className={REFMSG_ERR}>{msg}</small>}
          {ok && <small className={REFMSG}>{ok}</small>}
          <button type="button" className={BTN} onClick={doSignIn} disabled={signIn.formState.isSubmitting}>
            {signIn.formState.isSubmitting ? 'Sending...' : 'Email me a sign-in link'}
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
            <input className={CONTACT_INPUT} type="text" id="auth-name" placeholder="Enter your name" {...create.register('name')} autoComplete="name" aria-invalid={!!create.formState.errors.name} />
            {create.formState.errors.name && <small className={FIELD_ERR}>{create.formState.errors.name.message}</small>}
          </div>
          <div className={CONTACT_GROUP}>
            <label className={CONTACT_LABEL} htmlFor="auth-cemail">Email</label>
            <input className={CONTACT_INPUT} type="email" id="auth-cemail" placeholder="you@email.com" {...create.register('email')} autoComplete="email" aria-invalid={!!create.formState.errors.email} />
            {create.formState.errors.email && <small className={FIELD_ERR}>{create.formState.errors.email.message}</small>}
          </div>
          <div className={CONTACT_GROUP}>
            <label className={CONTACT_LABEL} htmlFor="auth-phone">Phone / WhatsApp</label>
            <input className={CONTACT_INPUT} type="tel" id="auth-phone" placeholder="+62 ..." {...create.register('phone')} autoComplete="tel" aria-invalid={!!create.formState.errors.phone} />
            {create.formState.errors.phone && <small className={FIELD_ERR}>{create.formState.errors.phone.message}</small>}
          </div>
          {msg && <small className={REFMSG_ERR}>{msg}</small>}
          <button type="button" className={BTN} onClick={doCreate} disabled={create.formState.isSubmitting}>
            {create.formState.isSubmitting ? 'Creating...' : 'Create Account'}
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
