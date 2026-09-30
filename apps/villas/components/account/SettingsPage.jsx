'use client';

import Link from 'next/link';
import { useState } from 'react';
import { X } from 'lucide-react';
import { AccountSettings, Button, Container, EYEBROW_LINE } from '@cahyana/ui';
import SheetPresence from '@/components/ui/SheetPresence';
import AuthSheet from '@/components/account/AuthSheet';
import TripPrefsFields from '@/components/layout/TripPrefsFields';
import { useAccount } from '@/components/providers/AccountProvider';

function DeleteSheet({ open = false, onClose = () => {}, onConfirm = async () => ({ ok: false }) }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  async function confirm() {
    setBusy(true);
    setMsg('');
    const result = await onConfirm();
    setBusy(false);
    if (!result || !result.ok) setMsg((result && result.error) || 'Could not delete your account. Please try again.');
  }

  return (
    <SheetPresence
      open={open}
      onClose={busy ? () => {} : onClose}
      label="Delete your account?"
      shell="fixed inset-0 z-[130] flex items-center justify-center p-6 bg-[rgba(0,0,0,0.55)]"
      box="relative w-full max-w-[420px] max-h-[90vh] overflow-y-auto p-8 rounded-md bg-white"
    >
      <button type="button" onClick={onClose} aria-label="Close" className="absolute top-3 right-4 text-green bg-transparent border-none cursor-pointer">
        <X className="w-[var(--icon-md)] h-[var(--icon-md)]" strokeWidth={1.8} aria-hidden="true" />
      </button>
      <h3 className="mb-4 font-body text-h3 font-semibold text-gold">Delete your account?</h3>
      <p className="m-0 mb-3 text-body text-green leading-[var(--lh-body,1.6)]">
        This removes your saved details and signs you out. Any booking you already made stays on record, because we still owe you that stay.
      </p>
      <p className="m-0 mb-5 text-body text-green leading-[var(--lh-body,1.6)]">
        The same account is used on Cahyana Ubud Experience, so it is deleted there too.
      </p>
      {msg && <p role="alert" className="m-0 mb-3 text-label text-err">{msg}</p>}
      <div className="flex gap-2 max-[480px]:flex-col">
        <Button variant="ghost" onClick={onClose} disabled={busy}>Keep account</Button>
        <Button onClick={confirm} disabled={busy} className="!bg-err hover:!brightness-90">{busy ? 'Deleting...' : 'Delete account'}</Button>
      </div>
    </SheetPresence>
  );
}

// The villa's Account Settings: CUE's page, minus trip reviews, which the villa site does not collect.
export default function SettingsPage() {
  const { account, hydrated, updateAccount, deleteAccount, logout } = useAccount();
  const [authOpen, setAuthOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleted, setDeleted] = useState(false);

  async function confirmDelete() {
    const result = await deleteAccount();
    if (result.ok) {
      setDeleteOpen(false);
      setDeleted(true);
    }
    return result;
  }

  let body = null;
  if (deleted) {
    body = <p className="m-0 text-body text-green">Your account has been deleted. You can close this page, or <Link href="/" className="text-gold font-medium">return home</Link>.</p>;
  } else if (!hydrated) {
    body = <div className="min-h-[30vh]" aria-busy="true" />;
  } else if (!account) {
    body = (
      <div>
        <p className="m-0 mb-4 text-body text-muted">Sign in to manage your name, phone number and account.</p>
        <Button onClick={() => setAuthOpen(true)}>Sign in</Button>
      </div>
    );
  } else {
    body = (
      <AccountSettings
        account={account}
        prefs={<TripPrefsFields idPrefix="st" />}
        onSave={updateAccount}
        onLogout={logout}
        onDelete={() => setDeleteOpen(true)}
      />
    );
  }

  return (
    <Container className="py-10">
      <div className="max-w-[var(--container-read,720px)]">
        <p className={EYEBROW_LINE}>Account</p>
        <h1 className="text-h2 font-medium text-green m-0 mb-[0.3rem]">Account Settings</h1>
        <p className="text-body text-muted m-0 mb-[1.6rem]">Update your details and saved preferences.</p>
        {body}
      </div>
      <AuthSheet open={authOpen} onClose={() => setAuthOpen(false)} />
      <DeleteSheet open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={confirmDelete} />
    </Container>
  );
}
