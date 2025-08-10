// constants
import { IDB_ACCOUNTS_STORE_NAME } from '@/constants';

// decorators
import BaseStore from '@/decorators/_base/BaseStore';

// types
import type { ConnectedAccountStoreItem, EphemeralAccountStoreItem, StoreParameters } from '@/types';

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
   * Gets an account by public key. If no item exists, null is returned.
   * @param {string} key - The public key, encoded with base58.
   * @returns {Promise<ConnectedAccountStoreItem | EphemeralAccountStoreItem | null>} A promise that resolves to
   * the account or null if it doesn't exist.
   * @public
   */
  public async accountByKey<Item = ConnectedAccountStoreItem | EphemeralAccountStoreItem>(
    key: string
  ): Promise<Item | null> {
    const item: ConnectedAccountStoreItem | EphemeralAccountStoreItem | null =
      (await this._vault.get(IDB_ACCOUNTS_STORE_NAME, key)) || null;

    if (!item) {
      return null;
    }

    return item as Item;
  }

  /**
   * Gets all accounts in the store.
   * @returns {Promise<(ConnectedAccountStoreItem | EphemeralAccountStoreItem)[]>} A promise that
   * resolves to all accounts.
   * @public
   */
  public async accounts<Item = ConnectedAccountStoreItem | EphemeralAccountStoreItem>(): Promise<Item[]> {
    const transaction = this._vault.transaction(IDB_ACCOUNTS_STORE_NAME, 'readonly');
    const keys = await transaction.store.getAllKeys();
    const results: (ConnectedAccountStoreItem | EphemeralAccountStoreItem)[] = [];
    let item: ConnectedAccountStoreItem | EphemeralAccountStoreItem;

    for (const key of keys) {
      item = await transaction.store.get(key);

      results.push(item);
    }

    return results as Item[];
  }

  /**
   * Removes a list of accounts via a set of base58 encoded public keys.
   * @param {[string, ...string[]]} keys - A list of base58 encoded public keys to remove.
   * @returns {Promise<string[]>} A promise that resolves to the list of the removed accounts.
   * @public
   */
  public async remove(keys: [string, ...string[]]): Promise<string[]> {
    const removedKeys: string[] = [];
    const transaction = this._vault.transaction(IDB_ACCOUNTS_STORE_NAME, 'readwrite');
    let dbKey: IDBValidKey | null;

    for (const key of keys) {
      dbKey = (await transaction.store.getKey(key)) || null;

      if (dbKey) {
        await transaction.store.delete(key);

        removedKeys.push(key);
      }
    }

    return removedKeys;
  }

  /**
   * Upserts accounts into the database. If any of the public keys already exist, they will be overwritten with the new
   * account. If any of the accounts don't exist, they will be added.
   * @param {(ConnectedAccountStoreItem | EphemeralAccountStoreItem)[]} items - The accounts to
   * insert and/or update.
   * @returns {Promise<(ConnectedAccountStoreItem | EphemeralAccountStoreItem)[]>} A promise that
   * resolves to the inserted and/or updated accounts.
   * @public
   */
  public async upsert(
    items: (ConnectedAccountStoreItem | EphemeralAccountStoreItem)[]
  ): Promise<(ConnectedAccountStoreItem | EphemeralAccountStoreItem)[]> {
    const __logPrefix = `${AccountStore.displayName}#upsert`;
    const transaction = this._vault.transaction(IDB_ACCOUNTS_STORE_NAME, 'readwrite');
    const keys = await transaction.store.getAllKeys();
    const itemsToAdd = items.filter(({ key }) => !keys.some((value) => value === key));
    const itemsToUpdate = items.filter(({ key }) => keys.some((value) => value === key));

    for (const item of itemsToAdd) {
      await transaction.store.add(item, item.key);
    }

    for (const item of itemsToUpdate) {
      await transaction.store.put(item, item.key);
    }

    this._logger.debug(`${__logPrefix}: added "${itemsToAdd.length}" and updated "${itemsToUpdate.length}" accounts`);

    return items;
  }
}
