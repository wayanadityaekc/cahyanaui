export const WHATSAPP_NUMBER = '6285974650011';
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;
export const CONTACT_EMAIL = 'hello@ubudprivatevillas.com';
export const CUE_LINK = 'https://cahyanaubudexperience.com';
export const UBUD_GUIDE_LINK = 'https://cahyanaubudexperience.com/guide/ubud.html';

export function whatsappLink(message) {
  return `${WHATSAPP_LINK}?text=${encodeURIComponent(message)}`;
}

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || 'https://cahyana-api-production.up.railway.app/api';

export const API_SITE = 'villas';

export const TOKEN_KEY = 'upv_token_v1';
