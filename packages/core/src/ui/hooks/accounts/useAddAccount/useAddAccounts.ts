import { useContext } from 'preact/hooks';

// contexts
import { AccountsContext } from '@/ui/contexts';

// types
import type { ConnectedAccountStoreItem } from '@/types';

export default function useAddAccounts(): (accounts: ConnectedAccountStoreItem[]) => void {
  // contexts
  const { onUpdate, state } = useContext(AccountsContext);

  return (accounts: ConnectedAccountStoreItem[]) => {
    (async () => {
      if (!state) {
        return;
      }

      await state.upsert(accounts);
      onUpdate?.();
    })();
  };
}
