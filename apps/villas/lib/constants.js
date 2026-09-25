// Site-wide constants that aren't prices/rates (those live in lib/currency.js
// and lib/villas.js). Real, existing contact channels — do not invent new ones.
export const WHATSAPP_NUMBER = '61401657862';
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;
export const CONTACT_EMAIL = 'hello@ubudprivatevillas.com';
export const CUE_LINK = 'https://cahyanaubudexperience.com';
export const UBUD_GUIDE_LINK = 'https://cahyanaubudexperience.com/guide/ubud.html';

// Builds a wa.me deep link with a pre-filled, URL-encoded message.
export function whatsappLink(message) {
  return `${WHATSAPP_LINK}?text=${encodeURIComponent(message)}`;
}

// The shared backend. The villa site talks to it for ONE thing today - guest
// accounts, the same accounts the tour site uses, because it is one family and
// one guest record. Villa BOOKINGS do not go through it yet; those are still a
// local cart plus a WhatsApp hand-off.
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || 'https://cahyana-api-production.up.railway.app/api';

// Which front end is asking. The API mails a sign-in link, and this is what
// decides whether that link comes back HERE or to the tour site. It is a key,
// never a URL: the server keeps the addresses.
export const API_SITE = 'villas';

// localStorage key for the session token. Named for this site, so a browser
// that has both sites open keeps two independent sessions rather than one of
// them quietly signing the other out.
export const TOKEN_KEY = 'upv_token_v1';
