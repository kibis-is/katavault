import type { IDBPDatabase } from 'idb';

// types
import type { CommonParameters, VaultSchema } from '@/types';

interface VaultDecoratorParameters extends CommonParameters {
  vault: IDBPDatabase<VaultSchema>;
}

export default VaultDecoratorParameters;
