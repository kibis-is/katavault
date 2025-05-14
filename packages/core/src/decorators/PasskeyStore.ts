import { generate } from '@agoralabs-sh/uuid';
import { randomBytes } from '@noble/hashes/utils';
import type { IDBPDatabase } from 'idb';

// constants
import { IDB_PASSKEY_STORE_NAME } from '@/constants';

// decorators
import BaseStore from './BaseStore';

// errors
import {
  DecryptionError,
  EncryptionError,
  FailedToAuthenticatePasskeyError,
  FailedToInitializeError,
  FailedToRegisterPasskeyError,
  PasskeyNotSupportedError,
  UserCanceledPasskeyRequestError,
} from '@/errors';

// types
import type {
  AuthenticatePasskeyParameters,
  BaseAuthenticationStore,
  GenerateEncryptionKeyFromKeyMaterialParameters,
  InitializePasskeyStoreParameters,
  PasskeyStoreParameters,
  PasskeyStoreSchema,
  RegisterPasskeyParameters,
  VaultSchema,
} from '@/types';

// utilities
import { bytesToHex, bufferSourceToUint8Array, hexToBytes } from '@/utilities';

export default class PasskeyStore extends BaseStore implements BaseAuthenticationStore {
  // private static variables
  private static readonly _challengeByteSize = 32; // 32-bytes
  private static readonly _derivationKeyAlgorithm = 'HKDF';
  private static readonly _derivationKeyHashAlgorithm = 'SHA-256';
  private static readonly _encryptionKeyAlgorithm = 'AES-GCM';
  private static readonly _encryptionKeyBitSize = 256; // 256-bits
  private static readonly _initializationVectorByteSize = 12; // 12-bytes
  private static readonly _saltByteSize = 32; // 32-bytes
  // public static variables
  public static readonly displayName = 'PasskeyDecorator';
  // private variables
  private readonly _keyMaterial: Uint8Array;

  private constructor({ keyMaterial, ...defaultParameters }: PasskeyStoreParameters) {
    super(defaultParameters);

    this._keyMaterial = keyMaterial;
  }

  /**
   * private static methods
   */

  /**
   * Authenticates with the passkey and fetches the key material that can be used for encryption.
   * @param {AuthenticatePasskeyParameters} params - The passkey credentials and a logger.
   * @returns {Promise<Uint8Array>} A promise that resolves to the key material returned from the authenticator.
   * @throws {FailedToAuthenticatePasskeyError} If the authenticator did not return the public key credentials.
   * @throws {PasskeyNotSupportedError} If the browser does not support WebAuthn or the authenticator does not support.
   * @throws {UserCanceledPasskeyRequestError} If the user canceled the request or the request timed out.
   * the PRF extension.
   * @private
   * @static
   */
  private static async _authenticate({ logger, ...passkey }: AuthenticatePasskeyParameters): Promise<Uint8Array> {
    const __logPrefix = `${PasskeyStore.displayName}#authenticate`;
    let _error: string;
    let _credential: PublicKeyCredential | null;
    let extensionResults: AuthenticationExtensionsClientOutputs;

    try {
      _credential = (await navigator.credentials.get({
        publicKey: {
          allowCredentials: [
            {
              id: hexToBytes(passkey.credentialID),
              transports: passkey.transports,
              type: 'public-key',
            },
          ],
          challenge: randomBytes(PasskeyStore._challengeByteSize),
          extensions: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            prf: {
              eval: {
                first: hexToBytes(passkey.salt),
              },
            },
          },
          userVerification: 'discouraged',
        },
      })) as PublicKeyCredential | null;
    } catch (error) {
      logger.error(`${__logPrefix}:`, error);

      if ((error as Error).name === 'NotAllowedError') {
        throw new UserCanceledPasskeyRequestError('authenticate canceled by user or timed out');
      }

      throw new FailedToAuthenticatePasskeyError(error.message);
    }

    if (!_credential) {
      _error = `failed to fetch passkey "${passkey.credentialID}"`;

      logger.error(`${__logPrefix}: ${_error}`);

      throw new FailedToAuthenticatePasskeyError(_error);
    }

    extensionResults = _credential.getClientExtensionResults();

