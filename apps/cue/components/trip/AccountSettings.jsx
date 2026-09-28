'use client';

import { useEffect, useState } from 'react';
import { useAccount } from '@/state/AccountProvider';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import { readLocal } from '@/lib/storage';
import { KEY, API_BASE } from '@/lib/constants';
import Select from '@/components/ui/Select';
import { REFMSG } from '@/components/ui/modalClasses';
import { BTN_PILL, BTN_CTA, BTN_SM } from '@/components/ui/btnClasses';
import { CONTACT_GROUP, CONTACT_INPUT } from '@/components/ui/contactFieldClasses';
import { FIELD_LABEL } from '@/components/ui/formClasses';
import { initialsOf } from '@/components/layout/AccountMenu';
import MyReviews from './MyReviews';
import DeleteAccountModal from './DeleteAccountModal';

// Danger-zone button, same shape as the rest of the page's own local
// BTN_DANGER pattern in DeleteAccountModal - kept ghost-red here since this
// one just OPENS the confirmation, it isn't the destructive action itself.
const BTN_DANGER_GHOST = `inline-flex ${BTN_SM} font-body [border:1px_solid_var(--color-err)] bg-white text-err cursor-pointer hover:bg-err hover:text-white`;
const SECTION_TITLE = 'font-head font-medium text-h3 text-green m-0 mb-3';
const HR = 'my-6 border-0 [border-top:1px_solid_var(--line)]';

export default function AccountSettings() {
  const { account, setAccount, logout, deleteAccount } = useAccount();
  const { guests, setGuests, stay, setStay } = useTripPrefs();
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  // Deleting clears `account` (deleteAccount() in AccountProvider), which
  // would otherwise unmount this component straight into the generic
  // "Sign in to manage your details" line the instant the modal's own
  // request succeeds - the confirmation popup just vanishing mid-action.
  // This flag survives that transition so there's a real confirmation
  // screen instead.
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    if (account) setForm({ name: account.name || '', email: account.email || '', phone: account.phone || '' });
  }, [account]);

  const confirmDelete = async () => {
    const res = await deleteAccount();
    if (res.ok) setDeleted(true);
    return res;
  };

  if (deleted) {
    return (
      <div id="settings-root" data-settings>
        <p className="text-body text-green m-0">Your account has been deleted. You can close this page, or
          {' '}<a href="/" className="text-gold-d font-medium">return home</a>.</p>
      </div>
    );
  }

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
      {/* Large avatar (WO3: "default / initials only - no photo upload"). Same
          initialsOf() the navbar's small circle uses, so the initials are never
          computed two different ways. */}
      <div className="flex items-center gap-4 mb-6">
        <span
          className="w-[72px] h-[72px] shrink-0 rounded-[50%] bg-gold text-white grid place-items-center text-h2 font-semibold tracking-[0.02em]"
          aria-hidden="true"
        >
          {initialsOf(account.name, account.email)}
        </span>
        <div className="min-w-0">
          <div className="font-semibold text-h3 text-green overflow-hidden text-ellipsis whitespace-nowrap">{account.name || 'Your account'}</div>
          <div className="text-body text-muted overflow-hidden text-ellipsis whitespace-nowrap">{account.email}</div>
        </div>
      </div>

      <div className={CONTACT_GROUP}>
        <label className={FIELD_LABEL} htmlFor="st-name">Name</label>
        <input className={CONTACT_INPUT} type="text" id="st-name" value={form.name} onChange={set('name')} />
      </div>
      <div className={CONTACT_GROUP}>
        <label className={FIELD_LABEL} htmlFor="st-email">Email</label>
        <input className={CONTACT_INPUT} type="email" id="st-email" value={form.email} onChange={set('email')} />
      </div>
      <div className={CONTACT_GROUP}>
        <label className={FIELD_LABEL} htmlFor="st-phone">Phone</label>
        <input className={CONTACT_INPUT} type="tel" id="st-phone" value={form.phone} onChange={set('phone')} />
      </div>
      <div className={CONTACT_GROUP}>
        <label className={FIELD_LABEL} htmlFor="st-guests">Guests</label>
        <Select
          id="st-guests"
          label="Guests"
          value={guests || ''}
          onChange={setGuests}
          options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => ({ value: String(n), label: String(n) }))}
          placeholder="Not set"
        />
      </div>
      <div className={CONTACT_GROUP}>
        <label className={FIELD_LABEL} htmlFor="st-stay">Pickup area</label>
        <input className={CONTACT_INPUT} type="text" id="st-stay" value={stay} onChange={(e) => setStay(e.target.value)} placeholder="Ubud & nearby" />
      </div>
      {msg && <small className={REFMSG}>{msg}</small>}
      {/* Was className="contact__btn" - a class from the retired static site that
          was swept out of style.css with the rest of it. Nothing warns about a
          class with no rule, so this rendered as a RAW browser button: 19px tall
          against everything else's 33.6, grey, square, 13.3px Arial. Measured,
          not guessed. If you write a bare className string, grep that the rule
          exists - same trap as .tinfo on the airport page. */}
      <button className={`inline-flex ${BTN_CTA}`} onClick={save} disabled={busy}>{busy ? 'Saving...' : 'Save changes'}</button>
      <button className={BTN_PILL} onClick={logout}>Sign out</button>

      <hr className={HR} />
      <h2 className={SECTION_TITLE}>My reviews</h2>
      <MyReviews />

      <hr className={HR} />
      <h2 className={SECTION_TITLE}>Danger zone</h2>
      <p className="text-body text-muted m-0 mb-3">Delete your account. Your bookings and any reviews you&apos;ve written stay on record.</p>
      <button type="button" className={BTN_DANGER_GHOST} onClick={() => setDeleteOpen(true)}>Delete account</button>
      <DeleteAccountModal open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={confirmDelete} />
    </div>
  );
}
