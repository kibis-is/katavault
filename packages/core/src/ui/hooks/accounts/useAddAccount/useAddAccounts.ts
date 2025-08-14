import { useContext } from 'preact/hooks';

// contexts
import { AccountsContext } from '@/ui/contexts';

// events
import { AccountsUpdatedEvent } from '@/events';

// types
import type { ConnectedAccountStoreItem } from '@/types';

export default function useAddAccounts(): (accounts: ConnectedAccountStoreItem[]) => void {
  // contexts
  const store = useContext(AccountsContext);

  return (accounts: ConnectedAccountStoreItem[]) => {
    (async () => {
      if (!store) {
        return;
      }

      await store.upsert(accounts);

      // emit an event
      window.dispatchEvent(new AccountsUpdatedEvent());
    })();
  };
}
