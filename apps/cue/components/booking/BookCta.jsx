'use client';

import { useEffect, useState } from 'react';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import { useItinerary } from '@/state/ItineraryProvider';
import { usePricing } from '@/state/PricingProvider';
import DatePopup from './DatePopup';
import { clashDates } from '@/lib/cart';
import { SHELL, BOX_SM, CLOSE, TITLE, SUB, BTN, BTN_GHOST } from '@/components/ui/modalClasses';
import ModalPresence from '@/components/ui/ModalPresence';
import { CART_TOAST } from '@/components/ui/cartToastClasses';
import LiveRegion from '@/components/ui/LiveRegion';
import useBodyLock from '@/components/ui/useBodyLock';

export default function BookCta({ item, perPerson = false }) {
  const { displayGuests } = useTripPrefs();
  const { state, save } = useItinerary();
  const pricing = usePricing();

  const [ask, setAsk] = useState(null);
  const [toast, setToast] = useState('');
  const [confirm, setConfirm] = useState(null);

  function isFullDay(name) {
    const catalogItem = pricing && pricing.catalog && pricing.catalog.items.find((itemItem) => itemItem.name === name);
    return !!catalogItem && (catalogItem.category === 'tour' || catalogItem.category === 'combo');
  }

  useEffect(() => {
    if (!item) return;
    const root = document.querySelector('section.info .info__cta');
    if (!root) return;
    const bookBtn = root.querySelector('.program-cta__btn--book');
    const addBtn = root.querySelector('.program-cta__btn--add');
    function onBook(event) {
      event.preventDefault();
      setAsk('book');
    }
    function onAdd(event) {
      event.preventDefault();
      setAsk('add');
    }
    if (bookBtn) bookBtn.addEventListener('click', onBook);
    if (addBtn) addBtn.addEventListener('click', onAdd);
    return () => {
      if (bookBtn) bookBtn.removeEventListener('click', onBook);
      if (addBtn) addBtn.removeEventListener('click', onAdd);
    };
  }, [item]);

  useEffect(() => {
    if (!toast) return;
    const toastTimer = setTimeout(() => setToast(''), 2600);
    return () => clearTimeout(toastTimer);
  }, [toast]);

  function categoryOf(name) {
    const catalogItem = pricing && pricing.catalog && pricing.catalog.items.find((itemItem) => itemItem.name === name);
    return catalogItem ? catalogItem.category : null;
  }

  function pick(date, time) {
    const shouldGoToBooking = ask === 'book';
    const probe = { ...state, days: [...(state.days || []), { items: [item], itemModes: ['standard'], date }] };
    if (isFullDay(item) && clashDates(probe, isFullDay).length > 0) {
      setConfirm({ date, goto: shouldGoToBooking, time });
      return;
    }
    add(date, shouldGoToBooking, time);
  }

  function add(date, goto, time) {
    save({
      ...state,
      days: [
        ...(state.days || []),
        { items: [item], itemModes: ['standard'], itemTimes: [time || ''], date, guests: '' },
      ],
    });
    if (goto) window.location.href = '/my-trips.html';
    else setToast('Added to My Trips');
  }

  useBodyLock(!!confirm);

  if (!item) return null;

  return (
    <>
      <DatePopup
        open={!!ask}
        title={item}
        onPick={pick}
        onClose={() => setAsk(null)}
        withTime
        category={categoryOf(item)}
        itemName={item}
      />

      <ModalPresence open={!!confirm} onClose={() => setConfirm(null)} label="Two full-day tours?" box={BOX_SM}>
        {confirm && (
          <>
            <button className={CLOSE} aria-label="Close" onClick={() => setConfirm(null)}>
              &times;
            </button>
            <h3 className={TITLE}>Two full-day tours?</h3>
            <p className={SUB}>You already have a full-day tour on that date. Add another anyway?</p>
            <button
              type="button"
              className={BTN}
              onClick={() => {
                const pendingConfirm = confirm;
                setConfirm(null);
                add(pendingConfirm.date, pendingConfirm.goto, pendingConfirm.time);
              }}
            >
              Add anyway
            </button>
            <button type="button" className={BTN_GHOST} onClick={() => setConfirm(null)}>
              Cancel
            </button>
          </>
        )}
      </ModalPresence>

      <LiveRegion>{toast}</LiveRegion>
      {toast && (
        <div className={CART_TOAST} aria-hidden="true">
          {toast}
        </div>
      )}
    </>
  );
}
