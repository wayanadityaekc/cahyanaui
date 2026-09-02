'use client';

import { useEffect } from 'react';
import { useBooking } from '@/state/BookingProvider';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import { useItinerary } from '@/state/ItineraryProvider';

// The info section is injected as raw HTML, so its Book Now / Add to My Trip
// buttons carry no React handlers. This wires them the way initItineraryButtons
// and the data-open="book-modal" trigger did, without re-introducing a
// DOM-scanning init pass over the whole page.
export default function BookCta({ item, category = 'tour' }) {
  const { openBooking } = useBooking();
  const { displayGuests } = useTripPrefs();
  const { state, save } = useItinerary();

  useEffect(() => {
    if (!item) return;
    const root = document.querySelector('section.info .info__cta');
    if (!root) return;

    const book = (e) => {
      e.preventDefault();
      openBooking({
        type: category === 'experience' || category === 'performance' ? 'experience' : 'tour',
        service: item,
        guests: String(displayGuests),
        date: '',
        pickupOptional: false,
        dropoffRequired: false,
        lines: [{ type: 'tour', service: item, guests: displayGuests, mode: 'standard' }],
      });
    };

    const add = (e) => {
      e.preventDefault();
      const days = [...(state.days || [])];
      days.push({ items: [item], itemModes: ['standard'], date: '' });
      save({ ...state, days });
    };

    const bookBtn = root.querySelector('.program-cta__btn--book');
    const addBtn = root.querySelector('.program-cta__btn--add');
    if (bookBtn) bookBtn.addEventListener('click', book);
    if (addBtn) addBtn.addEventListener('click', add);
    return () => {
      if (bookBtn) bookBtn.removeEventListener('click', book);
      if (addBtn) addBtn.removeEventListener('click', add);
    };
  }, [item, category, displayGuests, openBooking, state, save]);

  return null;
}
