import type { FunctionComponent } from 'preact';
import type { PropsWithChildren } from 'preact/compat';
import { useCallback, useEffect, useState } from 'preact/hooks';

// contexts
import { AccountsContext } from '@/ui/contexts';

// decorators
import type { AccountStore } from '@/decorators';

// types
import type { Props } from './types';

const AccountsProvider: FunctionComponent<PropsWithChildren<Props>> = ({ accountsStore, children }) => {
  // states
  const [timestamp, setTimestamp] = useState<number>(0);
  const [state, setState] = useState<AccountStore>(accountsStore);
  // callbacks
  const onUpdate = useCallback(() => setTimestamp(Date.now()), [setTimestamp]);

  useEffect(() => {
    setState(accountsStore);
    onUpdate();
  }, [accountsStore]);

  return (
    <AccountsContext.Provider
      value={{
        onUpdate,
        state,
        timestamp,
      }}
    >
      {children}
    </AccountsContext.Provider>
  );
};

export default AccountsProvider;
