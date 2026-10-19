const THREAD_ID = /^[a-f0-9]{48}$/;

export function createChatThread({ apiBase, storageKey }) {
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
    } catch (e) {}
  }

  async function post(path, payload, fallback) {
    const response = await fetch(`${apiBase}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.detail || fallback);
    return body;
  }

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

  async function poll(id, since) {
    const response = await fetch(`${apiBase}/chat/${id}?since=${Number(since) || 0}`);
    if (response.status === 404) {
      write(null);
      return { gone: true, messages: [] };
    }
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.detail || 'Could not check for replies.');
    return { gone: false, messages: body.messages || [] };
  }

  async function setContact(id, email) {
    await post(`/chat/${id}/contact`, { email }, 'Could not save that.');
    return true;
  }

  return { read, write, start, send, poll, setContact };
}
