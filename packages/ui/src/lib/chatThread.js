// Guest side of a handed-over chat (CUE's lib/chatThread); the thread id is the credential, kept in this browser only.

const THREAD_ID = /^[a-f0-9]{48}$/;

export function createChatThread({ apiBase, storageKey }) {
  // Only call from an effect, never during render, or the first paint differs from the prerendered HTML.
  function read() {
    try {
      const stored = localStorage.getItem(storageKey);
      return THREAD_ID.test(stored || '') ? stored : null;
    } catch (e) {
      return null;
    }
  }

  function write(id) {
    try {
      if (id) localStorage.setItem(storageKey, id);
      else localStorage.removeItem(storageKey);
    } catch (e) {
      /* private mode: the conversation still works, it just will not survive a reload */
    }
  }

  async function post(path, payload, fallback) {
    const res = await fetch(`${apiBase}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.detail || fallback);
    return body;
  }

  // Hands the question over and returns the new thread id.
  async function start({ name, email, question, page }) {
    const body = await post('/chat/start', { name, email, question, page }, 'Could not reach Wayan just now.');
    if (!body.thread) throw new Error('Could not reach Wayan just now.');
    write(body.thread);
    return body.thread;
  }

  async function send(id, text) {
    const body = await post(`/chat/${id}/message`, { body: text }, 'Could not send that.');
    return body.message;
  }

  // Replies since a given id (polling and catch-up); `since` keeps the response small.
  async function poll(id, since) {
    const res = await fetch(`${apiBase}/chat/${id}?since=${Number(since) || 0}`);
    if (res.status === 404) {
      // The thread no longer exists server-side: forget it instead of polling a dead id.
      write(null);
      return { gone: true, messages: [] };
    }
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.detail || 'Could not check for replies.');
    return { gone: false, messages: body.messages || [] };
  }

  // Optional email on an existing thread, asked after the handover rather than before it.
  async function setContact(id, email) {
    await post(`/chat/${id}/contact`, { email }, 'Could not save that.');
    return true;
  }

  return { read, write, start, send, poll, setContact };
}
