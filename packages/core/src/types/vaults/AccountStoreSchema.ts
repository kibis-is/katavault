// types
import type { AccountStoreItemWithPasskey, AccountStoreItemWithPassword } from '@/types';

type AccountStoreSchema = Record<string, AccountStoreItemWithPasskey | AccountStoreItemWithPassword>;

export default AccountStoreSchema;
