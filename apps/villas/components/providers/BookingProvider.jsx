'use client';

import { createContext, useContext, useState } from 'react';
import { useTripPrefs } from '@/components/providers/TripPrefsProvider';

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
  const [step, setStep] = useState('details');
  const [booking, setBooking] = useState(INITIAL_STATE);

  function openBooking(overrides = {}) {
    setBooking((prev) => ({ ...prev, guests, ...overrides }));
    setStep('details');
    setIsOpen(true);
  }

  function closeBooking() {
    return setIsOpen(false);
  }

  function updateBooking(patch) {
    setBooking((prev) => ({ ...prev, ...patch }));
    if (patch.guests != null) setGuests(patch.guests);
  }

  function goToSummary() {
    return setStep('summary');
  }
  function goToDetails() {
    return setStep('details');
  }

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
