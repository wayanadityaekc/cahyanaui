'use client';

import { useEffect, useState } from 'react';
import Button from '../primitives/Button.jsx';
import Field from '../primitives/Field.jsx';
import Input from '../primitives/Input.jsx';
import Separator from '../primitives/Separator.jsx';
import { BTN_SM } from '../primitives/btnClasses.js';
import { initialsOf } from './AccountMenu.jsx';

// CUE's red ghost button; it only opens the site's delete confirmation, never deletes by itself.
const BTN_DANGER_GHOST = `inline-flex ${BTN_SM} font-body [border:1px_solid_var(--color-err)] bg-white text-err cursor-pointer hover:bg-err hover:text-white`;
const SECTION_TITLE = 'font-head font-medium text-h3 text-green m-0 mb-3';

// CUE's Account Settings body; the site passes the account, its own prefs fields and the handlers that call the API.
export default function AccountSettings({
  account = null,
  prefs = null,
  onSave = async () => ({ ok: false }),
  onLogout = () => {},
  onDelete = null,
  emailNote = 'Your email is how you sign in, so it cannot be changed here.',
}) {
  const [form, setForm] = useState({ name: '', phone: '' });
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (account) setForm({ name: account.name || '', phone: account.phone || '' });
  }, [account]);

  if (!account) return <p className="m-0 text-body text-muted">Sorry, we could not load this information. Please try again.</p>;

  async function save() {
    setBusy(true);
    setMsg(null);
    const result = await onSave(form);
    setBusy(false);
    setMsg(result && result.ok ? { ok: true, text: 'Saved.' } : { ok: false, text: (result && result.error) || 'Could not save. Please try again.' });
  }

  function set(key) { return (event) => setForm((current) => ({ ...current, [key]: event.target.value })); }

  return (
    <div data-settings>
      <div className="flex items-center gap-4 mb-6">
        <span className="w-[72px] h-[72px] shrink-0 rounded-[50%] bg-gold text-white grid place-items-center text-h2 font-semibold tracking-[0.02em]" aria-hidden="true">
          {initialsOf(account.name, account.email)}
        </span>
        <div className="min-w-0">
          <div className="font-semibold text-h3 text-green overflow-hidden text-ellipsis whitespace-nowrap">{account.name || 'Your account'}</div>
          <div className="text-body text-muted overflow-hidden text-ellipsis whitespace-nowrap">{account.email}</div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Field label="Name" htmlFor="st-name">
          <Input id="st-name" type="text" autoComplete="name" value={form.name} onChange={set('name')} />
        </Field>
        <Field label="Email" htmlFor="st-email" hint={emailNote}>
          <Input id="st-email" type="email" value={account.email || ''} readOnly disabled />
        </Field>
        <Field label="Phone / WhatsApp" htmlFor="st-phone">
          <Input id="st-phone" type="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} />
        </Field>
        {prefs}
      </div>

      {msg && <p role={msg.ok ? 'status' : 'alert'} className={`mt-3 mb-0 text-label ${msg.ok ? 'text-ok' : 'text-err'}`}>{msg.text}</p>}
      <div className="flex flex-wrap gap-2 mt-5">
        <Button onClick={save} disabled={busy}>{busy ? 'Saving...' : 'Save changes'}</Button>
        <Button variant="ghost" onClick={onLogout}>Sign out</Button>
      </div>

      {onDelete ? (
        <>
          <Separator className="my-6" />
          <h2 className={SECTION_TITLE}>Danger zone</h2>
          <p className="text-body text-muted m-0 mb-3">Delete your account. Your bookings stay on record.</p>
          <button type="button" className={BTN_DANGER_GHOST} onClick={onDelete}>Delete account</button>
        </>
      ) : null}
    </div>
  );
}
