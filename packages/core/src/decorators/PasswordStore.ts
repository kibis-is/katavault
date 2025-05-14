import { decode as decodeUtf8, encode as encodeUtf8 } from '@stablelib/utf8';
import scrypt from 'scrypt-async';
import { sha512 } from '@noble/hashes/sha512';
import { randomBytes } from '@noble/hashes/utils';
import type { IDBPDatabase } from 'idb';
import { secretbox } from 'tweetnacl';

// constants
import { IDB_PASSWORD_STORE_NAME } from '@/constants';

// decorators
import BaseStore from './BaseStore';

// errors
import { EncryptionError, DecryptionError, InvalidPasswordError } from '@/errors';

// types
import type {
  BaseAuthenticationStore,
  CreateDerivedKeyParameters,
  InitializePasswordStoreParameters,
  PasswordStoreParameters,
  PasswordStoreSchema,
  VaultSchema,
} from '@/types';

// utilities
import { bytesToHex, hexToBytes } from '@/utilities';

export default class PasswordStore extends BaseStore implements BaseAuthenticationStore {
  // private static variables
  private static readonly _challenge = 'Katavault rules!';
  private static readonly _saltByteSize = 64; // 64-bytes
  // public static variables
  public static readonly displayName = 'PasswordDecorator';
  // private variables
  private readonly _password: string;

  private constructor({ password, ...defaultParameters }: PasswordStoreParameters) {
    super(defaultParameters);

    this._password = password;
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

  private static async _store(vault: IDBPDatabase<VaultSchema>): Promise<PasswordStoreSchema | null> {
    const transaction = vault.transaction(IDB_PASSWORD_STORE_NAME, 'readonly');
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
   * public static methods
   */

  /**
   * Initializes an instance of the password vault decorator.
   * @param {InitializePasswordStoreParameters} params - The user credentials, password and logger.
   * @returns {Promise<PasswordStore>} A promise that resolves to the password vault decorator.
   * @throws {DecryptionError} If the stored challenge failed to be decrypted.
   * @throws {InvalidPasswordError} If supplied password does not match the stored password.
   * @public
   * @static
   */
  public static async initialize({
    logger,
    password,
    vault,
  }: InitializePasswordStoreParameters): Promise<PasswordStore> {
    const __logPrefix = `${PasswordStore.displayName}#initialize`;
    const passwordVault = new PasswordStore({
      logger,
      password,
      vault,
    });
    const store = await passwordVault._store();
    let challenge: string;
    let isVerified: boolean;

    // if the store exists, ensure the password is correct
    if (store) {
      logger.debug(`${__logPrefix}: password store exists`);

      isVerified = await passwordVault.verify();

      if (!isVerified) {
        throw new InvalidPasswordError('incorrect password');
      }
    }

    // if no store exists, create a new one
    if (!store) {
      logger.debug(`${__logPrefix}: password store does not exist, creating a new one`);

      challenge = bytesToHex(await passwordVault.encryptBytes(encodeUtf8(PasswordStore._challenge)));

      await passwordVault.setChallenge(challenge);
      await passwordVault.setLastUsedAt();
    }

    return passwordVault;
  }

  /**
   * private methods
   */

  /**
   * Gets the store.
   * @returns {Promise<PasswordStoreSchema | null>} A promise that resolves to the store or null if no store exists.
   * @private
   */
  private async _store(): Promise<PasswordStoreSchema | null> {
    return await PasswordStore._store(this._vault);
  }

  /**
   * public methods
   */

  /**
   * Clears the password store.
   * @public
   */
  public async clearStore(): Promise<void> {
    const __logPrefix = `${PasswordStore.displayName}#clear`;

    await this._vault.clear(IDB_PASSWORD_STORE_NAME);

    this._logger.debug(`${__logPrefix}: cleared password store`);
  }

  /**
   * Decrypts some previously encrypted bytes using the password.
   * @param {Uint8Array} bytes - The encrypted bytes.
   * @returns {Promise<Uint8Array>} A promise that resolves to the decrypted bytes.
   * @throws {DecryptionError} If the supplied bytes are malformed or there was a problem deriving a key from the
   * password.
   * @public
   */
  public async decryptBytes(bytes: Uint8Array): Promise<Uint8Array> {
    const __logPrefix = `${PasswordStore.displayName}#decryptBytes`;
    const [nonce, salt, encryptedBytes] = [
      bytes.slice(0, secretbox.nonceLength),
      bytes.slice(secretbox.nonceLength, secretbox.nonceLength + PasswordStore._saltByteSize),
      bytes.slice(secretbox.nonceLength + PasswordStore._saltByteSize),
    ];
    let _error: string;
    let encryptionKey: Uint8Array;
    let decryptedBytes: Uint8Array | null;

    if (!nonce || nonce.byteLength !== secretbox.nonceLength) {
      throw new DecryptionError('invalid nonce');
    }

    if (!salt || salt.byteLength !== PasswordStore._saltByteSize) {
      throw new DecryptionError('invalid salt');
    }

    encryptionKey = await PasswordStore._createDerivedKeyFromPassword({
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
    const __logPrefix = `${PasswordStore.displayName}#encryptBytes`;
    const salt = randomBytes(PasswordStore._saltByteSize);
    const encryptionKey = await PasswordStore._createDerivedKeyFromPassword({
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

  /**
   * Sets a hexadecimal encoded encrypted challenge.
   * @param {string} value - A hexadecimal encoded encrypted challenge.
   * @returns {string} The hexadecimal encoded encrypted challenge.
   * @public
   */
  public async setChallenge(value: string): Promise<string> {
    const transaction = this._vault.transaction(IDB_PASSWORD_STORE_NAME, 'readwrite');
    const challenge = (await transaction.store.get('challenge')) || null;

    challenge ? await transaction.store.put(value, 'challenge') : await transaction.store.add(value, 'challenge');

    return value;
  }

  /**
   * Sets the last used at timestamp. If the parameter is omitted, the current Unix timestamp, in milliseconds, is used.
   * @param {string} value - [optional] A Unix timestamp, in milliseconds. Defaults to the current Unix timestamp.
   * @returns {string} The last used at timestamp in milliseconds.
   * @public
   */
  public async setLastUsedAt(value?: string): Promise<string> {
    const transaction = this._vault.transaction(IDB_PASSWORD_STORE_NAME, 'readwrite');
    const lastUsedAt = (await transaction.store.get('lastUsedAt')) || null;
    const _value = value ?? Date.now().toString();

    lastUsedAt ? await transaction.store.put(_value, 'lastUsedAt') : await transaction.store.add(_value, 'lastUsedAt');

    return _value;
  }

  /**
   * Verifies that the password is valid.
   * @returns {Promise<boolean>} A promise that resolves to true if the password successfully decrypts the challenge,
   * or false otherwise.
   * @throws {DecryptionError} If the stored challenge failed to be decrypted.
   * @public
   */
  public async verify(): Promise<boolean> {
    const store = await this._store();
    let decryptedChallenge: Uint8Array;

    if (!store) {
      return false;
    }

    try {
      decryptedChallenge = await this.decryptBytes(hexToBytes(store.challenge));

      return decodeUtf8(decryptedChallenge) === PasswordStore._challenge;
    } catch (_) {
      return false;
    }
  }
}
