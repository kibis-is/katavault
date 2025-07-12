// types
import type { EphemeralAccountStoreItemWithPasskey, EphemeralAccountStoreItemWithPassword } from '@/types';

type EphemeralAccountStoreSchema = Record<
  string,
  EphemeralAccountStoreItemWithPasskey | EphemeralAccountStoreItemWithPassword
>;

export default EphemeralAccountStoreSchema;
