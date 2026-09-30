'use client';

import { createContext, useContext, useState } from 'react';
import { useTripPrefs } from '@/components/providers/TripPrefsProvider';

// Booking sheet state (open, step, villa, dates, guests): one source for the summary step and the WhatsApp message.
const BookingContext = createContext(null);

const INITIAL_STATE = {
  villaSlug: 'cahyana-house',
  checkIn: '',
  checkOut: '',
  guests: 2,
};

export function BookingProvider({ children }) {
  const { guests, setGuests } = useTripPrefs();
  const [isOpen, setIsOpen] = useState(false);
  // 'details' | 'summary'
  const [step, setStep] = useState('details');
  const [booking, setBooking] = useState(INITIAL_STATE);

  // Guests come from the site-wide preference unless the caller passes one (the search card does).
  function openBooking(overrides = {}) {
    setBooking((prev) => ({ ...prev, guests, ...overrides }));
    setStep('details');
    setIsOpen(true);
  }

  function closeBooking() { return setIsOpen(false); }

  function updateBooking(patch) {
    setBooking((prev) => ({ ...prev, ...patch }));
    // Keep the site-wide guest preference in sync so the drawer, search card and next booking agree.
    if (patch.guests != null) setGuests(patch.guests);
  }

  function goToSummary() { return setStep('summary'); }
  function goToDetails() { return setStep('details'); }

  const value = {
    isOpen,
    step,
    booking,
    openBooking,
    closeBooking,
    updateBooking,
    goToSummary,
    goToDetails,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
}
