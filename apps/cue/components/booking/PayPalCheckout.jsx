'use client';

import { useEffect, useRef, useState } from 'react';
import { API_BASE } from '@/lib/constants';
import { chargeCurrency } from '@/lib/rails';

// The PayPal checkout, rendered inside our own page - no redirect, no new tab.
//
// Two ways to pay, both tied to the SAME server-created order:
//   - hosted Card Fields (card number/expiry/CVV live in PayPal's iframes, so
//     the digits never touch our React state or our server, which is what keeps
//     us out of PCI scope)
//   - the PayPal button, for guests who would rather log in
//
// Card Fields need Advanced Card Payments on the account. If the SDK says they
// are not eligible, the buttons render on their own - those still offer a guest
// "Debit or Credit Card" option, so a card is always payable either way.

// The SDK is loaded PER CURRENCY, under its own namespace.
//
// PayPal refuses an order whose currency is not the one the SDK was loaded with,
// and one page can legitimately need two: the guest's own currency, or USD when
// theirs cannot be settled. Loading once under `window.paypal` meant whichever
// currency got there first won, and the second guest's checkout simply failed.
const sdkId = (cur) => 'paypal-sdk-' + cur;
const sdkNs = (cur) => 'paypal_' + cur;

function loadSdk({ clientId, currency }) {
  const id = sdkId(currency);
  const ns = sdkNs(currency);
  return new Promise((resolve, reject) => {
    const existing = document.getElementById(id);
    if (existing && window[ns]) return resolve(window[ns]);
    if (existing) {
      existing.addEventListener('load', () => resolve(window[ns]));
      existing.addEventListener('error', reject);
      return;
    }
    const s = document.createElement('script');
    s.id = id;
    s.setAttribute('data-namespace', ns);
    // card-fields is requested alongside buttons; asking for it on an
    // ineligible account is harmless, paypal.CardFields() just reports
    // isEligible() false and we fall back.
    s.src =
      `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}` +
      `&currency=${encodeURIComponent(currency)}&components=buttons,card-fields&intent=capture`;
    s.onload = () => resolve(window[ns]);
    s.onerror = () => reject(new Error('Could not load PayPal.'));
    document.head.appendChild(s);
  });
}

const LABEL = 'block text-label font-medium tracking-[0.08em] uppercase text-muted mb-[0.4rem]';
const FIELD = 'h-[var(--field-h)] px-[0.65rem] [border:1px_solid_#d8d2c4] rounded-sm bg-white';
const NOTE = 'mt-[0.6rem] text-small leading-[var(--lh-body)]';

