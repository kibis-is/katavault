// types
import type ConnectedAccountStoreItem from './ConnectedAccountStoreItem';
import type EphemeralAccountStoreItemWithDecryptedKeyData from './EphemeralAccountStoreItemWithDecryptedKeyData';

type WithAccountStoreItem<
  Item,
  AccountType = ConnectedAccountStoreItem | EphemeralAccountStoreItemWithDecryptedKeyData,
> = Item & Record<'account', AccountType>;

export default WithAccountStoreItem;
