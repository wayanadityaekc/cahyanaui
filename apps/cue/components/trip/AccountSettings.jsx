'use client';

import { useEffect, useState } from 'react';
import { useAccount } from '@/state/AccountProvider';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import { readLocal } from '@/lib/storage';
import { KEY, API_BASE } from '@/lib/constants';
import Select from '@/components/ui/Select';
import { REFMSG } from '@/components/ui/modalClasses';

export default function AccountSettings() {
  const { account, setAccount, logout } = useAccount();
  const { guests, setGuests, stay, setStay } = useTripPrefs();
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (account) setForm({ name: account.name || '', email: account.email || '', phone: account.phone || '' });
  }, [account]);

  if (!account) {
    return (
      <div id="settings-root" data-settings>
        <p>Sign in to manage your details.</p>
      </div>
    );
  }

  const save = async () => {
    setBusy(true);
    setMsg('');
    try {
      const d = await fetch(`${API_BASE}/account`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${readLocal(KEY.token, '')}` },
        body: JSON.stringify({ ...form, guest_count_pref: String(guests || ''), stay_area_pref: stay || '' }),
      }).then((r) => r.json());
      if (d && d.account) {
        setAccount(d.account);
        setMsg('Saved.');
      } else {
        setMsg((d && d.detail) || 'Could not save. Please try again.');
      }
    } catch (e) {
      setMsg('Could not save. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const set = (k) => (e) => setForm((v) => ({ ...v, [k]: e.target.value }));

  return (
    <div id="settings-root" data-settings>
      <div className="contact__group">
        <label htmlFor="st-name">Name</label>
        <input type="text" id="st-name" value={form.name} onChange={set('name')} />
      </div>
      <div className="contact__group">
        <label htmlFor="st-email">Email</label>
        <input type="email" id="st-email" value={form.email} onChange={set('email')} />
      </div>
      <div className="contact__group">
        <label htmlFor="st-phone">Phone</label>
        <input type="tel" id="st-phone" value={form.phone} onChange={set('phone')} />
      </div>
      <div className="contact__group">
        <label htmlFor="st-guests">Guests</label>
        <Select
          id="st-guests"
          label="Guests"
          value={guests || ''}
          onChange={setGuests}
          options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => ({ value: String(n), label: String(n) }))}
          placeholder="Not set"
        />
      </div>
      <div className="contact__group">
        <label htmlFor="st-stay">Pickup area</label>
        <input type="text" id="st-stay" value={stay} onChange={(e) => setStay(e.target.value)} placeholder="Ubud & nearby" />
      </div>
      {msg && <small className={REFMSG}>{msg}</small>}
      <button className="contact__btn" onClick={save} disabled={busy}>{busy ? 'Saving...' : 'Save changes'}</button>
      <button className="btn-pill" onClick={logout}>Sign out</button>
    </div>
  );
}
