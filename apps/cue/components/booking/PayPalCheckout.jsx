'use client';
import { FIELD_INPUT } from '@/components/ui/formClasses';

import { useEffect, useRef, useState } from 'react';
import { API_BASE } from '@/lib/constants';
import { chargeCurrency } from '@/lib/rails';

const HTTP_STATUS_PAYMENT_REQUIRED = 402;
const PAYPAL_BUTTON_HEIGHT_PX = 46;

function buildSdkId(current) {
  return `paypal-sdk-${current}`;
}
function buildSdkNamespace(current) {
  return `paypal_${current}`;
}

function loadSdk({ clientId, currency }) {
  const id = buildSdkId(currency);
  const sdkNamespace = buildSdkNamespace(currency);
  return new Promise((resolve, reject) => {
    const existing = document.getElementById(id);
    if (existing && window[sdkNamespace]) return resolve(window[sdkNamespace]);
    if (existing) {
      existing.addEventListener('load', () => resolve(window[sdkNamespace]));
      existing.addEventListener('error', reject);
      return;
    }
    const scriptElement = document.createElement('script');
    scriptElement.id = id;
    scriptElement.setAttribute('data-namespace', sdkNamespace);
    scriptElement.src =
      `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}` +
      `&currency=${encodeURIComponent(currency)}&components=buttons,card-fields&intent=capture`;
    scriptElement.onload = () => resolve(window[sdkNamespace]);
    scriptElement.onerror = () => reject(new Error('Could not load PayPal.'));
    document.head.appendChild(scriptElement);
  });
}

const LABEL = 'block text-label font-medium tracking-[0.08em] uppercase text-muted mb-[0.4rem]';
const FIELD = FIELD_INPUT;
const NOTE = 'mt-[0.6rem] text-small leading-[var(--lh-body)]';

export default function PayPalCheckout({ bookingRef, option, copy, currency = 'USD', onPaid, onError }) {
  const [state, setState] = useState('loading');
  const [message, setMessage] = useState('');
  const [isCardFormShown, setIsCardFormShown] = useState(false);
  const buttonsRef = useRef(null);
  const cardRef = useRef(null);
  const mounted = useRef(true);

  useEffect(
    () => () => {
      mounted.current = false;
    },
    [],
  );

  useEffect(() => {
    let cancelled = false;

    async function createOrder() {
      const response = await fetch(`${API_BASE}/paypal/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_ref: bookingRef, option }),
      });
      const data = await response.json().catch(() => null);
      const isOrderIdMissing = !response.ok || !data || !data.id;
      if (isOrderIdMissing) throw new Error((data && data.detail) || 'Could not start the payment.');
      if (data.converted && !cancelled) {
        setMessage(
          `PayPal cannot charge ${data.converted.from}, so this is billed as ${data.currency} ${data.amount}.`,
        );
      }
      return data.id;
    }

    async function capture(orderId) {
      const response = await fetch(`${API_BASE}/paypal/capture-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId }),
      });
      const data = await response.json().catch(() => null);
      if (response.status === HTTP_STATUS_PAYMENT_REQUIRED)
        throw Object.assign(new Error(copy.declined), { soft: true });
      const isCaptureFailed = !response.ok || !data || data.status !== 'ok';
      if (isCaptureFailed) {
        throw Object.assign(new Error((data && data.detail) || copy.failed), { soft: true });
      }
      return data;
    }

    function fail(error) {
      if (cancelled || !mounted.current) return;
      setState('ready');
      setMessage(error.message || copy.failed);
      if (onError) onError(error);
    }

    function handleCaptureSuccess(captureResult) {
      if (cancelled || !mounted.current) return;
      setState('done');
      setMessage('');
      if (onPaid) onPaid(captureResult);
    }

    (async () => {
      try {
        const config = await (await fetch(`${API_BASE}/paypal/config`)).json();
        if (!config.ready) throw new Error(config.reason || 'Payments are not available right now.');
        const billCurrency = chargeCurrency(currency, 'paypal');
        const sdk = await loadSdk({ clientId: config.clientId, currency: billCurrency });
        if (cancelled) return;

        await sdk
          .Buttons({
            style: { layout: 'vertical', shape: 'pill', height: PAYPAL_BUTTON_HEIGHT_PX },
            createOrder,
            onApprove: async (data) => {
              try {
                handleCaptureSuccess(await capture(data.orderID));
              } catch (e) {
                fail(e);
              }
            },
            onCancel: () => {
              if (cancelled) return;
              setState('ready');
              setMessage(copy.cancelled);
            },
            onError: (error) => fail(error instanceof Error ? error : new Error(copy.failed)),
          })
          .render(buttonsRef.current);

        const cardFields = sdk.CardFields
          ? sdk.CardFields({
              createOrder,
              onApprove: async (data) => {
                try {
                  handleCaptureSuccess(await capture(data.orderID));
                } catch (e) {
                  fail(e);
                }
              },
              onError: (error) => fail(error instanceof Error ? error : new Error(copy.failed)),
            })
          : null;

        const canMountCardFields = cardFields && cardFields.isEligible() && !cancelled;
        if (canMountCardFields) {
          cardFields.NumberField().render('#pp-card-number');
          cardFields.ExpiryField().render('#pp-card-expiry');
          cardFields.CVVField().render('#pp-card-cvv');
          cardRef.current = cardFields;
          setIsCardFormShown(true);
        }
        if (!cancelled) setState('ready');
      } catch (e) {
        if (!cancelled) {
          setState('error');
          setMessage(e.message);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [bookingRef, option, copy, currency, onPaid, onError]);

  async function handleCardPay() {
    if (!cardRef.current) return;
    setState('paying');
    setMessage('');
    try {
      await cardRef.current.submit();
    } catch (e) {
      if (mounted.current) {
        setState('ready');
        setMessage(copy.declined);
      }
    }
  }

  if (state === 'error') {
    return <p className={`${NOTE} text-err`}>{message}</p>;
  }

  return (
    <div className="mt-4">
      {isCardFormShown && (
        <div className="mb-4">
          <p className={LABEL}>Card details</p>
          <div id="pp-card-number" className={`${FIELD} mb-2`} />
          <div className="grid grid-cols-2 gap-2">
            <div id="pp-card-expiry" className={FIELD} />
            <div id="pp-card-cvv" className={FIELD} />
          </div>
          <button
            type="button"
            onClick={handleCardPay}
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
      {message && <p className={`${NOTE} ${state === 'done' ? 'text-ok' : 'text-err'}`}>{message}</p>}
      <p className={`${NOTE} text-muted`}>{copy.secure}</p>
    </div>
  );
}
