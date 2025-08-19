import type { FunctionComponent } from 'preact';
import type { PropsWithChildren } from 'preact/compat';
import { useEffect, useState } from 'preact/hooks';

// contexts
import { AccountsContext } from '@/ui/contexts';

// decorators
import type { AccountStore } from '@/decorators';

// types
import type { Props } from './types';

const AccountsProvider: FunctionComponent<PropsWithChildren<Props>> = ({ accountsStore, children }) => {
  // states
  const [value, setValue] = useState<AccountStore>(accountsStore);

  useEffect(() => {
    setValue(accountsStore);
  }, [accountsStore]);

  return (
    <AccountsContext.Provider value={value}>
      {children}
    </AccountsContext.Provider>
  );
};

export default AccountsProvider;
