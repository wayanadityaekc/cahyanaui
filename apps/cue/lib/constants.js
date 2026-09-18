export const WHATSAPP_NUMBER = '6285974650011';
// Overridable so a preview build can point at a local API; production keeps
// the Railway default when the variable is unset.
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || 'https://cahyana-api-production.up.railway.app/api';

export const KEY = {
  currency: 'cue_currency',
  guests: 'cue_guests',
  stay: 'cue_stay',
  dateFrom: 'cue_date_from',
  dateTo: 'cue_date_to',
  itinerary: 'cue_itinerary_v1',
  itnSynced: 'cue_itn_synced',
  token: 'cue_token',
  referral: 'cue_referral',
  charter: 'cue_charter_v1',
};

// Saved trips in localStorage hold product NAMES, not ids, so renaming a
// product would leave anyone mid-planning with an item the API can no longer
// price. Trips are migrated through this map on load; cahyana-api keeps the
// matching LEGACY_ITEM_NAMES for requests that arrive from a page cached
// before the rename. Keep both, and add to them rather than renaming in place.
export const LEGACY_ITEM_NAMES = {
  'Lempuyang & Tirta Gangga': 'East Bali Tour',
  'Besakih & Taman Ujung': 'East Bali Tour',
  'Jatiluwih Rice Terrace Tour': 'Bedugul Highlands Tour',
  'Ulun Danu Beratan & Handara Gate': 'Bedugul Highlands Tour',
  'Tanah Lot & Taman Ayun': 'West Bali Tour',
  'Sangeh Monkey Forest & Tanah Lot': 'West Bali Tour',
};

export const CURRENCIES = ['USD', 'IDR', 'AUD', 'EUR', 'GBP'];
export const DISPLAY_GUESTS = 2;

// Currency a first-time visitor sees before they pick one themselves (or before
// their saved localStorage choice loads) - the single place to flip this site-wide.
// Read by TripPrefsProvider only; a visitor's own manual choice always overrides it
// and persists as before, this only controls the starting point.
export const DEFAULT_CURRENCY = 'IDR';
