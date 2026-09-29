'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useAccount } from './AccountProvider';
import { readLocalJSON, writeLocal, removeLocal } from '@/lib/storage';
import { KEY } from '@/lib/constants';

const BookingContext = createContext(null);

// Resume markers older than an hour are ignored.
const RESUME_MS = 60 * 60 * 1000;

function here() { return window.location.pathname; }
function readMarker() {
  const m = readLocalJSON(KEY.resumeBook, null);
  return m && m.path && Date.now() - (m.at || 0) < RESUME_MS ? m : null;
}

// Booking needs an account: openBooking holds the booking behind sign-in and resumes it after (marker).
export function BookingProvider({ children }) {
  const { account, hydrated, justSignedIn } = useAccount();
  const [ctx, setCtx] = useState(null);
  const [gate, setGate] = useState(false);
  const held = useRef(null);

  const openBooking = useCallback((opts) => {
    if (!opts) { setCtx(null); return; }
    if (hydrated && account) { setCtx(opts); return; }
    held.current = opts;
    // Wait for the session check instead of asking a signed-in guest to sign in again.
    if (!hydrated) return;
    writeLocal(KEY.resumeBook, { path: here(), at: Date.now() });
    setGate(true);
  }, [account, hydrated]);

  const closeBooking = useCallback(() => setCtx(null), []);

  // Dismissing the gate drops the held booking but keeps the marker, so the email link still resumes it.
  const cancelGate = useCallback(() => { setGate(false); held.current = null; }, []);

  // Session answered, or the guest just signed in / created an account.
  useEffect(() => {
    if (!hydrated || !held.current) return;
    if (account) {
      const opts = held.current;
      held.current = null;
      removeLocal(KEY.resumeBook);
      setGate(false);
      setCtx(opts);
    } else if (!gate) {
      writeLocal(KEY.resumeBook, { path: here(), at: Date.now() });
      setGate(true);
    }
  }, [account, hydrated, gate]);

  // Back from the sign-in link, which always lands on the homepage.
  useEffect(() => {
    if (!hydrated || !account || !justSignedIn) return;
    const m = readMarker();
    if (m && m.path !== here()) window.location.replace(m.path);
  }, [hydrated, account, justSignedIn]);

  return (
    <BookingContext.Provider value={{ ctx, openBooking, closeBooking, gate, cancelGate }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const c = useContext(BookingContext);
  if (!c) throw new Error('useBooking must be used inside BookingProvider');
  return c;
}

// Reopens the booking form once on the page named by a fresh resume marker, then clears it.
export function useResumeBooking(ready, run) {
  const { account, hydrated } = useAccount();
  const done = useRef(false);
  useEffect(() => {
    if (done.current || !hydrated || !account || !ready) return;
    const m = readMarker();
    if (!m || m.path !== here()) return;
    done.current = true;
    removeLocal(KEY.resumeBook);
    run();
  }, [account, hydrated, ready, run]);
}
