import { createContext } from 'preact';

// decorators
import type { AccountStore } from '@/decorators';

// types
import type { ContextValue } from '@/ui/types';

const AccountsContext = createContext<ContextValue<AccountStore>>({
  onUpdate: null,
  state: null,
  timestamp: 0,
});

export default AccountsContext;
