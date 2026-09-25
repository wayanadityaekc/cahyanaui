import { API_BASE, KEY } from '@/lib/constants';

// The owner dashboard's only way to talk to the API.
//
// WHAT IS AND IS NOT PROTECTED HERE. This page ships in a static export, so the
// page itself is public - anyone can open /dashboard.html and will get the login
// form. That is fine and it is the only honest design: nothing in a static build
// can be hidden from a visitor. What is gated is the DATA, server-side: every
// figure on this page arrives from an endpoint behind requireAuth in cahyana-api,
// so without a valid session the page has nothing to show.
//
// The token is the admin password exchanged once (POST /api/admin/login) for a
// 30-day session row. The password itself is never stored on the device.

export function readToken() {
  // localStorage only exists in the browser, and this is a static export: reading
  // it during render would make the first paint differ from the prerendered HTML.
  // Every caller reads it inside an effect.
  try {
    return localStorage.getItem(KEY.adminToken) || null;
  } catch {
    return null;
  }
}

export function writeToken(token) {
  try {
    if (token) localStorage.setItem(KEY.adminToken, token);
    else localStorage.removeItem(KEY.adminToken);
  } catch {
    /* private mode - the session just will not survive a reload */
  }
}

export async function login(user, pass) {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user, pass }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.token) {
    // The server answers with one message for a wrong name and a wrong password
    // alike; repeating it verbatim keeps it that way on screen too.
    throw new Error(body.detail || 'Could not sign in.');
  }
  return body.token;
}

export async function logout(token) {
  // Signing out has to revoke the row, not just forget it here - a token left
  // alive is a token that still opens the data if it was ever copied.
  try {
    await fetch(`${API_BASE}/admin/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    /* revoking is best-effort; the local token is dropped either way */
  }
  writeToken(null);
}

// Thrown when the server says the session is no longer good, so the dashboard
// can drop the token and show the login form instead of an error banner.
export class Unauthorized extends Error {}

export async function getJson(path, token) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401 || res.status === 403) throw new Unauthorized('Session expired.');
  if (!res.ok) throw new Error(`Server answered ${res.status}.`);
  return res.json();
}
