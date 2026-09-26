'use client';

import { createContext, useContext, useEffect, useState } from 'react';

// THE HEART ON A VILLA CARD, made real (Wayan, Sep 2026: "yang sambungin ke
// local storage").
//
// It stores SLUGS, not villas. A saved villa is a pointer at the catalogue, so
// a price change, a new photo or a rename reaches it for free; a copy of the
// villa would freeze whatever was true the day it was tapped.
//
// PER BROWSER, NOT PER GUEST. This is the same honest scope the trip prefs
// have: a shortlist someone made on this phone. It does not follow them to
// another device and it is not visible to us, which is the right answer until
// villa bookings reach the API - at that point this becomes the local half of
// an account-backed list, and the KEY below is what gets migrated.
//
// READ IN useEffect, NEVER IN INITIAL STATE. Static export: the first paint has
// to match the pre-rendered HTML exactly, and a value that only exists in the
// browser makes them differ. So every card renders unsaved for one frame and
// then corrects itself - that is the rule the whole site follows, not a
// shortcut. (TripPrefsProvider carries the same note for the same reason.)
const KEY = 'upv_saved_v1';

const SavedContext = createContext(null);

export function SavedVillasProvider({ children }) {
  const [slugs, setSlugs] = useState([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      // Anything can be in storage - another tab, an older shape, a person with
      // devtools open. Take only what this actually is, and never throw on it.
      if (Array.isArray(parsed)) setSlugs(parsed.filter((s) => typeof s === 'string'));
    } catch {
      // Unreadable or unavailable - an empty shortlist is the honest fallback.
    }
  }, []);

  const write = (next) => {
    setSlugs(next);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // Storage full or blocked. The heart still fills for this visit; it just
      // will not survive a reload. Better than swallowing the tap entirely.
    }
  };

  const isSaved = (slug) => slugs.includes(slug);

  const toggleSave = (slug) => {
    if (!slug) return;
    write(slugs.includes(slug) ? slugs.filter((s) => s !== slug) : [...slugs, slug]);
  };

  return (
    <SavedContext.Provider value={{ slugs, isSaved, toggleSave }}>{children}</SavedContext.Provider>
  );
}

export function useSavedVillas() {
  const ctx = useContext(SavedContext);
  if (!ctx) throw new Error('useSavedVillas must be used within SavedVillasProvider');
  return ctx;
}