export default function PayPalCheckout({ bookingRef, option, copy, currency = 'USD', onPaid, onError }) {
  const [state, setState] = useState('loading'); // loading | ready | paying | done | error
  const [msg, setMsg] = useState('');
  const [cardsOn, setCardsOn] = useState(false);
  const buttonsRef = useRef(null);
  const cardRef = useRef(null);
  const mounted = useRef(true);

  useEffect(() => () => { mounted.current = false; }, []);

  useEffect(() => {
    let cancelled = false;

    // The amount is never passed from here. The server reads what it priced the
    // booking at and creates the order from that; this only names the option.
    const createOrder = async () => {
      const r = await fetch(`${API_BASE}/paypal/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_ref: bookingRef, option }),
      });
      const d = await r.json().catch(() => null);
      if (!r.ok || !d || !d.id) throw new Error((d && d.detail) || 'Could not start the payment.');
      if (d.converted && !cancelled) {
        setMsg(`PayPal cannot charge ${d.converted.from}, so this is billed as ${d.currency} ${d.amount}.`);
      }
      return d.id;
    };

    // Capture, then wait. The booking is confirmed by PayPal's webhook, not by
    // this response - so the guest is told the payment went through, and the
    // page does not claim the booking is confirmed on its own say-so.
    const capture = async (orderId) => {
      const r = await fetch(`${API_BASE}/paypal/capture-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId }),
      });
      const d = await r.json().catch(() => null);
      if (r.status === 402) throw Object.assign(new Error(copy.declined), { soft: true });
      if (!r.ok || !d || d.status !== 'ok') {
        throw Object.assign(new Error((d && d.detail) || copy.failed), { soft: true });
      }
      return d;
    };

    const fail = (e) => {
      if (cancelled || !mounted.current) return;
      setState('ready');
      setMsg(e.message || copy.failed);
      if (onError) onError(e);
    };

    const succeed = (d) => {
      if (cancelled || !mounted.current) return;
      setState('done');
      setMsg('');
      if (onPaid) onPaid(d);
    };

    (async () => {
      try {
        const cfg = await (await fetch(`${API_BASE}/paypal/config`)).json();
        if (!cfg.ready) throw new Error(cfg.reason || 'Payments are not available right now.');
        // What the order will actually be created in - the guest's own currency
        // unless the rail cannot settle it. Loading the SDK with anything else
        // makes every order bounce.
        const billCurrency = chargeCurrency(currency);
        const sdk = await loadSdk({ clientId: cfg.clientId, currency: billCurrency });
        if (cancelled) return;

        await sdk
          .Buttons({
            style: { layout: 'vertical', shape: 'pill', height: 46 },
            createOrder,
            onApprove: async (data) => { try { succeed(await capture(data.orderID)); } catch (e) { fail(e); } },
            onCancel: () => { if (!cancelled) { setState('ready'); setMsg(copy.cancelled); } },
            onError: (e) => fail(e instanceof Error ? e : new Error(copy.failed)),
          })
          .render(buttonsRef.current);

        // Card Fields, when the account is allowed them.
        const cf = sdk.CardFields
          ? sdk.CardFields({
              createOrder,
              onApprove: async (data) => { try { succeed(await capture(data.orderID)); } catch (e) { fail(e); } },
              onError: (e) => fail(e instanceof Error ? e : new Error(copy.failed)),
            })
          : null;

        if (cf && cf.isEligible() && !cancelled) {
          cf.NumberField().render('#pp-card-number');
          cf.ExpiryField().render('#pp-card-expiry');
          cf.CVVField().render('#pp-card-cvv');
          cardRef.current = cf;
          setCardsOn(true);
        }
        if (!cancelled) setState('ready');
      } catch (e) {
        if (!cancelled) { setState('error'); setMsg(e.message); }
      }
    })();

    return () => { cancelled = true; };
  }, [bookingRef, option, copy, currency, onPaid, onError]);

  const payByCard = async () => {
    if (!cardRef.current) return;
    setState('paying');
    setMsg('');
    try {
      await cardRef.current.submit();
      // onApprove resolves the rest; submit() rejects on a declined card.
    } catch (e) {
      if (mounted.current) { setState('ready'); setMsg(copy.declined); }
    }
  };

  if (state === 'error') {
    return <p className={`${NOTE} text-err`}>{msg}</p>;
  }

  return (
    <div className="mt-4">
      {cardsOn && (
        <div className="mb-4">
          <p className={LABEL}>Card details</p>
          <div id="pp-card-number" className={`${FIELD} mb-2`} />
          <div className="grid grid-cols-2 gap-2">
            <div id="pp-card-expiry" className={FIELD} />
            <div id="pp-card-cvv" className={FIELD} />
          </div>
          <button
            type="button"
            onClick={payByCard}
            disabled={state === 'paying'}
            className="flex w-full mt-3 items-center justify-center text-center leading-none whitespace-nowrap h-[var(--btn-h)] py-0 px-4 rounded-sm text-small font-semibold border-none bg-cta text-white font-body
              text-[1rem] cursor-pointer disabled:opacity-60
              [transition:background-color_var(--dur)_ease,scale_var(--dur-fast)_var(--ease)] hover:bg-cta-d"
          >
            {state === 'paying' ? 'Processing...' : 'Pay now'}
          </button>
          <p className="my-3 text-center text-small text-muted">or</p>
        </div>
      )}

      <div ref={buttonsRef} />

      {state === 'loading' && <p className={`${NOTE} text-muted`}>Loading secure payment...</p>}
      {msg && <p className={`${NOTE} ${state === 'done' ? 'text-ok' : 'text-err'}`}>{msg}</p>}
      <p className={`${NOTE} text-muted`}>{copy.secure}</p>
    </div>
  );
}
