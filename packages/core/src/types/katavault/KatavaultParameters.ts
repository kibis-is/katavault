import type { IDBPDatabase } from 'idb';

// decorators
import { AccountStore } from '@/decorators';

// types
import type { AuthenticationStore, CommonParameters, UserInformation, VaultSchema } from '@/types';

interface KatavaultParameters extends CommonParameters {
  accountStore: AccountStore;
  authenticationStore: AuthenticationStore;
  user: UserInformation;
  vault: IDBPDatabase<VaultSchema>;
}

export default KatavaultParameters;
