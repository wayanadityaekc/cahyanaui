'use client';

import { useAccount } from '@/state/AccountProvider';

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
