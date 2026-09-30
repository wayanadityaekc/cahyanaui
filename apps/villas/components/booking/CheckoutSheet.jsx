'use client';

import { useEffect, useState } from 'react';
import { CreditCard, X } from 'lucide-react';
import { BrandIcon, Button, Field, Input, PayOptions } from '@cahyana/ui';
import SheetPresence from '@/components/ui/SheetPresence';
import DokuCheckout from '@/components/booking/DokuCheckout';
import PayPalCheckout from '@/components/booking/PayPalCheckout';
import { useAccount } from '@/components/providers/AccountProvider';
import { useCurrency } from '@/components/providers/CurrencyProvider';
import { bookingBody, bookingLines } from '@/lib/bookingPayload';
import { API_BASE, TOKEN_KEY } from '@/lib/constants';
import { DEFAULT_RAIL, RAIL_CHOICES, noteFor, railFor } from '@/lib/rails';

const PAY_COPY = {
  secure: 'Card details go straight to PayPal from a secure field. They never reach our site or our server.',
  declined: 'That card was declined. Try another card, or pay with PayPal.',
  failed: 'We could not complete the payment. Your booking is saved - please try again.',
  cancelled: 'Payment cancelled. Your booking is saved, you can pay when you are ready.',
};
const ICON = 'w-[var(--icon-lg)] h-[var(--icon-lg)]';
const RAILS = RAIL_CHOICES.map(({ id, label }) => ({
  id,
  label,
  icon: id === 'paypal' ? <BrandIcon name="PayPal" className={ICON} /> : <CreditCard className={`${ICON} text-gold`} strokeWidth={1.7} aria-hidden="true" />,
}));
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

function readToken() {
  try { return window.localStorage.getItem(TOKEN_KEY) || ''; } catch (e) { return ''; }
}
function writeToken(token) {
  try { window.localStorage.setItem(TOKEN_KEY, token); } catch (e) { /* the booking still stands */ }
}

function guestProblems({ name, email, phone }) {
  const problems = {};
  if (!name.trim()) problems.name = 'Please enter your name.';
  if (!EMAIL_RE.test(email.trim())) problems.email = 'Please enter a valid email, like you@gmail.com.';
  if (phone.replace(/\D/g, '').length < 7) problems.phone = 'Please enter a phone or WhatsApp number with the country code.';
  return problems;
}

