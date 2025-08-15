import type { FunctionComponent } from 'preact';
import type { PropsWithChildren } from 'preact/compat';
import { useEffect, useState } from 'preact/hooks';

// contexts
import { UserContext } from '@/ui/contexts';

// types
import type { Props } from './types';

const UserProvider: FunctionComponent<PropsWithChildren<Props>> = ({ children, username }) => {
  // states
  const [value, setValue] = useState<string>(username);

  useEffect(() => {
    setValue(username);
  }, [username]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
