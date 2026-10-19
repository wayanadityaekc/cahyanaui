import { API_BASE, KEY } from '@/lib/constants';

export function readThread() {
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
  } catch (e) {}
}

export async function startThread({ name, email, question, page }) {
  const response = await fetch(`${API_BASE}/chat/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, question, page }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || !body.thread) throw new Error(body.detail || 'Could not reach Wayan just now.');
  writeThread(body.thread);
  return body.thread;
}

export async function sendToThread(id, body) {
  const response = await fetch(`${API_BASE}/chat/${id}/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body }),
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(json.detail || 'Could not send that.');
  return json.message;
}

export async function pollThread(id, since) {
  const response = await fetch(`${API_BASE}/chat/${id}?since=${Number(since) || 0}`);
  if (response.status === 404) {
    writeThread(null);
    return { gone: true, messages: [] };
  }
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.detail || 'Could not check for replies.');
  return { gone: false, messages: body.messages || [] };
}

export async function setContact(id, email) {
  const response = await fetch(`${API_BASE}/chat/${id}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.detail || 'Could not save that.');
  return true;
}
