'use client';

import { useState } from 'react';
import { submitContact } from '@/lib/api';

export default function ContactForm() {
  const [f, setF] = useState({ name: '', email: '', message: '' });
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (e) => setF((v) => ({ ...v, [k]: e.target.value }));

  const send = async () => {
    if (!f.name.trim()) return setError('Please enter your name.');
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) return setError('Please enter a valid email address.');
    if (!f.message.trim()) return setError('Please enter a message.');
    setError('');
    setBusy(true);
    try {
      const d = await submitContact({ name: f.name.trim(), email: f.email.trim(), message: f.message.trim() });
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
      <div className="contact__success" id="contact-success" style={{ display: sent ? 'block' : 'none' }}>
        <div className="contact__success-icon">&#10003;</div>
        <h3 className="contact__heading">Message Sent!</h3>
        <p>Thanks for reaching out. We&apos;ll get back to you by email shortly.</p>
      </div>

      <div className="contact__form" id="contact-form" style={{ display: sent ? 'none' : undefined }}>
      <div className="contact__group">
        <label htmlFor="c-name">Your Name</label>
        <input type="text" id="c-name" placeholder="Enter your name" value={f.name} onChange={set('name')} />
      </div>
      <div className="contact__group">
        <label htmlFor="c-email">Email</label>
        <input type="email" id="c-email" placeholder="you@email.com" value={f.email} onChange={set('email')} />
      </div>
      <div className="contact__group">
        <label htmlFor="c-message">Message</label>
        <textarea id="c-message" placeholder="Tell us what you need - dates, group size, custom requests..." value={f.message} onChange={set('message')} />
      </div>
      {error && <small className="modal__referral-msg error">{error}</small>}
        <button className="contact__btn" id="c-send" onClick={send} disabled={busy}>
          {busy ? 'Sending...' : 'Send Message'}
        </button>
      </div>
    </>
  );
}
