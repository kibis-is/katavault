// types
import type { EphemeralAccountStoreSchema, ConfigStoreSchema, PasskeyStoreSchema, PasswordStoreSchema } from '@/types';

type VaultSchema = EphemeralAccountStoreSchema | ConfigStoreSchema | PasskeyStoreSchema | PasswordStoreSchema;

export default VaultSchema;
