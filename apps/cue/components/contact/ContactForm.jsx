'use client';

import { useState } from 'react';
import { submitContact } from '@/lib/api';
import { contactSchema } from '@/lib/schemas';
import { validateWith } from '@/lib/validate';
import { FIELD_ERR, REFMSG_ERR } from '@/components/ui/modalClasses';
import { CONTACT_GROUP, CONTACT_LABEL, CONTACT_INPUT, CONTACT_TEXTAREA } from '@/components/ui/contactFieldClasses';

export default function ContactForm({ company = false }) {
  const [f, setF] = useState({ name: '', email: '', message: '' });
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');

  // Clearing the field's own error as it is typed in keeps the message from sitting
  // there contradicting what the guest just fixed.
  const set = (k) => (e) => {
    const { value } = e.target;
    setF((v) => ({ ...v, [k]: value }));
    setErrors((v) => (v[k] ? { ...v, [k]: undefined } : v));
  };

  const send = async () => {
    const { ok, errors: fieldErrors, data } = validateWith(contactSchema, f);
    setErrors(fieldErrors);
    if (!ok) { setError(''); return; }
    setError('');
    setBusy(true);
    try {
      const d = await submitContact(data);
      if (!d || d.status !== 'saved') throw new Error((d && d.detail) || '');
      setSent(true);
    } catch (e) {
      setError(e.message || 'Sorry, your message could not be sent. Please try again, or reach us on WhatsApp.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="p-8 text-center rounded-md text-green bg-white shadow-md" id="contact-success" style={{ display: sent ? 'block' : 'none' }}>
        <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 rounded-[50%] text-[1.6rem] text-white bg-[#25d366]">&#10003;</div>
        <h3 className={`mb-3 font-head text-h2 font-medium leading-[1.15] tracking-[-0.01em] ${company ? '!font-bold !text-gold' : ''}`}>Message Sent!</h3>
        <p>Thanks for reaching out. We&apos;ll get back to you by email shortly.</p>
      </div>

      <div className="p-8 rounded-md bg-white shadow-md" id="contact-form" style={{ display: sent ? 'none' : undefined }}>
      <div className={CONTACT_GROUP}>
        <label className={CONTACT_LABEL} htmlFor="c-name">Your Name</label>
        <input className={CONTACT_INPUT} type="text" id="c-name" placeholder="Enter your name" value={f.name} onChange={set('name')} aria-invalid={!!errors.name} />
        {errors.name && <small className={FIELD_ERR}>{errors.name}</small>}
      </div>
      <div className={CONTACT_GROUP}>
        <label className={CONTACT_LABEL} htmlFor="c-email">Email</label>
        <input className={CONTACT_INPUT} type="email" id="c-email" placeholder="you@email.com" value={f.email} onChange={set('email')} aria-invalid={!!errors.email} />
        {errors.email && <small className={FIELD_ERR}>{errors.email}</small>}
      </div>
      <div className={CONTACT_GROUP}>
        <label className={CONTACT_LABEL} htmlFor="c-message">Message</label>
        <textarea className={CONTACT_TEXTAREA} id="c-message" placeholder="Tell us what you need - dates, group size, custom requests..." value={f.message} onChange={set('message')} aria-invalid={!!errors.message} />
        {errors.message && <small className={FIELD_ERR}>{errors.message}</small>}
      </div>
      {error && <small className={REFMSG_ERR}>{error}</small>}
        <button className="w-full p-[0.85rem] border-none rounded-pill text-[1rem] font-semibold text-white bg-cta cursor-pointer hover:bg-cta-d" id="c-send" onClick={send} disabled={busy}>
          {busy ? 'Sending...' : 'Send Message'}
        </button>
      </div>
    </>
  );
}
