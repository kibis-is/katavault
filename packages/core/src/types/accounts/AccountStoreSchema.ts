// types
import type ConnectedAccountStoreItem from './ConnectedAccountStoreItem';
import type EphemeralAccountStoreItem from './EphemeralAccountStoreItem';

type AccountStoreSchema = Record<string, ConnectedAccountStoreItem | EphemeralAccountStoreItem>;

export default AccountStoreSchema;
