// types
import type ConnectedAccountStoreItem from './ConnectedAccountStoreItem';
import type EphemeralAccountStoreItem from './EphemeralAccountStoreItem';

type WithAccountStoreItem<Item, AccountType = ConnectedAccountStoreItem | EphemeralAccountStoreItem> = Item &
  Record<'account', AccountType>;

export default WithAccountStoreItem;
