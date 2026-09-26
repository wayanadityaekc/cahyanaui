// The guest's side of a handed-over chat.
//
// A thread's id is the whole credential (see cahyana-api/chat.js): it opens
// that one conversation and nothing else. It is kept in this browser only, and
// it is the reason a guest who reloads the page still sees Wayan's reply.
import { API_BASE, KEY } from '@/lib/constants';

export function readThread() {
  // Static export: this is only ever read from an effect, never during render,
  // or the first paint would differ from the prerendered HTML.
  try {
    const v = localStorage.getItem(KEY.chatThread);
    return /^[a-f0-9]{48}$/.test(v || '') ? v : null;
  } catch {
    return null;
  }
}

export function writeThread(id) {
  try {
    if (id) localStorage.setItem(KEY.chatThread, id);
    else localStorage.removeItem(KEY.chatThread);
  } catch {
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

// Polled while the panel is open. `since` keeps the reply small once the
// conversation has a few messages in it.
export async function pollThread(id, since) {
  const res = await fetch(`${API_BASE}/chat/${id}?since=${Number(since) || 0}`);
  if (res.status === 404) {
    // The thread is gone (cleared server-side, or this browser kept an id from
    // a database that has since been reset). Forget it rather than polling a
    // dead id forever.
    writeThread(null);
    return { gone: true, messages: [] };
  }
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.detail || 'Could not check for replies.');
  return { gone: false, messages: body.messages || [] };
}

// Attaches an address to a conversation that has already started. Deliberately
// a separate call from startThread: nothing is asked before the handover, and
// this only happens if the guest chooses to leave one afterwards.
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
