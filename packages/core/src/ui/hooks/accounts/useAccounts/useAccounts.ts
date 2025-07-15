import { useContext, useEffect, useState } from 'preact/hooks';

// contexts
import { AccountsContext } from '@/ui/contexts';

// types
import type { ConnectedAccountStoreItem, EphemeralAccountStoreItem } from '@/types';

export default function useAccounts(): (ConnectedAccountStoreItem | EphemeralAccountStoreItem)[] {
  const { state, timestamp } = useContext(AccountsContext);
  const [accounts, setAccounts] = useState<(ConnectedAccountStoreItem | EphemeralAccountStoreItem)[]>([]);

  useEffect(() => {
    if (!state) {
      return;
    }

    (async () => {
      setAccounts(await state.accounts());
    })();
  }, [timestamp]);

  return accounts;
}
