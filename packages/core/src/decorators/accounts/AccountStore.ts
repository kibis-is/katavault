// constants
import { IDB_ACCOUNTS_STORE_NAME } from '@/constants';

// decorators
import BaseStore from '@/decorators/_base/BaseStore';

// types
import type { AccountStoreItemWithPasskey, AccountStoreItemWithPassword, StoreParameters } from '@/types';

export default class AccountStore extends BaseStore {
  // public static variables
  public static readonly displayName = 'AccountStore';

  public constructor(params: StoreParameters) {
    super(params);
  }

  /**
   * public methods
   */

  /**
   * Gets an account by address. If no item exists, null is returned.
   * @param {string} address - The address of the private key.
   * @returns {Promise<AccountStoreItemWithPasskey | AccountStoreItemWithPassword | null>} A promise that resolves to
   * the account or null if it doesn't exist.
   * @public
   */
  public async accountByAddress<Item = AccountStoreItemWithPasskey | AccountStoreItemWithPassword>(
    address: string
  ): Promise<Item | null> {
    const item: AccountStoreItemWithPasskey | AccountStoreItemWithPassword | null =
      (await this._vault.get(IDB_ACCOUNTS_STORE_NAME, address)) || null;

    if (!item) {
      return null;
    }

    return item as Item;
  }

  /**
   * Gets all accounts in the vault.
   * @returns {Promise<Map<string, AccountWithKeyData>>} A promise that resolves to all accounts. The result will be a map
   * containing the keys referenced by the account's address.
   * @public
   */
  public async accounts<Item = AccountStoreItemWithPasskey | AccountStoreItemWithPassword>(): Promise<Item[]> {
    const transaction = this._vault.transaction(IDB_ACCOUNTS_STORE_NAME, 'readonly');
    const keys = await transaction.store.getAllKeys();
    const results: (AccountStoreItemWithPasskey | AccountStoreItemWithPassword)[] = [];
    let item: AccountStoreItemWithPasskey | AccountStoreItemWithPassword;

    for (const key of keys) {
      item = await transaction.store.get(key);

      results.push(item);
    }

    return results as Item[];
  }

  /**
   * Removes a list of accounts via a set of addresses.
   * @param {[string, ...string[]]} addresses - A list of addresses to remove.
   * @returns {Promise<string[]>} A promise that resolves to the list of the removed accounts.
   * @public
   */
  public async remove(addresses: [string, ...string[]]): Promise<string[]> {
    const removedKeys: string[] = [];
    const transaction = this._vault.transaction(IDB_ACCOUNTS_STORE_NAME, 'readwrite');
    let _key: IDBValidKey | null;

    for (const address of addresses) {
      _key = (await transaction.store.getKey(address)) || null;

      if (_key) {
        await transaction.store.delete(address);

        removedKeys.push(address);
      }
    }

    return removedKeys;
  }

  /**
   * Upserts accounts into the database. If any of the item addresses already exist, they will be overwritten with the
   * new account. If any of the accounts don't exist, they will be added.
   * @param {(AccountStoreItemWithPasskey | AccountStoreItemWithPassword)[]} items - The accounts to insert and/or update.
   * @returns {Promise<(AccountStoreItemWithPasskey | AccountStoreItemWithPassword)[]>} A promise that resolves to the inserted and/or updated accounts.
   * @public
   */
  public async upsert(
    items: (AccountStoreItemWithPasskey | AccountStoreItemWithPassword)[]
  ): Promise<(AccountStoreItemWithPasskey | AccountStoreItemWithPassword)[]> {
    const __logPrefix = `${AccountStore.displayName}#upsert`;
    const transaction = this._vault.transaction(IDB_ACCOUNTS_STORE_NAME, 'readwrite');
    const addresses = await transaction.store.getAllKeys();
    const itemsToAdd = items.filter(({ address }) => !addresses.some((value) => value === address));
    const itemsToUpdate = items.filter(({ address }) => addresses.some((value) => value === address));

    for (const item of itemsToAdd) {
      await transaction.store.add(item, item.address);
    }

    for (const item of itemsToUpdate) {
      await transaction.store.put(item, item.address);
    }

    this._logger.debug(`${__logPrefix}: added "${itemsToAdd.length}" and updated "${itemsToUpdate.length}" accounts`);

    return items;
  }
}
