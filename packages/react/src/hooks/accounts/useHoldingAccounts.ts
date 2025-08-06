import type { Account } from '@kibisis/katavault-core';
import { useContext, useEffect, useState } from 'react';

// contexts
import { KatavaultContext } from '@/contexts';

/**
 * Hook for getting the holding accounts.
 *
 * **NOTE:** Requires authentication.
 *
 * @returns {Account[]} The holding accounts in the wallet.
 */
export default function useHoldingAccounts(): Account[] {
  const { katavault, timestamp } = useContext(KatavaultContext);
  const [holdingAccounts, setHoldingAccounts] = useState<Account[]>([]);

  useEffect(() => {
    if (!katavault || !katavault.isAuthenticated()) {
      return;
    }

    (async () => {
      setHoldingAccounts(await katavault.holdingAccounts());
    })();
  }, [timestamp]);

  return holdingAccounts;
}
