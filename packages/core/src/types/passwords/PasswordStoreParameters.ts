import type { IDBPDatabase } from 'idb';

// types
import type { CommonParameters, VaultSchema } from '@/types';

interface PasswordStoreParameters extends CommonParameters {
  password: string;
  vault: IDBPDatabase<VaultSchema>;
}

export default PasswordStoreParameters;
