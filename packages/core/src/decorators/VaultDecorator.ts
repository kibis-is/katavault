import { bytesToHex, hexToBytes, utf8ToBytes } from '@noble/hashes/utils';
import { type IDBPDatabase, openDB } from 'idb';

// constants
import { IDB_DB_NAME_PREFIX, IDB_ITEMS_STORE_NAME, IDB_PASSKEY_STORE_NAME } from '@/constants';

// types
import type {
  CreateVaultParameters,
  Logger,
  Passkey,
  PrivateKey,
  SerializedPrivateKey,
  VaultParameters,
  VaultSchemas,
} from '@/types';

export default class VaultDecorator {
  // public static variables
  public static readonly displayName = 'VaultDecorator';
  // private variables
  private readonly _db: IDBPDatabase<VaultSchemas>;
  private readonly _logger: Logger;

  private constructor({ db, logger }: VaultParameters) {
    this._db = db;
    this._logger = logger;
  }

  /**
   * public static methods
   */

  /**
   * Opens a connection to a vault. The vault to connect to is defined by the provided username and is named by:
   *
   * "kibisis_embedded_[hex(username)]"
   * @param {CreateVaultParameters} parameters - The user details.
   * @public
   * @static
   */
  public static async create({ logger, user }: CreateVaultParameters): Promise<VaultDecorator> {
    const __logPrefix = `${VaultDecorator.displayName}#create`;
    const vaultName = `${IDB_DB_NAME_PREFIX}_${bytesToHex(utf8ToBytes(user.username))}`;
    const db = await openDB<VaultSchemas>(vaultName, undefined, {
      upgrade: (_db, oldVersion, newVersion) => {
        // we are creating a new database
        if (oldVersion <= 0 && newVersion && newVersion > 0) {
          // create the stores
          _db.createObjectStore(IDB_PASSKEY_STORE_NAME);
          _db.createObjectStore(IDB_ITEMS_STORE_NAME);

          logger.debug(`${__logPrefix}: created new vault`);
        }
      },
    });

    logger.debug(`${__logPrefix}: opened vault "${vaultName}"`);

    return new VaultDecorator({
      db,
      logger,
    });
  }

  /**
   * public methods
   */

  /**
   * Clears all private keys and removes the passkey.
   * @public
   */
  public async clear(): Promise<void> {
    const __logPrefix = `${VaultDecorator.displayName}#clear`;

    await this._db.clear(IDB_PASSKEY_STORE_NAME);
    await this._db.clear(IDB_ITEMS_STORE_NAME);

    this._logger.debug(`${__logPrefix}: cleared vault`);
  }

  /**
   * Closes the connection to the indexedDB.
   * @public
   */
  public close(): void {
    this._db.close();
  }

  /**
   * Gets the vault items.
   * @returns {Promise<Map<string, PrivateKey>>} A promise that resolves to the vault private keys. The result will be a map
   * containing the keys referenced by the account's address.
   * @public
   */
  public async items(): Promise<Map<string, PrivateKey>> {
    const result = new Map<string, PrivateKey>();
    const transaction = this._db.transaction(IDB_ITEMS_STORE_NAME, 'readonly');
    const keys = await transaction.store.getAllKeys();
    let item: SerializedPrivateKey;

    for (const key of keys) {
      item = await transaction.store.get(key);
      result.set(key as string, {
        keyData: hexToBytes(item.keyData),
        name: item.name,
      });
    }

    return result;
  }

  /**
   * Gets the vault name.
   * @returns {string} The name of the vault.
   * @public
   */
  public name(): string {
    return this._db.name;
  }

