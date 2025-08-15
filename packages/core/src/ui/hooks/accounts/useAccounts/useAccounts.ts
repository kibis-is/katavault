import { useCallback, useContext, useEffect, useState } from 'preact/hooks';

// contexts
import { AccountsContext, UserContext } from '@/ui/contexts';

// enums
import { EventEnum } from '@/enums';

// events
import { AccountsUpdatedEvent } from '@/events';

// types
import type { ConnectedAccountStoreItem, EphemeralAccountStoreItem } from '@/types';

export default function useAccounts(): (ConnectedAccountStoreItem | EphemeralAccountStoreItem)[] {
  // contexts
  const store = useContext(AccountsContext);
  const username = useContext(UserContext);
  // states
  const [value, setValue] = useState<(ConnectedAccountStoreItem | EphemeralAccountStoreItem)[]>([]);
  // callbacks
  const fetchAccounts = useCallback(async () => {
    if (!store) {
      return;
    }

    setValue(await store.accounts());
  }, [setValue, store]);
  const listener = useCallback(
    async (event: AccountsUpdatedEvent) => {
      // if this event is not for this specific user, ignore it
      if (!username || username !== event.detail.username) {
        return;
      }

      await fetchAccounts();
    },
    [fetchAccounts, username]
  );

  useEffect(() => {
    (async () => await fetchAccounts())();
  }, []);
  useEffect(() => {
    window.addEventListener(EventEnum.AccountsUpdated, listener);

    return () => window.removeEventListener(EventEnum.AccountsUpdated, listener);
  }, [listener]);

  return value;
}
