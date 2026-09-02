'use client';

import { useState } from 'react';
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

export default function BookSidebar({ item, facts, included, perPerson = false }) {
  const [open, setOpen] = useState(false);

  const duration = factOf(facts, 'duration') || factOf(facts, 'time here');
  const pickup = factOf(facts, 'pick');
  const capacity = perPerson ? 'Per person ticket' : 'Private · up to 5 pax';

  return (
    <div className="booksidebar">
      <BookingForm presetItem={item} presetType="tour" />

      <ul className="booksidebar__specs">
        {duration && <li>{CLOCK}{duration}</li>}
        <li>{PEOPLE}{capacity}</li>
        {pickup && <li>{PIN}{pickup} pick-up</li>}
      </ul>

      {included && included.length > 0 && (
        <>
          <button type="button" className="booksidebar__incl-trigger" onClick={() => setOpen(true)}>
            <span>What&apos;s included</span>
            <span className="booksidebar__chev" />
          </button>
          <div className={`booksidebar__panel${open ? ' is-open' : ''}`}>
            <div className="booksidebar__panel-head">
              <span>What&apos;s included</span>
              <button type="button" className="booksidebar__panel-close" aria-label="Close" onClick={() => setOpen(false)}>&times;</button>
            </div>
            <ul className="info__list info__list--yes">
              {included.map((it, i) => <li key={i}>{it}</li>)}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
