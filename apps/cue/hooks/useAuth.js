'use client';

import { useAccount } from '@/state/AccountProvider';

export default function useAuth() {
  const accountItem = useAccount();
  const account = accountItem && accountItem.account;
  return {
    ...accountItem,
    account,
    signedIn: !!account,
    name: (account && account.name) || '',
    email: (account && account.email) || '',
  };
}
