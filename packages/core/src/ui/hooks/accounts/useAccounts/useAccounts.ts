import { useCallback, useContext, useEffect, useState } from 'preact/hooks';

// contexts
import { AccountsContext } from '@/ui/contexts';

// enums
import { EventEnum } from '@/enums';

// types
import type { ConnectedAccountStoreItem, EphemeralAccountStoreItem } from '@/types';

export default function useAccounts(): (ConnectedAccountStoreItem | EphemeralAccountStoreItem)[] {
  // contexts
  const store = useContext(AccountsContext);
  // states
  const [accounts, setAccounts] = useState<(ConnectedAccountStoreItem | EphemeralAccountStoreItem)[]>([]);
  // callbacks
  const fetchAccounts = useCallback(async () => {
    if (!store) {
      return;
    }

    setAccounts(await store.accounts());
  }, [setAccounts, store]);

  useEffect(() => {
    if (!store) {
      return;
    }

    (async () => await fetchAccounts())();
  }, []);
  useEffect(() => {
    window.addEventListener(EventEnum.AccountsUpdated, fetchAccounts);

    return () => window.removeEventListener(EventEnum.AccountsUpdated, fetchAccounts);
  }, []);

  return accounts;
}
