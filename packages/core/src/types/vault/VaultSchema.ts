// types
import type { AccountStoreSchema, PasskeyStoreSchema, PasswordStoreSchema, SettingsStoreSchema } from '@/types';

type VaultSchema = AccountStoreSchema | PasskeyStoreSchema | PasswordStoreSchema | SettingsStoreSchema;

export default VaultSchema;
