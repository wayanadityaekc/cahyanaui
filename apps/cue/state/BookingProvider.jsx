'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useAccount } from './AccountProvider';
import { readLocalJSON, writeLocal, removeLocal } from '@/lib/storage';
import { KEY } from '@/lib/constants';

const MINUTES_PER_HOUR = 60;
const SECONDS_PER_MINUTE = 60;
const MILLISECONDS_PER_SECOND = 1000;

const BookingContext = createContext(null);

const RESUME_MS = MINUTES_PER_HOUR * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND;

function readPathname() {
  return window.location.pathname;
}
function readMarker() {
  const marker = readLocalJSON(KEY.resumeBook, null);
  return marker && marker.path && Date.now() - (marker.at || 0) < RESUME_MS ? marker : null;
}

export function BookingProvider({ children }) {
  const { account, hydrated, justSignedIn } = useAccount();
  const [bookingContext, setBookingContext] = useState(null);
  const [isGateOpen, setIsGateOpen] = useState(false);
  const held = useRef(null);

  const openBooking = useCallback(
    (options) => {
      if (!options) {
        setBookingContext(null);
        return;
      }
      if (hydrated && account) {
        setBookingContext(options);
        return;
      }
      held.current = options;
      if (!hydrated) return;
      writeLocal(KEY.resumeBook, { path: readPathname(), at: Date.now() });
      setIsGateOpen(true);
    },
    [account, hydrated],
  );

  const closeBooking = useCallback(() => setBookingContext(null), []);

  const cancelGate = useCallback(() => {
    setIsGateOpen(false);
    held.current = null;
  }, []);

  useEffect(() => {
    if (!hydrated || !held.current) return;
    if (account) {
      const options = held.current;
      held.current = null;
      removeLocal(KEY.resumeBook);
      setIsGateOpen(false);
      setBookingContext(options);
    } else if (!isGateOpen) {
      writeLocal(KEY.resumeBook, { path: readPathname(), at: Date.now() });
      setIsGateOpen(true);
    }
  }, [account, hydrated, isGateOpen]);

  useEffect(() => {
    const shouldSkipSignInPrompt = !hydrated || !account || !justSignedIn;
    if (shouldSkipSignInPrompt) return;
    const marker = readMarker();
    if (marker && marker.path !== readPathname()) window.location.replace(marker.path);
  }, [hydrated, account, justSignedIn]);

  return (
    <BookingContext.Provider value={{ ctx: bookingContext, openBooking, closeBooking, gate: isGateOpen, cancelGate }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const bookingContext = useContext(BookingContext);
  if (!bookingContext) throw new Error('useBooking must be used inside BookingProvider');
  return bookingContext;
}

export function useResumeBooking(ready, run) {
  const { account, hydrated } = useAccount();
  const done = useRef(false);
  useEffect(() => {
    const shouldSkipAutoOpen = done.current || !hydrated || !account || !ready;
    if (shouldSkipAutoOpen) return;
    const marker = readMarker();
    if (!marker || marker.path !== readPathname()) return;
    done.current = true;
    removeLocal(KEY.resumeBook);
    run();
  }, [account, hydrated, ready, run]);
}
