import { createContext } from 'preact';

// decorators
import type { AccountStore } from '@/decorators';

const AccountsContext = createContext<AccountStore | null>(null);

export default AccountsContext;
