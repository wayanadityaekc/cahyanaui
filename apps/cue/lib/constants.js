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
};

export const CURRENCIES = ['USD', 'IDR', 'AUD', 'EUR', 'GBP'];
export const DISPLAY_GUESTS = 2;

// Currency a first-time visitor sees before they pick one themselves (or before
// their saved localStorage choice loads) - the single place to flip this site-wide.
// Read by TripPrefsProvider only; a visitor's own manual choice always overrides it
// and persists as before, this only controls the starting point.
export const DEFAULT_CURRENCY = 'IDR';
