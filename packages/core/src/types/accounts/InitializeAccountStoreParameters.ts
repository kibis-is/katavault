import type { IDBPDatabase } from 'idb';

// types
import type { CommonParameters, VaultSchema } from '@/types';

interface InitializeAccountStoreParameters extends CommonParameters {
  vault: IDBPDatabase<VaultSchema>;
}

export default InitializeAccountStoreParameters;
