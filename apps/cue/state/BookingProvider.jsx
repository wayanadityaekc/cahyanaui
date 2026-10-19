'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useAccount } from './AccountProvider';
import { readLocalJSON, writeLocal, removeLocal } from '@/lib/storage';
import { KEY } from '@/lib/constants';

const BookingContext = createContext(null);

const RESUME_MS = 60 * 60 * 1000;

function here() { return window.location.pathname; }
function readMarker() {
  const m = readLocalJSON(KEY.resumeBook, null);
  return m && m.path && Date.now() - (m.at || 0) < RESUME_MS ? m : null;
}

export function BookingProvider({ children }) {
  const { account, hydrated, justSignedIn } = useAccount();
  const [ctx, setCtx] = useState(null);
  const [gate, setGate] = useState(false);
  const held = useRef(null);

  const openBooking = useCallback((opts) => {
    if (!opts) { setCtx(null); return; }
    if (hydrated && account) { setCtx(opts); return; }
    held.current = opts;
    if (!hydrated) return;
    writeLocal(KEY.resumeBook, { path: here(), at: Date.now() });
    setGate(true);
  }, [account, hydrated]);

  const closeBooking = useCallback(() => setCtx(null), []);

  const cancelGate = useCallback(() => { setGate(false); held.current = null; }, []);

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
