import { useEffect, useState } from 'react';

export function usePaymentReturn() {
  const [returnRef, setReturnRef] = useState('');
  useEffect(() => {
    try {
      const bookingRef = new URLSearchParams(window.location.search).get('ref');
      if (!bookingRef) return;
      if (window.top && window.top !== window.self) {
        window.top.location.replace(window.location.href);
        return;
      }
      setReturnRef(bookingRef);
    } catch (e) {}
  }, []);
  function clearReturn() {
    setReturnRef('');
    try {
      window.history.replaceState(null, '', window.location.pathname);
    } catch (e) {}
  }
  return { returnRef, clearReturn };
}

export function useReviewLink({ trips, reviewableItems, account, setTab, setReading, setReview }) {
  const [wantReview, setWantReview] = useState(false);

  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('review') !== '1') return;
      setWantReview(true);
      setTab('past');
      setReading(true);
      searchParams.delete('review');
      const search = searchParams.toString();
      window.history.replaceState(null, '', `${window.location.pathname}${search ? `?${search}` : ''}`);
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (!wantReview || !trips) return;
    setWantReview(false);
    if (!reviewableItems.length) return;
    setReview({ name: (account && account.name) || '', items: reviewableItems });
  }, [wantReview, trips, reviewableItems, account]);
}
