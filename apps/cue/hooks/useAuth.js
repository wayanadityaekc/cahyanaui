'use client';

import { useAccount } from '@/state/AccountProvider';

// Thin read-model over the account context: signed-in flag, name and email.
export default function useAuth() {
  const ctx = useAccount();
  const account = ctx && ctx.account;
  return {
    ...ctx,
    account,
    signedIn: !!account,
    name: (account && account.name) || '',
    email: (account && account.email) || '',
  };
}
