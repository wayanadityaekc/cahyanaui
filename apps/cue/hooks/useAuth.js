'use client';

import { useAccount } from '@/state/AccountProvider';

export default function useAuth() {
  const accountContext = useAccount();
  const account = accountContext && accountContext.account;
  return {
    ...accountContext,
    account,
    signedIn: !!account,
    name: (account && account.name) || '',
    email: (account && account.email) || '',
  };
}
