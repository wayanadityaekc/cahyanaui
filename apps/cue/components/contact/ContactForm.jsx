'use client';

import { useState } from 'react';
import { submitContact } from '@/lib/api';
import { contactSchema } from '@/lib/schemas';
import { validateWith } from '@/lib/validate';
import { FIELD_ERR, REFMSG_ERR } from '@/components/ui/modalClasses';
import { CONTACT_GROUP, CONTACT_INPUT, CONTACT_TEXTAREA } from '@/components/ui/contactFieldClasses';
import { FIELD_LABEL } from '@/components/ui/formClasses';
import { BTN_CTA } from '@/components/ui/btnClasses';

export default function ContactForm({ company = false }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [isBusy, setIsBusy] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');

  function set(fieldName) {
    return (event) => {
      const { value } = event.target;
      setForm((previousForm) => ({ ...previousForm, [fieldName]: value }));
      setErrors((previousErrors) =>
        previousErrors[fieldName] ? { ...previousErrors, [fieldName]: undefined } : previousErrors,
      );
    };
  }

  async function send() {
    const { ok, errors: fieldErrors, data } = validateWith(contactSchema, form);
    setErrors(fieldErrors);
    if (!ok) {
      setError('');
      return;
    }
    setError('');
    setIsBusy(true);
    try {
      const contactResult = await submitContact(data);
      if (!contactResult || contactResult.status !== 'saved')
        throw new Error((contactResult && contactResult.detail) || '');
      setIsSent(true);
    } catch (e) {
      setError(e.message || 'Sorry, your message could not be sent. Please try again, or reach us on WhatsApp.');
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <>
      <div
        className="p-8 text-center rounded-md text-green bg-white"
        id="contact-success"
        style={{ display: isSent ? 'block' : 'none' }}
      >
        <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 rounded-[50%] text-[1.6rem] text-white bg-[#25d366]">
          &#10003;
        </div>
        <h3
          className={`mb-3 font-head text-h2 font-medium leading-[1.15] tracking-[-0.01em] ${company ? '!font-bold !text-gold' : ''}`}
        >
          Message Sent!
        </h3>
        <p>Thanks for reaching out. We&apos;ll get back to you by email shortly.</p>
      </div>

      <div className="p-8 rounded-md bg-white" id="contact-form" style={{ display: isSent ? 'none' : undefined }}>
        <div className={CONTACT_GROUP}>
          <label className={FIELD_LABEL} htmlFor="c-name">
            Your Name
          </label>
          <input
            className={CONTACT_INPUT}
            type="text"
            id="c-name"
            placeholder="Enter your name"
            value={form.name}
            onChange={set('name')}
            aria-invalid={!!errors.name}
          />
          {errors.name && (
            <small role="alert" className={FIELD_ERR}>
              {errors.name}
            </small>
          )}
        </div>
        <div className={CONTACT_GROUP}>
          <label className={FIELD_LABEL} htmlFor="c-email">
            Email
          </label>
          <input
            className={CONTACT_INPUT}
            type="email"
            id="c-email"
            placeholder="you@email.com"
            value={form.email}
            onChange={set('email')}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <small role="alert" className={FIELD_ERR}>
              {errors.email}
            </small>
          )}
        </div>
        <div className={CONTACT_GROUP}>
          <label className={FIELD_LABEL} htmlFor="c-message">
            Message
          </label>
          <textarea
            className={CONTACT_TEXTAREA}
            id="c-message"
            placeholder="Tell us what you need - dates, group size, custom requests..."
            value={form.message}
            onChange={set('message')}
            aria-invalid={!!errors.message}
          />
          {errors.message && (
            <small role="alert" className={FIELD_ERR}>
              {errors.message}
            </small>
          )}
        </div>
        {error && (
          <small role="alert" className={REFMSG_ERR}>
            {error}
          </small>
        )}
        <button className={`flex w-full ${BTN_CTA}`} id="c-send" onClick={send} disabled={isBusy}>
          {isBusy ? 'Sending...' : 'Send Message'}
        </button>
      </div>
    </>
  );
}
