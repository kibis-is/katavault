// types
import type { AccountStoreSchema, PasskeyStoreSchema, PasswordStoreSchema } from '@/types';

type VaultSchema = AccountStoreSchema | PasskeyStoreSchema | PasswordStoreSchema;

export default VaultSchema;
