import type { IDBPDatabase } from 'idb';

// types
import type { CommonParameters, VaultSchema } from '@/types';

interface PasswordVaultDecoratorParameters extends CommonParameters {
  password: string;
  vault: IDBPDatabase<VaultSchema>;
}

export default PasswordVaultDecoratorParameters;
