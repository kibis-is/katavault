import type { IDBPDatabase } from 'idb';

// types
import { ClientInformation, CommonParameters, UserInformation, type VaultSchema } from '@/types';

interface InitializePasskeyStoreParameters extends CommonParameters {
  client: ClientInformation;
  user: UserInformation;
  vault: IDBPDatabase<VaultSchema>;
}

export default InitializePasskeyStoreParameters;
