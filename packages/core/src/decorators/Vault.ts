import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import { type IDBPDatabase, openDB } from 'idb';

// constants
import { IDB_ITEMS_STORE_NAME, IDB_PASSKEY_STORE_NAME, IDB_VAULT_DB_NAME } from '@/constants';

// types
import type { Account, CommonParameters, Logger, Passkey, VaultParameters, VaultSchemas } from '@/types';

export default class Vault {
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

  public static async create({ logger }: CommonParameters): Promise<Vault> {
    const __logPrefix = `${Vault.name}#create`;
    const db = await openDB<VaultSchemas>(IDB_VAULT_DB_NAME, undefined, {
      upgrade: (_db, oldVersion, newVersion: number | null, transaction) => {
        // we are creating a new database
        if (oldVersion <= 0 && newVersion && newVersion > 0) {
          // create the stores
          _db.createObjectStore(IDB_PASSKEY_STORE_NAME);
          _db.createObjectStore(IDB_ITEMS_STORE_NAME);

          logger.debug(`${__logPrefix}: created new vault`);
        }
      },
    });

    logger.debug(`${__logPrefix}: opened vault with version "${db.version}"`);

    return new Vault({
      db,
      logger,
    });
  }

  /**
   * public methods
   */

  /**
   * Gets the vault items.
   * @returns {Promise<Map<string, Account>>} A promise that resolves to the vault accounts. The result will be a map
   * containing the keys referenced by the account's address.
   * @public
   */
  public async accounts(): Promise<Map<string, Account>> {
    const result = new Map<string, Account>();
    const transaction = this._db.transaction(IDB_ITEMS_STORE_NAME, 'readonly');
    let cursor = await transaction.store.openCursor();

    while (cursor && cursor.key && cursor.value) {
      result.set(cursor.key as string, {
        keyData: hexToBytes(cursor.value.keyData),
        name: cursor.value.name,
      });

      await cursor.continue();
    }

    return result;
  }

  public close(): void {
    this._db.close();
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
   * Upserts accounts into the database. If and of the item addresses already exist, they will be overwritten with the
   * new account. If any accounts don't exist, they will be added.
   * @param {Map<string, Account>} items - The accounts to insert and/or update.
   * @returns {Promise<Map<string, Account>>} A promise that resolves to the inserted and/or updated accounts.
   */
  public async upsertAccounts(items: Map<string, Account>): Promise<Map<string, Account>> {
    const __logPrefix = `${Vault.name}#upsertItems`;
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

    this._logger.debug(`${__logPrefix}: added "${itemsToAdd.length}" and updated "${itemsToUpdate.length}" accounts`);

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
