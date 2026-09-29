import { useEffect, useState } from 'react';

// URL entry points for My Trips: the hosted-payment return (?ref=) and the review email link (?review=1).
export function usePaymentReturn() {
  const [returnRef, setReturnRef] = useState('');
  useEffect(() => {
    // Read in an effect, never initial state: the first paint must match the pre-rendered HTML.
    try {
      const r = new URLSearchParams(window.location.search).get('ref');
      if (!r) return;
      // If loaded inside the DOKU overlay frame, reload the top window so the waiting screen isn't boxed in.
      if (window.top && window.top !== window.self) {
        window.top.location.replace(window.location.href);
        return;
      }
      setReturnRef(r);
    } catch (e) { /* no query string, or a frame we cannot read: carry on */ }
  }, []);
  function clearReturn() {
    setReturnRef('');
    // Drop the reference so a reload does not reopen a screen the guest closed.
    try { window.history.replaceState(null, '', window.location.pathname); } catch (e) {}
  }
  return { returnRef, clearReturn };
}

// ?review=1: open Past trips, then the review popup once trips have loaded.
export function useReviewLink({ trips, reviewableItems, account, setTab, setReading, setReview }) {
  // ?review=1 opens Past trips and the review popup, but only after trips arrive (never an empty checklist).
  const [wantReview, setWantReview] = useState(false);

  useEffect(() => {
    // Effect, never initial state: the first paint must match the pre-rendered HTML.
    try {
      const p = new URLSearchParams(window.location.search);
      if (p.get('review') !== '1') return;
      setWantReview(true);
      setTab('past');
      setReading(true);
      // Remove only ?review so a reload doesn't reopen it; ?token belongs to the account provider.
      p.delete('review');
      const search = p.toString();
      window.history.replaceState(null, '', `${window.location.pathname}${search ? `?${search}` : ''}`);
    } catch (e) { /* no query string: nothing to do */ }
  }, []);

  useEffect(() => {
    // trips is null until the fetch lands, so this waits rather than guessing.
    if (!wantReview || !trips) return;
    setWantReview(false);   // one shot, whichever way it goes
    // Nothing reviewable (signed out or all done): stay on Past trips, no popup.
    if (!reviewableItems.length) return;
    setReview({ name: (account && account.name) || '', items: reviewableItems });
  }, [wantReview, trips, reviewableItems, account]);
}
