'use client';

import { createContext, useContext, useEffect, useState } from 'react';

// Saved villa slugs, per browser; read in an effect, never initial state, so first paint matches the static HTML.
const KEY = 'upv_saved_v1';

const SavedContext = createContext(null);

export function SavedVillasProvider({ children }) {
  const [slugs, setSlugs] = useState([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      // Storage can hold anything (another tab, an older shape, devtools), so keep only valid slugs and never throw.
      if (Array.isArray(parsed)) setSlugs(parsed.filter((entry) => typeof entry === 'string'));
    } catch (e) {
      // Unreadable or unavailable: an empty shortlist is the honest fallback.
    }
  }, []);

  function write(next) {
    setSlugs(next);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch (e) {
      // Storage full or blocked: the heart still fills for this visit, it just will not survive a reload.
    }
  }

  function isSaved(slug) { return slugs.includes(slug); }

  function toggleSave(slug) {
    if (!slug) return;
    write(slugs.includes(slug) ? slugs.filter((savedSlug) => savedSlug !== slug) : [...slugs, slug]);
  }

  return (
    <SavedContext.Provider value={{ slugs, isSaved, toggleSave }}>{children}</SavedContext.Provider>
  );
}

export function useSavedVillas() {
  const ctx = useContext(SavedContext);
  if (!ctx) throw new Error('useSavedVillas must be used within SavedVillasProvider');
  return ctx;
}
