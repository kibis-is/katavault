import type { IDBPDatabase } from 'idb';

// types
import type { CommonParameters, VaultSchema } from '@/types';

interface StoreParameters extends CommonParameters {
  vault: IDBPDatabase<VaultSchema>;
}

export default StoreParameters;
