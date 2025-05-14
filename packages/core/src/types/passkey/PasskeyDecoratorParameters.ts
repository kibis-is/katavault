import type { IDBPDatabase } from 'idb';

// types
import type { CommonParameters, VaultSchema } from '@/types';

interface PasskeyDecoratorParameters extends CommonParameters {
  keyMaterial: Uint8Array;
  vault: IDBPDatabase<VaultSchema>;
}

export default PasskeyDecoratorParameters;
