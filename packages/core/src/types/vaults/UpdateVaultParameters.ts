import type { IDBPDatabase } from 'idb';

// types
import type { CommonParameters, VaultSchema } from '@/types';

interface UpdateVaultParameters extends CommonParameters {
  database: IDBPDatabase<VaultSchema>;
  oldVersion: number;
  newVersion: number | null;
}

export default UpdateVaultParameters;
