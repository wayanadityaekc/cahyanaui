'use client';

import { createContext, useContext, useState } from 'react';
import { useTripPrefs } from '@/components/providers/TripPrefsProvider';

// Drives the in-site booking flow (replaces the old villa-selection context
// used only to pick which Airbnb link a button opened). Holds the sheet's
// open/closed state, which step it's on, and the guest's chosen villa /
// dates / guest count so the price-summary step and the WhatsApp handoff
// message can be built from one shared source of truth.
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
  const [step, setStep] = useState('details'); // 'details' | 'summary'
  const [booking, setBooking] = useState(INITIAL_STATE);

  // Guests comes from the site-wide preference unless the caller names one
  // (the search card does, because the guest just set it there).
  const openBooking = (overrides = {}) => {
    setBooking((prev) => ({ ...prev, guests, ...overrides }));
    setStep('details');
    setIsOpen(true);
  };

  const closeBooking = () => setIsOpen(false);

  const updateBooking = (patch) => {
    setBooking((prev) => ({ ...prev, ...patch }));
    // Changing the count inside the sheet updates the preference too, so the
    // drawer, the search card and the next booking all agree with it.
    if (patch.guests != null) setGuests(patch.guests);
  };

  const goToSummary = () => setStep('summary');
  const goToDetails = () => setStep('details');

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
