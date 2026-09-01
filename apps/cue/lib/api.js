import { API_BASE } from './constants';

async function post(path, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const r = await fetch(`${API_BASE}${path}`, { method: 'POST', headers, body: JSON.stringify(body) });
  return r.json();
}

export function quote({ lines, currency, stay, referral }) {
  return post('/pricing/quote', { lines, currency, stay, referral });
}

export function validateReferral(code) {
  return post('/referral/validate', { code });
}

export function submitInquiry(payload) {
  return post('/inquiry', payload);
}

export function submitContact({ name, email, message }) {
  return post('/contact', { name, email, message });
}

export async function catalog({ currency = 'USD', guests = 2, stay = '' } = {}) {
  const qs = new URLSearchParams({ currency, guests: String(guests), stay: stay || '' });
  const r = await fetch(`${API_BASE}/pricing/catalog?${qs}`);
  return r.ok ? r.json() : null;
}
