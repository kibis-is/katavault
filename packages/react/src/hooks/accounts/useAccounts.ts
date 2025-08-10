import type { Account } from '@kibisis/katavault-core';
import { useContext, useEffect, useState } from 'react';

// contexts
import { KatavaultContext } from '@/contexts';

/**
 * Hook for getting the list of accounts stored in the vault.
 *
 * **NOTE:** Requires authentication.
 *
 * @returns {Account[]} The accounts in the vault.
 */
export default function useAccounts(): Account[] {
  const { katavault, timestamp } = useContext(KatavaultContext);
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    if (!katavault || !katavault.isAuthenticated()) {
      return;
    }

    (async () => {
      setAccounts(await katavault.accounts());
    })();
  }, [timestamp]);

  return accounts;
}
