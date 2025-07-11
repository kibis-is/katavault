// types
import type { AccountStoreSchema, ConfigStoreSchema, PasskeyStoreSchema, PasswordStoreSchema } from '@/types';

type VaultSchema = AccountStoreSchema | ConfigStoreSchema | PasskeyStoreSchema | PasswordStoreSchema;

export default VaultSchema;
