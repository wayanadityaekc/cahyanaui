export const WHATSAPP_NUMBER = '6285974650011';
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
  chatThread: 'cue_chat_thread',
  charter: 'cue_charter_v1',
  pickup: 'cue_pickup',
  resumeBook: 'cue_resume_book',
  dropoff: 'cue_dropoff',
  railCollapsed: 'cue_rail_collapsed',
};

export const LEGACY_ITEM_NAMES = {
  'Lempuyang & Tirta Gangga': 'East Bali Tour',
  'Besakih & Taman Ujung': 'East Bali Tour',
  'Jatiluwih Rice Terrace Tour': 'Bedugul Highlands Tour',
  'Ulun Danu Beratan & Handara Gate': 'Bedugul Highlands Tour',
  'Tanah Lot & Taman Ayun': 'West Bali Tour',
  'Sangeh Monkey Forest & Tanah Lot': 'West Bali Tour',
};

export const CURRENCIES = ['USD', 'IDR', 'AUD', 'EUR', 'GBP', 'SGD', 'NZD', 'CAD', 'CHF', 'JPY', 'MYR', 'HKD'];
export const DISPLAY_GUESTS = 2;

export const DEFAULT_CURRENCY = 'USD';

export const CHARTER_SERVICE = 'Charter';
