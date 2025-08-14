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
  const listener = useCallback(async () => {
    if (!store) {
      return;
    }

    setAccounts(await store.accounts());
  }, [setAccounts, store]);

  useEffect(() => {
    window.addEventListener(EventEnum.AccountsUpdated, listener);

    return () => window.removeEventListener(EventEnum.AccountsUpdated, listener);
  }, []);

  return accounts;
}
