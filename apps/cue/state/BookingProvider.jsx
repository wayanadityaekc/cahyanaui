'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useAccount } from './AccountProvider';
import { readLocalJSON, writeLocal, removeLocal } from '@/lib/storage';
import { KEY } from '@/lib/constants';

const BookingContext = createContext(null);

const RESUME_MS = 60 * 60 * 1000;

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
    if (!hydrated || !account || !justSignedIn) return;
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
    if (done.current || !hydrated || !account || !ready) return;
    const marker = readMarker();
    if (!marker || marker.path !== readPathname()) return;
    done.current = true;
    removeLocal(KEY.resumeBook);
    run();
  }, [account, hydrated, ready, run]);
}
