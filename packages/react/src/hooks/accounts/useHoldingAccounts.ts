import { type Account, AccountsUpdatedEvent, EventEnum } from '@kibisis/katavault-core';
import { useCallback, useContext, useEffect, useState } from 'react';

// contexts
import { KatavaultContext } from '@/contexts';

/**
 * Hook for getting the list of holding accounts stored in the vault.
 *
 * **NOTE:** Requires authentication.
 *
 * @returns {Account[]} The holding accounts in the wallet.
 */
export default function useHoldingAccounts(): Account[] {
  // contexts
  const { katavault } = useContext(KatavaultContext);
  // states
  const [holdingAccounts, setHoldingAccounts] = useState<Account[]>([]);
  // callbacks
  const fetchHoldingAccounts = useCallback(async () => {
    if (!katavault || !katavault.isAuthenticated()) {
      return;
    }

    setHoldingAccounts(await katavault.holdingAccounts());
  }, [setHoldingAccounts, katavault]);
  const listener = useCallback(
    async (event: AccountsUpdatedEvent) => {
      // if this event is not for this specific user, ignore it
      if (!katavault || katavault.username() !== event.detail.username) {
        return;
      }

      await fetchHoldingAccounts();
    },
    [fetchHoldingAccounts, katavault]
  );

  useEffect(() => {
    (async () => await fetchHoldingAccounts())();
  }, []);
  useEffect(() => {
    window.addEventListener(EventEnum.AccountsUpdated, listener);

    return () => window.removeEventListener(EventEnum.AccountsUpdated, listener);
  }, [listener]);

  return holdingAccounts;
}
