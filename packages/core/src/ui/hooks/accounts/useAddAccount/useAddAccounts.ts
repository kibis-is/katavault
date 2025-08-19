import { useContext } from 'preact/hooks';

// contexts
import { AccountsContext, UserContext } from '@/ui/contexts';

// events
import { AccountsUpdatedEvent } from '@/events';

// types
import type { ConnectedAccountStoreItem } from '@/types';

export default function useAddAccounts(): (accounts: ConnectedAccountStoreItem[]) => void {
  // contexts
  const store = useContext(AccountsContext);
  const username = useContext(UserContext);

  return (accounts: ConnectedAccountStoreItem[]) => {
    (async () => {
      if (!store || !username) {
        return;
      }

      await store.upsert(accounts);

      // emit an event for this user
      window.dispatchEvent(new AccountsUpdatedEvent(username));
    })();
  };
}
