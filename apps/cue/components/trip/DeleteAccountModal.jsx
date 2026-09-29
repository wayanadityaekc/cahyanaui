'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { BTN_SM } from '@/components/ui/btnClasses';
import { REFMSG_ERR } from '@/components/ui/modalClasses';

// Delete-account confirm in the shared Modal; BTN_DANGER is local, move it to btnClasses if reused.
const BTN_DANGER = `inline-flex ${BTN_SM} font-body border-none text-white bg-err cursor-pointer hover:brightness-90`;
const BTN_GHOST = `inline-flex ${BTN_SM} font-body [border:1px_solid_var(--line)] bg-white text-green cursor-pointer hover:bg-cream`;

export default function DeleteAccountModal({ open, onClose, onConfirm }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  async function confirm() {
    setBusy(true);
    setMsg('');
    const res = await onConfirm();
    setBusy(false);
    if (!res || !res.ok) setMsg((res && res.error) || 'Could not delete your account. Please try again.');
  }

  return (
    <Modal open={open} onClose={busy ? () => {} : onClose} title="Delete your account?">
      <p className="m-0 mb-3 text-body text-green leading-[var(--lh-body)]">
        This removes your saved details and signs you out everywhere. It does not undo anything you have already
        done on the site:
      </p>
      <ul className="m-0 mb-4 pl-5 text-body text-green leading-[var(--lh-body)] [&>li]:mb-2">
        <li>Your past and upcoming <b>bookings stay on record</b> - we still owe you those trips, and our own
          records of what was booked and paid don&apos;t disappear with the account.</li>
        <li>Any <b>reviews you wrote stay published, with your name exactly as it appears now.</b> Deleting the
          account does not pull them down or rename them.</li>
      </ul>
      <p className="m-0 mb-5 text-body text-green leading-[var(--lh-body)]">
        If you book again later, it starts as a new account - we won&apos;t reconnect it to this one.
      </p>
      {msg && <small role="alert" className={`${REFMSG_ERR} block mb-3`}>{msg}</small>}
      <div className="flex gap-2 max-[480px]:flex-col">
        <button type="button" className={BTN_GHOST} onClick={onClose} disabled={busy}>Keep my account</button>
        <button type="button" className={BTN_DANGER} onClick={confirm} disabled={busy}>
          {busy ? 'Deleting...' : 'Delete my account'}
        </button>
      </div>
    </Modal>
  );
}