  /**
   * Gets the vault passkey.
   * @returns {Promise<Passkey | null>} A promise that resolves to the vault passkey or null if the vault has not
   * been initialized.
   * @public
   */
  public async passkey(): Promise<Passkey | null> {
    const transaction = this._db.transaction(IDB_PASSKEY_STORE_NAME, 'readonly');
    const passkey: Passkey = {
      credentialID: await transaction.store.get('credentialID'),
      initializationVector: await transaction.store.get('initializationVector'),
      salt: await transaction.store.get('salt'),
      transports: await transaction.store.get('transports'),
    };

    if (
      typeof passkey.credentialID === 'undefined' ||
      typeof passkey.initializationVector === 'undefined' ||
      typeof passkey.salt === 'undefined' ||
      typeof passkey.transports === 'undefined'
    ) {
      return null;
    }

    return passkey;
  }

  public async setPasskey(value: Passkey): Promise<Passkey> {
    const transaction = this._db.transaction(IDB_PASSKEY_STORE_NAME, 'readwrite');
    const credentialID = (await transaction.store.get('credentialID')) || null;
    const initializationVector = (await transaction.store.get('initializationVector')) || null;
    const salt = (await transaction.store.get('salt')) || null;
    const transports = (await transaction.store.get('transports')) || null;

    credentialID
      ? await transaction.store.put(value.credentialID, 'credentialID')
      : await transaction.store.add(value.credentialID, 'credentialID');
    initializationVector
      ? await transaction.store.put(value.initializationVector, 'initializationVector')
      : await transaction.store.add(value.initializationVector, 'initializationVector');
    salt ? await transaction.store.put(value.salt, 'salt') : await transaction.store.add(value.salt, 'salt');
    transports
      ? await transaction.store.put(value.transports, 'transports')
      : await transaction.store.add(value.transports, 'transports');

    return value;
  }

  /**
   * Removes items from the vault.
   * @param {[string, ...string[]]} keys - A list of keys to remove.
   * @returns {Promise<string[]>} A promise that resolves to the list of removed keys.
   * @public
   */
  public async removeItems(keys: [string, ...string[]]): Promise<string[]> {
    const __logPrefix = `${VaultDecorator.displayName}#removeItems`;
    const removedKeys: string[] = [];
    const transaction = this._db.transaction(IDB_ITEMS_STORE_NAME, 'readwrite');
    let _key: IDBValidKey | null;

    for (const key of keys) {
      _key = (await transaction.store.getKey(key)) || null;

      if (_key) {
        await transaction.store.delete(key);

        removedKeys.push(key);
      }
    }

    return removedKeys;
  }

  /**
   * Upserts private keys into the database. If and of the item addresses already exist, they will be overwritten with the
   * new account. If any private keys don't exist, they will be added.
   * @param {Map<string, PrivateKey>} items - The private keys to insert and/or update.
   * @returns {Promise<Map<string, PrivateKey>>} A promise that resolves to the inserted and/or updated private keys.
   */
  public async upsertItems(items: Map<string, PrivateKey>): Promise<Map<string, PrivateKey>> {
    const __logPrefix = `${VaultDecorator.displayName}#upsertItems`;
    const transaction = this._db.transaction(IDB_ITEMS_STORE_NAME, 'readwrite');
    const keys = await transaction.store.getAllKeys();
    const itemsToAdd = items
      .entries()
      .filter(([key]) => !keys.some((value) => value === key))
      .toArray();
    const itemsToUpdate = items
      .entries()
      .filter(([key]) => keys.some((value) => value === key))
      .toArray();

    for (const [address, item] of itemsToAdd) {
      await transaction.store.add(
        {
          keyData: bytesToHex(item.keyData),
          name: item.name,
        },
        address
      );
    }

    for (const [address, item] of itemsToUpdate) {
      await transaction.store.put(
        {
          keyData: bytesToHex(item.keyData),
          name: item.name,
        },
        address
      );
    }

    this._logger.debug(
      `${__logPrefix}: added "${itemsToAdd.length}" and updated "${itemsToUpdate.length}" private keys`
    );

    return items;
  }

  /**
   * Gets the vault version.
   * @returns {number} The vault version.
   * @public
   */
  public version(): number {
    return this._db.version;
  }
}
