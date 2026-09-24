'use client';

import { useState } from 'react';
import { useItinerary } from '@/state/ItineraryProvider';
import { usePricing } from '@/state/PricingProvider';
import DatePopup from './DatePopup';
import { clashDates } from '@/lib/cart';
import BookingForm from './BookingForm';
import { SHELL, BOX_SM, CLOSE, TITLE, SUB, BTN, BTN_GHOST } from '@/components/ui/modalClasses';
import ModalPresence from '@/components/ui/ModalPresence';
import { CART_TOAST } from '@/components/ui/cartToastClasses';
import useBodyLock from '@/components/ui/useBodyLock';

export default function BookSidebar({ item, presetType = 'tour', perPerson = false, belowPrice }) {
  const [ask, setAsk] = useState(null);
  const [pending, setPending] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState('');
  const { state, save } = useItinerary();
  const pricing = usePricing();

  const isFullDay = (name) => {
    const c = pricing && pricing.catalog && pricing.catalog.items.find((i) => i.name === name);
    return !!c && (c.category === 'tour' || c.category === 'combo');
  };

  // The real category, for the start-time rules. `presetType` is 'tour' on every
  // detail page (experiences and performances included), so it cannot be used here.
  const categoryOf = (name) => {
    const c = pricing && pricing.catalog && pricing.catalog.items.find((i) => i.name === name);
    return c ? c.category : null;
  };

  const addRow = (name, date, mode, goto, time) => {
    save({ ...state, days: [...(state.days || []), { items: [name], itemModes: [mode || 'standard'], itemTimes: [time || ''], date, guests: '' }] });
    if (goto) window.location.href = '/my-trips.html';
    else {
      setToast('Added to My Trips');
      setTimeout(() => setToast(''), 2600);
    }
  };

  const commit = (name, date, mode, goto, time) => {
    const probe = { ...state, days: [...(state.days || []), { items: [name], itemModes: [mode], date }] };
    if (isFullDay(name) && clashDates(probe, isFullDay).length > 0) {
      setConfirm({ name, date, mode, goto, time });
      return;
    }
    addRow(name, date, mode, goto, time);
  };

  const start = (goto) => (name, date, mode, time) => {
    if (!name) return;
    if (date) return commit(name, date, mode, goto, time);
    setPending({ name, mode, goto });
    setAsk(true);
  };

  useBodyLock(!!confirm);

  return (
    <div className="booksidebar relative border border-line rounded-md overflow-hidden">
      <BookingForm presetItem={item} presetType={presetType} perPerson={perPerson} onBook={start(true)} variant="sidebar" belowPrice={belowPrice} />

      <DatePopup
        open={!!ask}
        title={pending ? pending.name : ''}
        onPick={(date, time) => pending && commit(pending.name, date, pending.mode, pending.goto, time)}
        onClose={() => { setAsk(null); setPending(null); }}
        withTime
        category={pending ? categoryOf(pending.name) : null}
        itemName={pending ? pending.name : null}
      />

      <ModalPresence open={!!confirm} onClose={() => setConfirm(null)} box={BOX_SM}>
        {confirm && (
          <>
            <button className={CLOSE} aria-label="Close" onClick={() => setConfirm(null)}>&times;</button>
            <h3 className={TITLE}>Two full-day tours?</h3>
            <p className={SUB}>You already have a full-day tour on that date. Add another anyway?</p>
            <button type="button" className={BTN} onClick={() => { const c = confirm; setConfirm(null); addRow(c.name, c.date, c.mode, c.goto, c.time); }}>Add anyway</button>
            <button type="button" className={BTN_GHOST} onClick={() => setConfirm(null)}>Cancel</button>
          </>
        )}
      </ModalPresence>

      {toast && <div className={CART_TOAST}>{toast}</div>}
    </div>
  );
}
