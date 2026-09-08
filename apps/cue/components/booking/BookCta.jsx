'use client';

import { useEffect, useState } from 'react';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import { useItinerary } from '@/state/ItineraryProvider';
import { usePricing } from '@/state/PricingProvider';
import DatePopup from './DatePopup';
import { clashDates } from '@/lib/cart';
import { SHELL, BOX_SM, CLOSE, TITLE, SUB, BTN, BTN_GHOST } from '@/components/ui/modalClasses';

// Wayan's flow (3 Sep 2026), which differs from the old site:
//   Add to My Trip -> pick a date, add to the cart, stay on the page.
//   Book Now       -> pick a date, add to the cart, go to My Trips to pay.
// The old site kept the guest on the page for both. The date is still asked
// for first, otherwise the row lands in My Trips undated and Make Payment
// stays disabled - a dead end.
export default function BookCta({ item, perPerson = false }) {
  const { displayGuests } = useTripPrefs();
  const { state, save } = useItinerary();
  const pricing = usePricing();

  const [ask, setAsk] = useState(null); // 'book' | 'add' | null
  const [toast, setToast] = useState('');
  const [confirm, setConfirm] = useState(null);

  const isFullDay = (name) => {
    const c = pricing && pricing.catalog && pricing.catalog.items.find((i) => i.name === name);
    return !!c && (c.category === 'tour' || c.category === 'combo');
  };

  useEffect(() => {
    if (!item) return;
    const root = document.querySelector('section.info .info__cta');
    if (!root) return;
    const bookBtn = root.querySelector('.program-cta__btn--book');
    const addBtn = root.querySelector('.program-cta__btn--add');
    const onBook = (e) => { e.preventDefault(); setAsk('book'); };
    const onAdd = (e) => { e.preventDefault(); setAsk('add'); };
    if (bookBtn) bookBtn.addEventListener('click', onBook);
    if (addBtn) addBtn.addEventListener('click', onAdd);
    return () => {
      if (bookBtn) bookBtn.removeEventListener('click', onBook);
      if (addBtn) addBtn.removeEventListener('click', onAdd);
    };
  }, [item]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const commit = (date, mode) => {
    const days = [...(state.days || []), { items: [item], itemModes: [mode || 'standard'], date, guests: '' }];
    const next = { ...state, days };
    save(next);
    if (mode === 'book') return;
  };

  const pick = (date) => {
    const goto = ask === 'book';
    // Same guard the old cartAddChecked used: two full-day programmes on one date.
    const probe = { ...state, days: [...(state.days || []), { items: [item], itemModes: ['standard'], date }] };
    if (isFullDay(item) && clashDates(probe, isFullDay).length > 0) {
      setConfirm({ date, goto });
      return;
    }
    add(date, goto);
  };

  const add = (date, goto) => {
    save({ ...state, days: [...(state.days || []), { items: [item], itemModes: ['standard'], date, guests: '' }] });
    if (goto) window.location.href = '/my-trips.html';
    else setToast('Added to My Trips');
  };

  if (!item) return null;

  return (
    <>
      <DatePopup
        open={!!ask}
        title={item}
        onPick={pick}
        onClose={() => setAsk(null)}
      />

      {confirm && (
        <div className={SHELL} onClick={(e) => e.target === e.currentTarget && setConfirm(null)}>
          <div className={BOX_SM}>
            <button className={CLOSE} aria-label="Close" onClick={() => setConfirm(null)}>&times;</button>
            <h3 className={TITLE}>Two full-day tours?</h3>
            <p className={SUB}>You already have a full-day tour on that date. Add another anyway?</p>
            <button type="button" className={BTN} onClick={() => { const c = confirm; setConfirm(null); add(c.date, c.goto); }}>
              Add anyway
            </button>
            <button type="button" className={BTN_GHOST} onClick={() => setConfirm(null)}>Cancel</button>
          </div>
        </div>
      )}

      {toast && <div className="cart-toast">{toast}</div>}
    </>
  );
}