// Book & pay for My Booking: details, then how to pay (amounts from the server's own quote), then the rail.
export default function CheckoutSheet({ open = false, onClose = () => {}, cart = null, onPaid = () => {} }) {
  const { account } = useAccount();
  const { currency, formatAmount } = useCurrency();
  const [step, setStep] = useState('details');
  const [guest, setGuest] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [quote, setQuote] = useState(null);
  const [prepaid, setPrepaid] = useState(null);
  const [rail, setRail] = useState(DEFAULT_RAIL);
  const [option, setOption] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [bookingRef, setBookingRef] = useState('');

  useEffect(() => {
    if (open && account) setGuest((current) => ({ name: current.name || account.name || '', email: current.email || account.email || '', phone: current.phone || account.phone || '' }));
  }, [open, account]);

  // Ask the server what each option charges; the site never computes a charge itself.
  useEffect(() => {
    if (!open || !cart) return undefined;
    let alive = true;
    async function load() {
      setQuote(null);
      try {
        const response = await fetch(`${API_BASE}/pricing/quote`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ currency, lines: bookingLines(cart), payment: true }),
        });
        const data = await response.json().catch(() => null);
        if (!alive) return;
        const options = data && data.payment ? data.payment.options.filter((row) => row.id !== 'referral' && row.available !== false && row.amount) : [];
        setPrepaid(data && data.payment ? data.payment.prepaid : null);
        setQuote(options.length ? options : 'error');
        setOption((current) => (options.some((row) => row.id === current) ? current : options.length ? options[0].id : ''));
      } catch (e) {
        if (alive) setQuote('error');
      }
    }
    load();
    return () => { alive = false; };
  }, [open, cart, currency]);

  function set(key) { return (event) => setGuest((current) => ({ ...current, [key]: event.target.value })); }

  function toPayment() {
    const problems = guestProblems(guest);
    setErrors(problems);
    if (!Object.keys(problems).length) setStep('pay');
  }

  async function book() {
    setBusy(true);
    setMessage('');
    try {
      const token = readToken();
      const response = await fetch(`${API_BASE}/inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(bookingBody({ cart, guest, currency, payOption: option })),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.status !== 'saved') {
        setMessage(data.detail || 'We could not save your booking. Please try again, or message us on WhatsApp.');
        setBusy(false);
        return;
      }
      if (data.token) writeToken(data.token);
      setBookingRef(data.ref);
      setStep('checkout');
    } catch (e) {
      setMessage('We could not reach our booking server. Please check your connection and try again.');
    }
    setBusy(false);
  }

  const chosen = Array.isArray(quote) ? quote.find((row) => row.id === option) : null;
  const optionRows = Array.isArray(quote)
    ? quote.map((row) => ({
      id: row.id,
      label: row.id === 'full' ? 'Pay everything now' : 'Villa now, deposit on the extras',
      sub: row.id === 'full'
        ? 'Nothing left to pay on the day.'
        : `The villa in full plus a ${formatAmount(row.amount.display - (prepaid ? prepaid.display : 0))} deposit; then ${formatAmount(row.balance.display)} for the extras, paid to your driver on the day.`,
      amount: formatAmount(row.amount.display),
    }))
    : [];
  const title = step === 'details' ? 'Your details' : step === 'pay' ? 'How to pay' : 'Payment';

  return (
    <SheetPresence
      open={open}
      onClose={busy ? () => {} : onClose}
      label={title}
      shell="fixed inset-0 z-[130] flex items-center justify-center p-3 bg-[rgba(0,0,0,0.55)]"
      box="relative w-full max-w-[460px] max-h-[calc(100dvh-24px)] overflow-y-auto p-6 rounded-md bg-white"
    >
      <button type="button" onClick={onClose} aria-label="Close" className="absolute top-3 right-4 text-green bg-transparent border-none cursor-pointer">
        <X className="w-[var(--icon-md)] h-[var(--icon-md)]" strokeWidth={1.8} aria-hidden="true" />
      </button>
      <p className="m-0 mb-1 text-label font-medium tracking-[0.08em] uppercase text-muted">Step {step === 'details' ? 1 : step === 'pay' ? 2 : 3} of 3</p>
      <h3 className="m-0 mb-5 font-body text-h3 font-semibold text-gold">{title}</h3>

      {step === 'details' && (
        <div className="flex flex-col gap-4" data-checkout-step="details">
          <Field label="Name" htmlFor="co-name" error={errors.name}>
            <Input id="co-name" autoComplete="name" value={guest.name} onChange={set('name')} invalid={!!errors.name} />
          </Field>
          <Field label="Email" htmlFor="co-email" error={errors.email}>
            <Input id="co-email" type="email" autoComplete="email" value={guest.email} onChange={set('email')} invalid={!!errors.email} />
          </Field>
          <Field label="Phone / WhatsApp" htmlFor="co-phone" error={errors.phone}>
            <Input id="co-phone" type="tel" autoComplete="tel" placeholder="+61 412 345 678" value={guest.phone} onChange={set('phone')} invalid={!!errors.phone} />
          </Field>
          <Button full onClick={toPayment}>Continue</Button>
        </div>
      )}

      {step === 'pay' && (
        <div className="flex flex-col gap-4" data-checkout-step="pay">
          {quote === null && <p className="m-0 text-body text-muted">Getting your total...</p>}
          {quote === 'error' && <p role="alert" className="m-0 text-body text-err">We could not get the price right now. Please try again in a moment.</p>}
          {Array.isArray(quote) && (
            <PayOptions rails={RAILS} rail={rail} onRail={setRail} options={optionRows} value={option} onChange={setOption} note={noteFor(currency, railFor(rail)) || ''} />
          )}
          {message && <p role="alert" className="m-0 text-small text-err">{message}</p>}
          <Button full onClick={book} disabled={busy || !chosen}>{busy ? 'Booking...' : 'Book now'}</Button>
          <button type="button" onClick={() => setStep('details')} className="self-center bg-transparent border-none p-0 text-small text-gold-d font-medium cursor-pointer">Edit details</button>
          <p className="m-0 text-label text-muted text-center">The stay follows the Firm cancellation policy; each extra can be cancelled free up to 24 hours before.</p>
        </div>
      )}

      {step === 'checkout' && chosen && (
        <div data-checkout-step="checkout">
          <p className="m-0 mb-3 text-body text-green">Booking <b>{bookingRef}</b> is saved. Pay {formatAmount(chosen.amount.display)} to confirm it.</p>
          {railFor(rail) === 'paypal'
            ? <PayPalCheckout bookingRef={bookingRef} option={option} copy={PAY_COPY} currency={currency} onPaid={() => onPaid(bookingRef)} />
            : <DokuCheckout bookingRef={bookingRef} option={option} amountText={formatAmount(chosen.amount.display)} />}
        </div>
      )}
    </SheetPresence>
  );
}
