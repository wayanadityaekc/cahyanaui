'use client';

import { useState } from 'react';
import { useItinerary } from '@/state/ItineraryProvider';
import { usePricing } from '@/state/PricingProvider';
import DatePopup from './DatePopup';
import { clashDates } from '@/lib/cart';
import BookingForm from './BookingForm';

const CLOCK = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
  </svg>
);
const PEOPLE = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="8" r="3" /><path d="M2 20c0-3.3 3.1-5 7-5s7 1.7 7 5" /><path d="M17 8a3 3 0 0 1 0 6" /><path d="M22 20c0-2.5-1.6-4.1-4-4.7" />
  </svg>
);
const PIN = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s7-5.5 7-12a7 7 0 0 0-14 0c0 6.5 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" />
  </svg>
);

function factOf(facts, prefix) {
  const f = (facts || []).find((x) => x.label.toLowerCase().startsWith(prefix));
  return f ? f.value : '';
}

export default function BookSidebar({ item, facts, perPerson = false }) {
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

  const duration = factOf(facts, 'duration') || factOf(facts, 'time here');
  const pickup = factOf(facts, 'pick');
  const capacity = perPerson ? 'Per person ticket' : 'Private · up to 5 pax';

  return (
    <div className="booksidebar">
      <BookingForm presetItem={item} presetType="tour" onBook={start(true)} onAdd={start(false)} />

      <ul className="booksidebar__specs">
        {duration && <li>{CLOCK}{duration}</li>}
        <li>{PEOPLE}{capacity}</li>
        {pickup && <li>{PIN}{pickup} pick-up</li>}
      </ul>

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
