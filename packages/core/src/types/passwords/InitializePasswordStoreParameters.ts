import type { IDBPDatabase } from 'idb';

// types
import type { CommonParameters, VaultSchema } from '@/types';

interface InitializePasswordStoreParameters extends CommonParameters {
  password: string;
  vault: IDBPDatabase<VaultSchema>;
}

export default InitializePasswordStoreParameters;
