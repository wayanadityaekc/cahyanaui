'use client';
import { FIELD_INPUT } from '@/components/ui/formClasses';

import { useEffect, useRef, useState } from 'react';
import { API_BASE } from '@/lib/constants';
import { chargeCurrency } from '@/lib/rails';

// Inline PayPal checkout: hosted Card Fields (card data stays in PayPal iframes) plus PayPal buttons as fallback.

// SDK is loaded per currency under its own namespace; PayPal rejects orders in a currency the SDK wasn't loaded with.
function sdkId(cur) { return `paypal-sdk-${cur}`; }
function sdkNs(cur) { return `paypal_${cur}`; }

function loadSdk({ clientId, currency }) {
  const id = sdkId(currency);
  const sdkNamespace = sdkNs(currency);
  return new Promise((resolve, reject) => {
    const existing = document.getElementById(id);
    if (existing && window[sdkNamespace]) return resolve(window[sdkNamespace]);
    if (existing) {
      existing.addEventListener('load', () => resolve(window[sdkNamespace]));
      existing.addEventListener('error', reject);
      return;
    }
    const s = document.createElement('script');
    s.id = id;
    s.setAttribute('data-namespace', sdkNamespace);
    // card-fields is always requested; on an ineligible account isEligible() is false and buttons are used instead.
    s.src =
      `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}` +
      `&currency=${encodeURIComponent(currency)}&components=buttons,card-fields&intent=capture`;
    s.onload = () => resolve(window[sdkNamespace]);
    s.onerror = () => reject(new Error('Could not load PayPal.'));
    document.head.appendChild(s);
  });
}

const LABEL = 'block text-label font-medium tracking-[0.08em] uppercase text-muted mb-[0.4rem]';
// Box around PayPal's card field iframe; uses the shared field style.
const FIELD = FIELD_INPUT;
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

    // Never send an amount from here: the server prices the booking itself, this only names the option.
    async function createOrder() {
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
    }

    // Capture only; the booking is confirmed by the webhook, so don't claim it is confirmed from this response.
    async function capture(orderId) {
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
    }

    function fail(e) {
      if (cancelled || !mounted.current) return;
      setState('ready');
      setMsg(e.message || copy.failed);
      if (onError) onError(e);
    }

    function succeed(d) {
      if (cancelled || !mounted.current) return;
      setState('done');
      setMsg('');
      if (onPaid) onPaid(d);
    }

    (async () => {
      try {
        const cfg = await (await fetch(`${API_BASE}/paypal/config`)).json();
        if (!cfg.ready) throw new Error(cfg.reason || 'Payments are not available right now.');
        // Load the SDK in the currency the order is billed in (USD for rupiah), or every order is rejected.
        const billCurrency = chargeCurrency(currency, 'paypal');
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
        const cardFields = sdk.CardFields
          ? sdk.CardFields({
              createOrder,
              onApprove: async (data) => { try { succeed(await capture(data.orderID)); } catch (e) { fail(e); } },
              onError: (e) => fail(e instanceof Error ? e : new Error(copy.failed)),
            })
          : null;

        if (cardFields && cardFields.isEligible() && !cancelled) {
          cardFields.NumberField().render('#pp-card-number');
          cardFields.ExpiryField().render('#pp-card-expiry');
          cardFields.CVVField().render('#pp-card-cvv');
          cardRef.current = cardFields;
          setCardsOn(true);
        }
        if (!cancelled) setState('ready');
      } catch (e) {
        if (!cancelled) { setState('error'); setMsg(e.message); }
      }
    })();

    return () => { cancelled = true; };
  }, [bookingRef, option, copy, currency, onPaid, onError]);

  async function payByCard() {
    if (!cardRef.current) return;
    setState('paying');
    setMsg('');
    try {
      await cardRef.current.submit();
      // onApprove resolves the rest; submit() rejects on a declined card.
    } catch (e) {
      if (mounted.current) { setState('ready'); setMsg(copy.declined); }
    }
  }

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
