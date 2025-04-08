import type { Account } from '@kibisis/katavault-core';
import { useContext, useEffect, useState } from 'react';

// contexts
import { KatavaultContext } from '@/contexts';

/**
 * Hook for getting the accounts.
 * @returns {Account[]} The accounts in the wallet.
 */
export default function useAccounts(): Account[] {
  const { wallet, timestamp } = useContext(KatavaultContext);
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    if (!wallet) {
      return;
    }

    (async () => {
      setAccounts(await wallet.accounts());
    })();
  }, [timestamp]);

  return accounts;
}
