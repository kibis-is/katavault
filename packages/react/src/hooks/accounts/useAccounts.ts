import { type Account, AccountsUpdatedEvent, EventEnum } from '@kibisis/katavault-core';
import { useCallback, useContext, useEffect, useState } from 'react';

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
  // contexts
  const { katavault } = useContext(KatavaultContext);
  // states
  const [accounts, setAccounts] = useState<Account[]>([]);
  // callbacks
  const fetchAccounts = useCallback(async () => {
    if (!katavault || !katavault.isAuthenticated()) {
      return;
    }

    setAccounts(await katavault.accounts());
  }, [setAccounts, katavault]);
  const listener = useCallback(
    async (event: AccountsUpdatedEvent) => {
      // if this event is not for this specific user, ignore it
      if (!katavault || katavault.username() !== event.detail.username) {
        return;
      }

      await fetchAccounts();
    },
    [fetchAccounts, katavault]
  );

  useEffect(() => {
    (async () => await fetchAccounts())();
  }, []);
  useEffect(() => {
    window.addEventListener(EventEnum.AccountsUpdated, listener);

    return () => window.removeEventListener(EventEnum.AccountsUpdated, listener);
  }, [listener]);

  return accounts;
}
