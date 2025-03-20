import type { IDBPDatabase } from 'idb';

// types
import type { CommonParameters } from '@/types';
import type VaultSchemas from './VaultSchemas';

interface VaultParameters extends CommonParameters {
  db: IDBPDatabase<VaultSchemas>;
}

export default VaultParameters;
