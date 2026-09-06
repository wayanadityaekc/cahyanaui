'use client';

import { useState } from 'react';
import { useItinerary } from '@/state/ItineraryProvider';
import { usePricing } from '@/state/PricingProvider';
import DatePopup from './DatePopup';
import { clashDates } from '@/lib/cart';
import BookingForm from './BookingForm';

export default function BookSidebar({ item, perPerson = false }) {
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

  const addRow = (name, date, mode, goto) => {
    save({ ...state, days: [...(state.days || []), { items: [name], itemModes: [mode || 'standard'], date, guests: '' }] });
    if (goto) window.location.href = '/my-trips.html';
    else {
      setToast('Added to My Trips');
      setTimeout(() => setToast(''), 2600);
    }
  };

  const commit = (name, date, mode, goto) => {
    const probe = { ...state, days: [...(state.days || []), { items: [name], itemModes: [mode], date }] };
    if (isFullDay(name) && clashDates(probe, isFullDay).length > 0) {
      setConfirm({ name, date, mode, goto });
      return;
    }
    addRow(name, date, mode, goto);
  };

  const start = (goto) => (name, date, mode) => {
    if (!name) return;
    if (date) return commit(name, date, mode, goto);
    setPending({ name, mode, goto });
    setAsk(true);
  };

  return (
    <div className="booksidebar">
      <BookingForm presetItem={item} presetType="tour" perPerson={perPerson} onBook={start(true)} />

      <DatePopup
        open={!!ask}
        title={pending ? pending.name : ''}
        onPick={(date) => pending && commit(pending.name, date, pending.mode, pending.goto)}
        onClose={() => { setAsk(null); setPending(null); }}
      />

      {confirm && (
        <div className="modal active" onClick={(e) => e.target === e.currentTarget && setConfirm(null)}>
          <div className="modal__box modal__box--sm">
            <button className="modal__close" aria-label="Close" onClick={() => setConfirm(null)}>&times;</button>
            <h3 className="modal__title">Two full-day tours?</h3>
            <p className="modal__sub">You already have a full-day tour on that date. Add another anyway?</p>
            <button type="button" className="modal__btn" onClick={() => { const c = confirm; setConfirm(null); addRow(c.name, c.date, c.mode, c.goto); }}>Add anyway</button>
            <button type="button" className="modal__btn modal__btn--ghost" onClick={() => setConfirm(null)}>Cancel</button>
          </div>
        </div>
      )}

      {toast && <div className="cart-toast">{toast}</div>}
    </div>
  );
}
