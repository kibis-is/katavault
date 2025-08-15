import { useContext } from 'preact/hooks';

// contexts
import { AccountsContext, AppContext } from '@/ui/contexts';

// events
import { AccountsUpdatedEvent } from '@/events';

// types
import type { ConnectedAccountStoreItem } from '@/types';

export default function useAddAccounts(): (accounts: ConnectedAccountStoreItem[]) => void {
  // contexts
  const store = useContext(AccountsContext);
  const { state } = useContext(AppContext);

  return (accounts: ConnectedAccountStoreItem[]) => {
    (async () => {
      if (!store || !state) {
        return;
      }

      await store.upsert(accounts);

      // emit an event for this user
      window.dispatchEvent(new AccountsUpdatedEvent(state.username));
    })();
  };
}
