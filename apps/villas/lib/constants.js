// Site-wide constants (not prices); real contact channels only, do not invent new ones.
export const WHATSAPP_NUMBER = '6285974650011';
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;
export const CONTACT_EMAIL = 'hello@ubudprivatevillas.com';
export const CUE_LINK = 'https://cahyanaubudexperience.com';
export const UBUD_GUIDE_LINK = 'https://cahyanaubudexperience.com/guide/ubud.html';

// Builds a wa.me deep link with a pre-filled, URL-encoded message.
export function whatsappLink(message) {
  return `${WHATSAPP_LINK}?text=${encodeURIComponent(message)}`;
}

// Shared backend, used today only for guest accounts shared with the tour site; villa bookings still go via WhatsApp.
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || 'https://cahyana-api-production.up.railway.app/api';

// Tells the API which site asked, so the sign-in link returns here; a key, never a URL.
export const API_SITE = 'villas';

// Session token key named for this site, so two open sites keep separate sessions.
export const TOKEN_KEY = 'upv_token_v1';
