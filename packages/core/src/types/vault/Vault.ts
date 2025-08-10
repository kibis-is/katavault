import type { IDBPDatabase } from 'idb';

// types
import type VaultSchema from './VaultSchema';

type Vault = IDBPDatabase<VaultSchema>;

export default Vault;
