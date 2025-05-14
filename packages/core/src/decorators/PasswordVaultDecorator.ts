import { decode as decodeUtf8, encode as encodeUtf8 } from '@stablelib/utf8';
import scrypt from 'scrypt-async';
import { sha512 } from '@noble/hashes/sha512';
import { randomBytes } from '@noble/hashes/utils';
import { type IDBPDatabase, openDB } from 'idb';
import { secretbox } from 'tweetnacl';

// constants
import { IDB_DB_NAME, IDB_PASSWORD_STORE_NAME } from '@/constants';

// decorators
import { BaseVaultDecorator } from '@/decorators';

// errors
import { EncryptionError, DecryptionError, FailedToInitializeError } from '@/errors';

// types
import type {
  BaseAuthenticationDecorator,
  CreateDerivedKeyParameters,
  InitializePasswordDecoratorParameters,
  PasswordDecoratorParameters,
  PasswordStoreSchema,
  VaultSchema,
} from '@/types';

// utilities
import { bytesToHex, hexToBytes, updateVault } from '@/utilities';

export default class PasswordVaultDecorator
  extends BaseVaultDecorator<PasswordStoreSchema>
  implements BaseAuthenticationDecorator
{
  // private static variables
  private static readonly _challenge = 'Katavault rules!';
  private static readonly _saltByteSize = 64; // 64-bytes
  // public static variables
  public static readonly displayName = 'PasswordDecorator';
  // private variables
  private readonly _password: string;
  private readonly _vault: IDBPDatabase<VaultSchema>;

  private constructor({ password, vault, ...commonParameters }: PasswordDecoratorParameters) {
    super(commonParameters);

    this._password = password;
    this._vault = vault;
  }

  /**
   * private static methods
   */

  /**
   * Generates a hashed key derivation using for a password using a salt.
   * @param {CreateDerivedKeyParameters} params - The password and the salt.
   * @returns {Promise<Uint8Array>} a promise that resolves to the derived encryption key.
   * @private
   * @static
   */
  private static _createDerivedKeyFromPassword({ password, salt }: CreateDerivedKeyParameters): Promise<Uint8Array> {
    return new Promise<Uint8Array>((resolve) => {
      const hashedSecret = sha512(password);

      scrypt(
        hashedSecret,
        salt,
        {
          N: 16384, // cpu/memory cost parameter (must be power of two; alternatively, you can specify logN where N = 2^logN).
          r: 8, // block size parameter
          p: 1, // parallelization parameter
          dkLen: secretbox.keyLength, // derived key length
          encoding: 'binary',
        },
        (derivedKey: Uint8Array) => resolve(derivedKey)
      );
    });
  }

  /**
   * public static methods
   */

  public static async initialize({
    logger,
    password,
  }: InitializePasswordDecoratorParameters): Promise<PasswordVaultDecorator> {
    const __logPrefix = `${PasswordVaultDecorator.displayName}#initialize`;
    const vault = await openDB<VaultSchema>(IDB_DB_NAME, undefined, {
      upgrade: (_db, oldVersion, newVersion) => {
        updateVault({
          database: _db,
          logger,
          newVersion,
          oldVersion,
        });
      },
    });
    const passwordDecorator = new PasswordVaultDecorator({
      logger,
      password,
      vault,
    });
    const store = await passwordDecorator.store();
    let challenge: string;
    let isVerified: boolean;

    // if the store exists, ensure the password is correct
    if (store) {
      logger.debug(`${__logPrefix}: password store exists`);

      isVerified = await passwordDecorator.verify();

      if (!isVerified) {
        throw new FailedToInitializeError('incorrect password');
      }
    }

    // if no store exists, create a new one
    if (!store) {
      logger.debug(`${__logPrefix}: password store does not exist, creating a new one`);

      challenge = bytesToHex(await passwordDecorator.encryptBytes(encodeUtf8(PasswordVaultDecorator._challenge)));

      await passwordDecorator.setStore({
        challenge,
        lastUsedAt: Date.now().toString(),
      });
    }

    return passwordDecorator;
  }

  /**
   * public methods
   */

  /**
   * Clears the password store.
   * @public
   */
  public async clear(): Promise<void> {
    const __logPrefix = `${PasswordVaultDecorator.displayName}#clear`;

    await this._vault.clear(IDB_PASSWORD_STORE_NAME);

    this._logger.debug(`${__logPrefix}: cleared password store`);
  }

  /**
   * Closes the connection to the indexedDB.
   * @public
   */
  public close(): void {
    this._vault.close();
  }

  /**
   * Decrypts some previously encrypted bytes using the password.
   * @param {Uint8Array} bytes - The encrypted bytes.
   * @returns {Promise<Uint8Array>} A promise that resolves to the decrypted bytes.
   * @public
   */
  public async decryptBytes(bytes: Uint8Array): Promise<Uint8Array> {
    const __logPrefix = `${PasswordVaultDecorator.displayName}#decryptBytes`;
    const [nonce, salt, encryptedBytes] = [
      bytes.slice(0, secretbox.nonceLength),
      bytes.slice(secretbox.nonceLength, secretbox.nonceLength + PasswordVaultDecorator._saltByteSize),
      bytes.slice(secretbox.nonceLength + PasswordVaultDecorator._saltByteSize),
    ];
    let _error: string;
    let encryptionKey: Uint8Array;
    let decryptedBytes: Uint8Array | null;

    if (!nonce || nonce.byteLength !== secretbox.nonceLength) {
      throw new DecryptionError('invalid nonce');
    }

    if (!salt || salt.byteLength !== PasswordVaultDecorator._saltByteSize) {
      throw new DecryptionError('invalid salt');
    }

    encryptionKey = await PasswordVaultDecorator._createDerivedKeyFromPassword({
      password: encodeUtf8(this._password),
      salt,
    });
    decryptedBytes = secretbox.open(encryptedBytes, nonce, encryptionKey);

    if (!decryptedBytes) {
      _error = 'failed to decrypt bytes using password';

      this._logger.debug(`${__logPrefix}: ${_error}`);

      throw new DecryptionError(_error);
    }

    return decryptedBytes;
  }

  /**
   * Encrypts some arbitrary bytes using the password. This function uses the xsalsa20-poly1305
   * algorithm to encrypt the bytes.
   * @param {Uint8Array} bytes - The bytes to encrypt.
   * @returns {Promise<Uint8Array>} A promise that resolves to the encrypted bytes.
   * @public
   */
  public async encryptBytes(bytes: Uint8Array): Promise<Uint8Array> {
    const __logPrefix = `${PasswordVaultDecorator.displayName}#encryptBytes`;
    const salt = randomBytes(PasswordVaultDecorator._saltByteSize);
    const encryptionKey = await PasswordVaultDecorator._createDerivedKeyFromPassword({
      password: encodeUtf8(this._password),
      salt,
    });
    const nonce = randomBytes(secretbox.nonceLength);
    let encryptedBytes: Uint8Array;
    let buffer: Uint8Array;

    try {
      encryptedBytes = secretbox(bytes, nonce, encryptionKey);
    } catch (error) {
      this._logger.error(`${__logPrefix}:`, error);

      throw new EncryptionError(error.message);
    }

    buffer = new Uint8Array(nonce.length + salt.length + encryptedBytes.length);

    buffer.set(nonce, 0);
    buffer.set(salt, nonce.length);
    buffer.set(new Uint8Array(encryptedBytes), nonce.length + salt.length);

    return buffer;
  }

  /**
   * Gets the hashed password.
   * @returns {Uint8Array} The SHA-512 hash of the password.
   * @public
   */
  public hash(): Uint8Array {
    return sha512(encodeUtf8(this._password));
  }

  public async setStore(value: PasswordStoreSchema): Promise<PasswordStoreSchema> {
    const transaction = this._vault.transaction(IDB_PASSWORD_STORE_NAME, 'readwrite');
    const challenge = (await transaction.store.get('challenge')) || null;
    const lastUsedAt = (await transaction.store.get('lastUsedAt')) || null;

    challenge
      ? await transaction.store.put(value.challenge, 'challenge')
      : await transaction.store.add(value.challenge, 'challenge');
    lastUsedAt
      ? await transaction.store.put(value.lastUsedAt, 'lastUsedAt')
      : await transaction.store.add(value.lastUsedAt, 'lastUsedAt');

    return value;
  }

  /**
   * Gets the store.
   * @returns {Promise<PasswordStoreSchema | null>} A promise that resolves to the store or null if no store exists.
   * @public
   */
  public async store(): Promise<PasswordStoreSchema | null> {
    const transaction = this._vault.transaction(IDB_PASSWORD_STORE_NAME, 'readonly');
    const store: PasswordStoreSchema = {
      challenge: await transaction.store.get('challenge'),
      lastUsedAt: await transaction.store.get('lastUsedAt'),
    };

    if (typeof store.challenge === 'undefined' || typeof store.lastUsedAt === 'undefined') {
      return null;
    }

    return store;
  }

  /**
   * Verifies that the password is valid.
   * @returns {Promise<boolean>} A promise that resolves to true if the password successfully decrypts the challenge,
   * or false otherwise.
   * @public
   */
  public async verify(): Promise<boolean> {
    const store = await this.store();
    let decryptedChallenge: Uint8Array;

    if (!store) {
      return false;
    }

    try {
      decryptedChallenge = await this.decryptBytes(hexToBytes(store.challenge));

      return decodeUtf8(decryptedChallenge) === PasswordVaultDecorator._challenge;
    } catch (_) {
      return false;
    }
  }
}
