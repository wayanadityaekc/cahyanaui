'use client';

import { useAccount } from '@/state/AccountProvider';

/**
 * useAuth - thin read-model over the account context: who is signed in and
 * whether they have an upcoming trip. Keeps components from reaching into the
 * provider shape directly.
 */
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
