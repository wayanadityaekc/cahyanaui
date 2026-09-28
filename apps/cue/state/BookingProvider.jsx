'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useAccount } from './AccountProvider';
import { readLocalJSON, writeLocal, removeLocal } from '@/lib/storage';
import { KEY } from '@/lib/constants';

const BookingContext = createContext(null);

// A resume marker older than this is ignored: a guest who asked for a sign-in link
// and came back tomorrow should land where the link says, not be thrown into a form.
const RESUME_MS = 60 * 60 * 1000;

const here = () => window.location.pathname;
const readMarker = () => {
  const m = readLocalJSON(KEY.resumeBook, null);
  return m && m.path && Date.now() - (m.at || 0) < RESUME_MS ? m : null;
};

/**
 * WO2 (Sep 2026, Wayan): BOOKING NEEDS AN ACCOUNT. Browsing and the cart do not.
 *
 * `openBooking` is the only way into the booking form (BookConfirmModal), so the
 * gate lives here, once, instead of at every Book button. A guest with no session
 * gets the sign-in popup (`gate`) instead; the booking they asked for is held and
 * opens by itself the moment they are signed in. Two ways that happens:
 *
 *   1. CREATE ACCOUNT - the server logs a NEW account straight in, so `account`
 *      appears in this same page and the held booking opens right away.
 *   2. SIGN-IN LINK - the guest leaves for their inbox. The held booking cannot
 *      survive that (it carries callbacks), so we write a marker {path, at}. The
 *      email link lands on the homepage with ?token=; `justSignedIn` sends the guest
 *      back to `path`, and the page that owns the Book button re-runs it through
 *      `useResumeBooking`. The cart itself is untouched throughout - it lives in
 *      localStorage, so a round trip on the same device keeps it.
 *
 * Nothing on the server changed: sign-in is still email-only (mayHandOver etc).
 */
export function BookingProvider({ children }) {
  const { account, hydrated, justSignedIn } = useAccount();
  const [ctx, setCtx] = useState(null);
  const [gate, setGate] = useState(false);
  const held = useRef(null);

  const openBooking = useCallback((opts) => {
    if (!opts) { setCtx(null); return; }
    if (hydrated && account) { setCtx(opts); return; }
    held.current = opts;
    // Still checking the session: wait for it (effect below) rather than asking a
    // signed-in guest to sign in again.
    if (!hydrated) return;
    writeLocal(KEY.resumeBook, { path: here(), at: Date.now() });
    setGate(true);
  }, [account, hydrated]);

  const closeBooking = useCallback(() => setCtx(null), []);

  // Dismissing the popup drops the held booking. The marker stays: a guest who
  // closes the popup to go and click the link in their email still gets resumed.
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

/**
 * The page that owns a Book button calls this with its own "open the form" function.
 * When a signed-in guest arrives here holding a fresh marker for THIS page, `run` is
 * called once `ready` (cart loaded, nothing blocking) and the marker is cleared.
 */
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
