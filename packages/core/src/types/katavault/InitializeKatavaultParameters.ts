import type { IDBPDatabase } from 'idb';

// types
import type { AuthenticationStore, CommonParameters, UserInformation, VaultSchema } from '@/types';

interface InitializeKatavaultParameters extends CommonParameters {
  authenticationStore: AuthenticationStore;
  user: UserInformation;
  vault: IDBPDatabase<VaultSchema>;
}

export default InitializeKatavaultParameters;
