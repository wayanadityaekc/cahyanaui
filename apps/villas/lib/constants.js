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
