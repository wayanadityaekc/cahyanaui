'use client';
import { useState } from 'react';
import { API_BASE } from '@/lib/constants';
import { BTN_SM } from '@cahyana/ui';

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const had = document.querySelector(`script[data-doku="${src}"]`);
    if (had) {
      if (had.dataset.ready === '1') return resolve();
      had.addEventListener('load', () => resolve());
      had.addEventListener('error', () => reject(new Error('script failed')));
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.dataset.doku = src;
    script.addEventListener('load', () => {
      script.dataset.ready = '1';
      resolve();
    });
    script.addEventListener('error', () => reject(new Error('script failed')));
    document.head.appendChild(script);
  });
}

function adoptShell(before) {
  const addedNodes = [...document.body.children].filter((node) => !before.has(node));
  addedNodes.forEach((node) => {
    if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE') return;
    node.dataset.dokuShell = '1';
    const style = getComputedStyle(node);
    const isWide = node.offsetWidth >= window.innerWidth - 2;
    if (isWide) {
      node.style.background = 'rgba(34,32,28,0.55)';
      node.style.backdropFilter = 'blur(2px)';
    }
    const frame = node.tagName === 'IFRAME' ? node : node.querySelector('iframe');
    if (!frame) return;
    frame.style.borderRadius = 'var(--r-xl)';
    frame.style.border = '0';
    if (style.position === 'fixed' || style.position === 'absolute') node.style.borderRadius = 'var(--r-xl)';
  });
  return addedNodes.length;
}

export default function DokuCheckout({ bookingRef, option, amountText }) {
  const [isBusy, setIsBusy] = useState(false);
  const [error, setErr] = useState('');

  async function handlePaymentStart() {
    setIsBusy(true);
    setErr('');
    try {
      const response = await fetch(`${API_BASE}/doku/create-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_ref: bookingRef, option }),
      });
      const data = await response.json().catch(() => null);
      const isCheckoutUrlMissing = !response.ok || !data || !data.url;
      if (isCheckoutUrlMissing) {
        setErr(
          data && data.code === 'not_ready'
            ? 'Card payments are not available right now. Please go back and choose PayPal, or contact us.'
            : (data && data.detail) || 'We could not start the payment. Please try again.',
        );
        setIsBusy(false);
        return;
      }

      if (data.checkout_js) {
        try {
          await loadScript(data.checkout_js);
          if (typeof window.loadJokulCheckout === 'function') {
            const before = new Set(document.body.children);
            window.loadJokulCheckout(data.url);
            adoptShell(before);
            requestAnimationFrame(() => adoptShell(before));
            setIsBusy(false);
            return;
          }
        } catch (e) {}
      }
      window.location.href = data.url;
    } catch (e) {
      setErr('We could not reach the payment page. Please check your connection and try again.');
      setIsBusy(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        className={`flex w-full ${BTN_SM} border-none font-body no-underline text-white bg-cta cursor-pointer transition-[background-color,color,scale] duration-[var(--dur)] ease-[ease] hover:bg-cta-d disabled:opacity-60`}
        onClick={handlePaymentStart}
        disabled={isBusy || !bookingRef}
      >
        {isBusy ? 'Opening...' : `Pay ${amountText || 'now'}`}
      </button>
      <p className="mt-2 text-small text-muted">
        DOKU's secure payment opens here - card, QRIS, bank transfer or e-wallet, charged in rupiah.
      </p>
      {error ? <p className="mt-2 text-small text-err">{error}</p> : null}
    </div>
  );
}
