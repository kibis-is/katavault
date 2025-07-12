import { randomBytes } from '@noble/hashes/utils';
import { secretbox } from 'tweetnacl';

// constants
import { IDB_PASSWORD_STORE_NAME } from '@/constants';

// decorators
import BaseStore from '@/decorators/_base/BaseStore';

// errors
import { EncryptionError, DecryptionError, NotAuthenticatedError } from '@/errors';

// types
import type { BaseAuthenticationStore, StoreParameters } from '@/types';

// utilities
import { base64ToBytes, bytesToUTF8, createDerivationKey, utf8ToBytes } from '@/utilities';

export default class PasswordStore extends BaseStore implements BaseAuthenticationStore {
  // private static variables
  private static readonly _saltByteSize = 64; // 64-bytes
  // public static variables
  public static readonly challenge = 'Katavault rules!';
  public static readonly displayName = 'PasswordStore';
  // private variables
  private _password: string | null = null;

  public constructor(params: StoreParameters) {
    super(params);
  }

  /**
   * public methods
   */

  /**
   * Gets the encrypted challenge encoded with base64.
   * @returns {Promise<string | null>} A promise that resolves to the encrypted challenge with base64 encoding or null
   * if no challenge exists.
   * @private
   */
  public async challenge(): Promise<string | null> {
    const transaction = this._vault.transaction(IDB_PASSWORD_STORE_NAME, 'readonly');
    const challenge = await transaction.store.get('challenge');

    if (typeof challenge === 'undefined') {
      return null;
    }

    return challenge;
  }

  /**
   * Decrypts some previously encrypted bytes using the password.
   * @param {Uint8Array} bytes - The encrypted bytes.
   * @returns {Promise<Uint8Array>} A promise that resolves to the decrypted bytes.
   * @throws {NotAuthenticatedError} If the password has not been set.
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

    if (!this._password) {
      throw new NotAuthenticatedError('no password found');
    }

    if (!nonce || nonce.byteLength !== secretbox.nonceLength) {
      throw new DecryptionError('invalid nonce');
    }

    if (!salt || salt.byteLength !== PasswordStore._saltByteSize) {
      throw new DecryptionError('invalid salt');
    }

    encryptionKey = await createDerivationKey({
      keyLength: secretbox.keyLength,
      salt,
      secret: utf8ToBytes(this._password),
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
   * @throws {NotAuthenticatedError} If the password has not been set.
   * @throws {EncryptionError} If the bytes were failed to be encrypted.
   * @public
   */
  public async encryptBytes(bytes: Uint8Array): Promise<Uint8Array> {
    const __logPrefix = `${PasswordStore.displayName}#encryptBytes`;
    let encryptedBytes: Uint8Array;
    let encryptionKey: Uint8Array;
    let nonce: Uint8Array;
    let buffer: Uint8Array;
    let salt: Uint8Array;

    if (!this._password) {
      throw new NotAuthenticatedError('no password found');
    }

    salt = randomBytes(PasswordStore._saltByteSize);
    encryptionKey = await createDerivationKey({
      keyLength: secretbox.keyLength,
      salt,
      secret: utf8ToBytes(this._password),
    });
    nonce = randomBytes(secretbox.nonceLength);

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
   * Retrieves the stored password.
   * @return {string | null} The current password if available, otherwise null.
   * @public
   */
  public password(): string | null {
    return this._password;
  }

  /**
   * Sets an encrypted challenge with base64 encoding.
   * @param {string} value - An encrypted challenge with base64 encoding.
   * @returns {string} The encrypted challenge with base64 encoding.
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
   * Sets the password.
   *
   * **NOTE:** This does not set the password to storage, only to runtime memory.
   * @param {string} password - The password to set.
   * @public
   */
  public setPassword(password: string): void {
    this._password = password;
  }

  /**
   * Verifies that the password is valid.
   * @returns {Promise<boolean>} A promise that resolves to true if the password successfully decrypts the challenge,
   * or false otherwise.
   * @throws {DecryptionError} If the stored challenge failed to be decrypted.
   * @public
   */
  public async verify(): Promise<boolean> {
    const encryptedChallenge = await this.challenge();
    let decryptedChallenge: Uint8Array;

    if (!encryptedChallenge) {
      return false;
    }

    try {
      decryptedChallenge = await this.decryptBytes(base64ToBytes(encryptedChallenge));

      return bytesToUTF8(decryptedChallenge) === PasswordStore.challenge;
    } catch (_) {
      return false;
    }
  }
}
