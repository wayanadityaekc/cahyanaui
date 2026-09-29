export const WHATSAPP_NUMBER = '6285974650011';
// Override with NEXT_PUBLIC_API_BASE for a local API; defaults to the Railway production API.
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
  // Chat thread id is a capability (reads that conversation); keep it private like the account token.
  chatThread: 'cue_chat_thread',
  // Charter plan picked on the homepage, carried to the charter page (lib/charterDraft.js).
  charter: 'cue_charter_v1',
  // Last pick-up / drop-off address, kept on this device (not on the account).
  pickup: 'cue_pickup',
  // {path, at} of a booking interrupted by sign-in, so the magic-link return can resume it; expires (BookingProvider).
  resumeBook: 'cue_resume_book',
  dropoff: 'cue_dropoff',
  // Rail collapsed state, one key shared by My Trips, Our Company and Settings.
  railCollapsed: 'cue_rail_collapsed',
};

// Old product names in saved trips mapped to current ones; mirror of cahyana-api LEGACY_ITEM_NAMES, add, never rename.
export const LEGACY_ITEM_NAMES = {
  'Lempuyang & Tirta Gangga': 'East Bali Tour',
  'Besakih & Taman Ujung': 'East Bali Tour',
  'Jatiluwih Rice Terrace Tour': 'Bedugul Highlands Tour',
  'Ulun Danu Beratan & Handara Gate': 'Bedugul Highlands Tour',
  'Tanah Lot & Taman Ayun': 'West Bali Tour',
  'Sangeh Monkey Forest & Tanah Lot': 'West Bali Tour',
};

// Mirrors fx.CURRENCIES in cahyana-api (order = picker order); rates come from the API, none stored here.
export const CURRENCIES = ['USD', 'IDR', 'AUD', 'EUR', 'GBP', 'SGD', 'NZD', 'CAD', 'CHF', 'JPY', 'MYR', 'HKD'];
export const DISPLAY_GUESTS = 2;

// First-visit currency (TripPrefsProvider only); USD because IDR routes to rupiah-only payment options.
export const DEFAULT_CURRENCY = 'USD';

// Server `service` key for charter bookings and their reviews; use this constant, never retype the string.
export const CHARTER_SERVICE = 'Charter';
