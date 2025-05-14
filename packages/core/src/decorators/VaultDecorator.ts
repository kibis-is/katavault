import { type IDBPDatabase, openDB } from 'idb';

// constants
import { IDB_DB_NAME_PREFIX, IDB_ITEMS_STORE_NAME, IDB_PASSKEY_STORE_NAME } from '@/constants';

// types
import type {
  AuthenticationParameters,
  CreateVaultParameters,
  Logger,
  Passkey,
  AccountWithKeyData,
  SerializedPrivateKey,
  VaultParameters,
  VaultSchema,
} from '@/types';

// utilities
import { bytesToHex, hexToBytes, utf8ToBytes } from '@/utilities';

export default class VaultDecorator {
  // public static variables
  public static readonly displayName = 'VaultDecorator';
  // private variables
  private readonly _auth: AuthenticationParameters;
  private readonly _db: IDBPDatabase<VaultSchema>;
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
   * "katavault_[hex(username)]"
   * @param {CreateVaultParameters} parameters - The user details.
   * @public
   * @static
   */
  public static async create({ auth, logger }: CreateVaultParameters): Promise<VaultDecorator> {
    const __logPrefix = `${VaultDecorator.displayName}#create`;
    const vaultName = `${IDB_DB_NAME_PREFIX}_${bytesToHex(utf8ToBytes(user.username))}`;
    const db = await openDB<VaultSchema>(vaultName, undefined, {
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
   * Gets a vault private key by address. If no item exists, null is returned.
   * @param {string} address - THe address of the private key.
   * @returns {Promise<AccountWithKeyData | null>} A promise that resolves to the private key or null if it doesn't exist.
   * @public
   */
  public async itemByAddress(address: string): Promise<AccountWithKeyData | null> {
    const item: SerializedPrivateKey | null = (await this._db.get(IDB_ITEMS_STORE_NAME, address)) || null;

    if (!item) {
      return null;
    }

    return {
      ...item,
      keyData: hexToBytes(item.keyData),
    };
  }

  /**
   * Gets the vault private key.
   * @returns {Promise<Map<string, AccountWithKeyData>>} A promise that resolves to the vault private keys. The result will be a map
   * containing the keys referenced by the account's address.
   * @public
   */
  public async items(): Promise<Map<string, AccountWithKeyData>> {
    const result = new Map<string, AccountWithKeyData>();
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
   * @returns {Promise<PasskeyStoreSchema | null>} A promise that resolves to the vault passkey or null if the vault has not
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
   * Removes a list of private keys from the vault.
   * @param {[string, ...string[]]} addresses - A list of addresses to remove.
   * @returns {Promise<string[]>} A promise that resolves to the list of removed private keys.
   * @public
   */
  public async removeItems(addresses: [string, ...string[]]): Promise<string[]> {
    const removedKeys: string[] = [];
    const transaction = this._db.transaction(IDB_ITEMS_STORE_NAME, 'readwrite');
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
   * Upserts private keys into the database. If and of the item addresses already exist, they will be overwritten with the
   * new account. If any private keys don't exist, they will be added.
   * @param {Map<string, AccountWithKeyData>} items - The private keys to insert and/or update.
   * @returns {Promise<Map<string, AccountWithKeyData>>} A promise that resolves to the inserted and/or updated private keys.
   * @public
   */
  public async upsertItems(items: Map<string, AccountWithKeyData>): Promise<Map<string, AccountWithKeyData>> {
    const __logPrefix = `${VaultDecorator.displayName}#upsertItems`;
    const transaction = this._db.transaction(IDB_ITEMS_STORE_NAME, 'readwrite');
    const addresses = await transaction.store.getAllKeys();
    const itemsToAdd = Array.from(items.entries()).filter(([key]) => !addresses.some((value) => value === key));
    const itemsToUpdate = Array.from(items.entries()).filter(([key]) => addresses.some((value) => value === key));

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
