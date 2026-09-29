// Guest side of a handed-over chat; the thread id is the credential and is kept in this browser only.
import { API_BASE, KEY } from '@/lib/constants';

export function readThread() {
  // Only call from an effect, never during render, or the first paint differs from the prerendered HTML.
  try {
    const v = localStorage.getItem(KEY.chatThread);
    return /^[a-f0-9]{48}$/.test(v || '') ? v : null;
  } catch (e) {
    return null;
  }
}

export function writeThread(id) {
  try {
    if (id) localStorage.setItem(KEY.chatThread, id);
    else localStorage.removeItem(KEY.chatThread);
  } catch (e) {
    /* private mode: the conversation still works, it just will not survive a reload */
  }
}

// Hands the question over and returns the new thread id.
export async function startThread({ name, email, question, page }) {
  const res = await fetch(`${API_BASE}/chat/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, question, page }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.thread) throw new Error(body.detail || 'Could not reach Wayan just now.');
  writeThread(body.thread);
  return body.thread;
}

export async function sendToThread(id, body) {
  const res = await fetch(`${API_BASE}/chat/${id}/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.detail || 'Could not send that.');
  return json.message;
}

// Fetch replies since a given id (fallback polling and catch-up); `since` keeps the response small.
export async function pollThread(id, since) {
  const res = await fetch(`${API_BASE}/chat/${id}?since=${Number(since) || 0}`);
  if (res.status === 404) {
    // Thread no longer exists server-side: forget it instead of polling a dead id.
    writeThread(null);
    return { gone: true, messages: [] };
  }
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.detail || 'Could not check for replies.');
  return { gone: false, messages: body.messages || [] };
}

// Attach a contact email to an existing thread; separate from startThread because it's optional and asked after.
export async function setContact(id, email) {
  const res = await fetch(`${API_BASE}/chat/${id}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.detail || 'Could not save that.');
  return true;
}
