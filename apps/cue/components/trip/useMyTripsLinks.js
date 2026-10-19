import { useEffect, useState } from 'react';

export function usePaymentReturn() {
  const [returnRef, setReturnRef] = useState('');
  useEffect(() => {
    try {
      const r = new URLSearchParams(window.location.search).get('ref');
      if (!r) return;
      if (window.top && window.top !== window.self) {
        window.top.location.replace(window.location.href);
        return;
      }
      setReturnRef(r);
    } catch (e) {   }
  }, []);
  function clearReturn() {
    setReturnRef('');
    try { window.history.replaceState(null, '', window.location.pathname); } catch (e) {}
  }
  return { returnRef, clearReturn };
}

export function useReviewLink({ trips, reviewableItems, account, setTab, setReading, setReview }) {
  const [wantReview, setWantReview] = useState(false);

  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      if (p.get('review') !== '1') return;
      setWantReview(true);
      setTab('past');
      setReading(true);
      p.delete('review');
      const search = p.toString();
      window.history.replaceState(null, '', `${window.location.pathname}${search ? `?${search}` : ''}`);
    } catch (e) {   }
  }, []);

  useEffect(() => {
    if (!wantReview || !trips) return;
    setWantReview(false);
    if (!reviewableItems.length) return;
    setReview({ name: (account && account.name) || '', items: reviewableItems });
  }, [wantReview, trips, reviewableItems, account]);
}