    // if the prf is not present or not results, the browser does not support the prf extension
    if (!extensionResults.prf?.results) {
      _error = 'authenticator does not support the prf extension for webauthn';

      logger.error(`${__logPrefix}: ${_error}`);

      throw new PasskeyNotSupportedError(_error);
    }

    return bufferSourceToUint8Array(extensionResults.prf.results.first);
  }

  /**
   * Generates an encryption key that can be used to decrypt/encrypt bytes. This function imports the key using the
   * input key material from the passkey.
   * @param {GenerateEncryptionKeyFromKeyMaterialParameters} params - The key material and the credential ID.
   * @returns {Promise<CryptoKey>} A promise that resolves to an encryption key that can be used to decrypt/encrypt
   * some bytes.
   * @private
   * @static
   */
  private static async _generateEncryptionKeyFromInputKeyMaterial({
    credentialID,
    keyMaterial,
  }: GenerateEncryptionKeyFromKeyMaterialParameters): Promise<CryptoKey> {
    const derivationKey = await crypto.subtle.importKey(
      'raw',
      keyMaterial,
      PasskeyStore._derivationKeyAlgorithm,
      false,
      ['deriveKey']
    );

    return await crypto.subtle.deriveKey(
      {
        name: PasskeyStore._derivationKeyAlgorithm,
        info: hexToBytes(credentialID),
        salt: new Uint8Array(), // use an empty salt
        hash: PasskeyStore._derivationKeyHashAlgorithm,
      },
      derivationKey,
      {
        name: PasskeyStore._encryptionKeyAlgorithm,
        length: PasskeyStore._encryptionKeyBitSize,
      },
      false,
      ['decrypt', 'encrypt']
    );
  }

  /**
   * Registers a passkey with the authenticator and returns the credentials that are used to fetch the key material to
   * derive an encryption key.
   *
   * NOTE: this requires PRF extension support and will throw an error if the authenticator does not support it.
   * @param {RegisterPasskeyParameters} options - The client and user details.
   * @returns {Promise<PasskeyStore>} A promise that resolves to a registered passkey.
   * @throws {FailedToRegisterPasskeyError} If the public key credentials failed to be created on the authenticator.
   * @throws {PasskeyNotSupportedError} If the browser does not support WebAuthn or the authenticator does not support.
   * @throws {UserCanceledPasskeyRequestError} If the user canceled the request or the request timed out.
   * the PRF extension.
   * @private
   * @static
   */
  private static async _register({ client, logger, user }: RegisterPasskeyParameters): Promise<PasskeyStoreSchema> {
    const __logPrefix = `${PasskeyStore.displayName}#register`;
    const salt = randomBytes(PasskeyStore._saltByteSize);
    let _error: string;
    let credential: PublicKeyCredential | null;
    let extensionResults: AuthenticationExtensionsClientOutputs;

    if (!PasskeyStore.isSupported()) {
      throw new PasskeyNotSupportedError('webauthn not supported');
    }

    try {
      credential = (await navigator.credentials.create({
        publicKey: {
          authenticatorSelection: {
            residentKey: 'required', // make passkey discoverable on the device
            userVerification: 'discouraged',
          },
          challenge: randomBytes(PasskeyStore._challengeByteSize),
          extensions: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            prf: {
              eval: {
                first: salt,
              },
            },
          },
          pubKeyCredParams: [
            { alg: -8, type: 'public-key' }, // Ed25519
            { alg: -7, type: 'public-key' }, // ES256
            { alg: -257, type: 'public-key' }, // RS256
          ],
          rp: {
            id: client.host,
            name: client.name,
          },
          user: {
            id: new TextEncoder().encode(generate()),
            name: user.username,
            displayName: user.displayName ?? user.username,
          },
        },
      })) as PublicKeyCredential | null;
    } catch (error) {
      logger.error(`${__logPrefix}:`, error);

      if ((error as Error).name === 'NotAllowedError') {
        throw new UserCanceledPasskeyRequestError('register canceled by user or timed out');
      }

      throw new FailedToRegisterPasskeyError(error.message);
    }

    if (!credential) {
      _error = 'failed to register a passkey';

      logger.error(`${__logPrefix}: ${_error}`);

      throw new FailedToRegisterPasskeyError(_error);
    }

    extensionResults = credential.getClientExtensionResults();

    // if the prf is not present or the not enabled, the browser does not support the prf extension
    if (!extensionResults.prf?.enabled) {
      _error = 'authenticator does not support the prf extension for webauthn';

      logger.error(`${__logPrefix}: ${_error}`);

      throw new PasskeyNotSupportedError(_error);
    }

    return {
      credentialID: bytesToHex(new Uint8Array(credential.rawId)),
      initializationVector: bytesToHex(randomBytes(PasskeyStore._initializationVectorByteSize)),
      salt: bytesToHex(salt),
      transports: (credential.response as AuthenticatorAttestationResponse).getTransports() as AuthenticatorTransport[],
    };
  }

  /**
   * Gets the store.
   * @returns {Promise<PasskeyStoreSchema | null>} A promise that resolves to the store or null if no store exists.
   * @private
   * @static
   */
  private static async _store(vault: IDBPDatabase<VaultSchema>): Promise<PasskeyStoreSchema | null> {
    const transaction = vault.transaction(IDB_PASSKEY_STORE_NAME, 'readonly');
    const store: PasskeyStoreSchema = {
      credentialID: await transaction.store.get('credentialID'),
      initializationVector: await transaction.store.get('initializationVector'),
      salt: await transaction.store.get('salt'),
      transports: await transaction.store.get('transports'),
    };

    if (
      typeof store.credentialID === 'undefined' ||
      typeof store.initializationVector === 'undefined' ||
      typeof store.salt === 'undefined' ||
      typeof store.transports === 'undefined'
    ) {
      return null;
    }

    return store;
  }

  /**
   * public static methods
   */

  /**
   * Initializes an instance of the passkey vault decorator.
   * @param {InitializePasskeyStoreParameters} params - The user credentials, the client information, the user
   * information and logger.
   * @returns {Promise<PasskeyStore>} A promise that resolves to the passkey vault decorator.
   * @throws {FailedToAuthenticatePasskeyError} If the authenticator did not return the public key credentials.
   * @throws {FailedToRegisterPasskeyError} If the public key credentials failed to be created on the authenticator.
   * @throws {PasskeyNotSupportedError} If the browser does not support WebAuthn or the authenticator does not support.
   * @throws {UserCanceledPasskeyRequestError} If the user canceled the request or the request timed out.
   * @public
   * @static
   */
  public static async initialize({
    client,
    logger,
    user,
    vault,
  }: InitializePasskeyStoreParameters): Promise<PasskeyStore> {
    const __logPrefix = `${PasskeyStore.displayName}#initialize`;
    let keyMaterial: Uint8Array;
    let passkeyVault: PasskeyStore;
    let passkey = await PasskeyStore._store(vault);

    if (!passkey) {
      logger.debug(`${__logPrefix}: no passkey exists, registering new credential`);

      // register the new passkey
      passkey = await PasskeyStore._register({
        client,
        logger,
        user,
      });
      // get the key material
      keyMaterial = await PasskeyStore._authenticate({
        logger,
        ...passkey,
      });
      passkeyVault = new PasskeyStore({
        keyMaterial,
        logger,
        vault,
      });

      // set the passkey details
      await passkeyVault.setPasskey(passkey);

      return passkeyVault;
    }

    keyMaterial = await PasskeyStore._authenticate({
      logger,
      ...passkey,
    });

    return new PasskeyStore({
      keyMaterial,
      logger,
      vault,
    });
  }

  /**
   * Convenience function that simply checks if the browser supports public key WebAuthn.
   * @returns {boolean} true of the browser supports public key WebAuthn, false otherwise.
   * @public
   * @static
   */
  public static isSupported(): boolean {
    return !!window?.PublicKeyCredential;
  }

  /**
   * private methods
   */

  /**
   * Gets the store.
   * @returns {Promise<PasskeyStoreSchema | null>} A promise that resolves to the store or null if no store exists.
   * @private
   */
  private async _store(): Promise<PasskeyStoreSchema | null> {
    return await PasskeyStore._store(this._vault);
  }

  /**
   * public methods
   */

  /**
   * Clears the passkey store.
   * @public
   */
  public async clearStore(): Promise<void> {
    const __logPrefix = `${PasskeyStore.displayName}#clear`;

    await this._vault.clear(IDB_PASSKEY_STORE_NAME);

    this._logger.debug(`${__logPrefix}: cleared passkey store`);
  }

  /**
   * Gets the passkey credential ID.
   * @returns {Promise<string>} A promise that resolves to the hexadecimal encoded ID of the passkey credential.
   * @throws {FailedToInitializeError} If no credentials found.
   * @public
   */
  public async credentialID(): Promise<string> {
    const __logPrefix = `${PasskeyStore.displayName}#credentialID`;
    const store = await this._store();

    if (!store) {
      throw new FailedToInitializeError(`${__logPrefix}: no passkey credentials found`);
    }

    return store.credentialID;
  }

  /**
   * Decrypts some previously encrypted bytes using the input key material fetched from a passkey.
   * @param {Uint8Array} encryptedBytes - The encrypted bytes.
   * @returns {Promise<Uint8Array>} A promise that resolves to the decrypted bytes.
   * @throws {DecryptionError} If no credentials are stored.
   * @public
   */
  public async decryptBytes(encryptedBytes: Uint8Array): Promise<Uint8Array> {
    const store = await this._store();
    let encryptionKey: CryptoKey;
    let decryptedBytes: ArrayBuffer;

    if (!store) {
      throw new DecryptionError('no passkey credentials stored');
    }

    encryptionKey = await PasskeyStore._generateEncryptionKeyFromInputKeyMaterial({
      credentialID: store.credentialID,
      keyMaterial: this._keyMaterial,
    });
    decryptedBytes = await crypto.subtle.decrypt(
      {
        name: PasskeyStore._encryptionKeyAlgorithm,
        iv: hexToBytes(store.initializationVector),
      },
      encryptionKey,
      encryptedBytes
    );

    return bufferSourceToUint8Array(decryptedBytes);
  }

  /**
   * Encrypts some arbitrary bytes using the input key material fetched from a passkey. This function uses the AES-GCM
   * algorithm to encrypt the bytes.
   * @param {Uint8Array} bytes - The bytes to encrypt.
   * @returns {Promise<Uint8Array>} A promise that resolves to the encrypted bytes.
   * @throws {EncryptionError} If no credentials are stored.
   * @public
   */
  public async encryptBytes(bytes: Uint8Array): Promise<Uint8Array> {
    const store = await this._store();
    let encryptionKey: CryptoKey;
    let encryptedBytes: ArrayBuffer;

    if (!store) {
      throw new EncryptionError('no passkey credentials stored');
    }

    encryptionKey = await PasskeyStore._generateEncryptionKeyFromInputKeyMaterial({
      credentialID: store.credentialID,
      keyMaterial: this._keyMaterial,
    });
    encryptedBytes = await crypto.subtle.encrypt(
      {
        name: PasskeyStore._encryptionKeyAlgorithm,
        iv: hexToBytes(store.initializationVector),
      },
      encryptionKey,
      bytes
    );

    return bufferSourceToUint8Array(encryptedBytes);
  }

  /**
   * Saves the passkey credential information returned from an authenticator register function.
   * @param {PasskeyStoreSchema} passkey - The passkey to save.
   * @returns {Promise<PasskeyStoreSchema>} A promise that resolves to the saved passkey.
   * @public
   */
  public async setPasskey(passkey: PasskeyStoreSchema): Promise<PasskeyStoreSchema> {
    const transaction = this._vault.transaction(IDB_PASSKEY_STORE_NAME, 'readwrite');
    const credentialID = (await transaction.store.get('credentialID')) || null;
    const initializationVector = (await transaction.store.get('initializationVector')) || null;
    const salt = (await transaction.store.get('salt')) || null;
    const transports = (await transaction.store.get('transports')) || null;

    credentialID
      ? await transaction.store.put(passkey.credentialID, 'credentialID')
      : await transaction.store.add(passkey.credentialID, 'credentialID');
    initializationVector
      ? await transaction.store.put(passkey.initializationVector, 'initializationVector')
      : await transaction.store.add(passkey.initializationVector, 'initializationVector');
    salt ? await transaction.store.put(passkey.salt, 'salt') : await transaction.store.add(passkey.salt, 'salt');
    transports
      ? await transaction.store.put(passkey.transports, 'transports')
      : await transaction.store.add(passkey.transports, 'transports');

    return passkey;
  }
}
