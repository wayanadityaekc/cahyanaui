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
  // Owner dashboard session. Separate from `token` (a guest account): they are
  // different doors, and one must never be mistaken for the other.
  adminToken: 'cue_admin_token',
  referral: 'cue_referral',
  // The chat thread a guest was handed over to. It is a capability - whoever
  // holds it can read that one conversation - so it lives beside the account
  // token, not in anything that gets shared or logged.
  chatThread: 'cue_chat_thread',
  // Remembers that a guest chose to skip the intro. Without it the form would
  // reappear on every page, which is the definition of pushy.
  charter: 'cue_charter_v1',
  // The pick-up / drop-off address the guest last booked with. NOT on the account
  // (that holds name/email/phone plus the guest-count and area preferences), so it
  // is remembered on this device, next to the cart and the trip preferences.
  pickup: 'cue_pickup',
  dropoff: 'cue_dropoff',
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
// What a first-time visitor sees, before they touch the currency picker. A
// returning one keeps whatever they chose - this only ever decides the first
// paint.
//
// USD since 24 Sep 2026 (Wayan). It was IDR, and that quietly decided which
// PAYMENT RAIL a guest landed on: rupiah routes to DOKU, and DOKU refused a
// card issued outside Indonesia. So a foreign guest who never opened the picker
// was shown rupiah, sent to a rail offering QRIS, bank transfer and e-wallets -
// none of which they hold - and then refused at the card form. This site sells
// to foreign travellers, so the default that works for most of them is the one
// their card can pay on.
//
// Indonesian guests still pick IDR in one tap and get DOKU, which is the
// cheaper rail to settle on, so nothing is lost there beyond one tap.
export const DEFAULT_CURRENCY = 'USD';
