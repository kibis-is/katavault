import { generate } from '@agoralabs-sh/uuid';
import { bytesToHex, hexToBytes, randomBytes } from '@noble/hashes/utils';

// constants
import {
  CHALLENGE_BYTE_SIZE,
  DERIVATION_KEY_ALGORITHM,
  DERIVATION_KEY_HASH_ALGORITHM,
  ENCRYPTION_KEY_ALGORITHM,
  ENCRYPTION_KEY_BIT_SIZE,
  INITIALIZATION_VECTOR_BYTE_SIZE,
  SALT_BYTE_SIZE,
} from '@/constants';

// errors
import { FailedToAuthenticatePasskeyError, FailedToRegisterPasskeyError, PasskeyNotSupportedError } from '@/errors';

// types
import type {
  AuthenticateParameters,
  Logger,
  Passkey as IPasskey,
  PasskeyParameters,
  RegisterPasskeyParameters,
} from '@/types';

// utilities
import { bufferSourceToUint8Array } from '@/utilities';

export default class Passkey {
  private readonly _keyMaterial: Uint8Array;
  private readonly _passkey: IPasskey;
  private readonly _logger: Logger;

  private constructor({ keyMaterial, logger, passkey }: PasskeyParameters) {
    this._keyMaterial = keyMaterial;
    this._logger = logger;
    this._passkey = passkey;
  }

  /**
   * private static methods
   */

  /**
   * Generates an encryption key that can be used to decrypt/encrypt bytes. This function imports the key using the
   * input key material from the passkey.
   * @returns {Promise<CryptoKey>} A promise that resolves to an encryption key that can be used to decrypt/encrypt
   * some bytes.
   * @private
   */
  private async _generateEncryptionKeyFromInputKeyMaterial(): Promise<CryptoKey> {
    const derivationKey = await crypto.subtle.importKey('raw', this._keyMaterial, DERIVATION_KEY_ALGORITHM, false, [
      'deriveKey',
    ]);

    return await crypto.subtle.deriveKey(
      {
        name: DERIVATION_KEY_ALGORITHM,
        info: hexToBytes(this._passkey.credentialID),
        salt: new Uint8Array(), // use an empty salt
        hash: DERIVATION_KEY_HASH_ALGORITHM,
      },
      derivationKey,
      {
        name: ENCRYPTION_KEY_ALGORITHM,
        length: ENCRYPTION_KEY_BIT_SIZE,
      },
      false,
      ['decrypt', 'encrypt']
    );
  }

  /**
   * public static methods
   */

  /**
   * Authenticates with the passkey and fetches the key material that can be used for encryption.
   * @param {AuthenticateParameters} options - passkey credentials and a logger.
   * @returns {Promise<Passkey>} A promise that resolves to an initialized passkey.
   * @throws {FailedToAuthenticatePasskeyError} if the authenticator did not return the public key credentials.
   * @throws {PasskeyNotSupportedError} if the browser does not support WebAuthn or the authenticator does not support
   * the PRF extension.
   * @public
   * @static
   */
  public static async authenticate({ logger, passkey }: AuthenticateParameters): Promise<Passkey> {
    const __logPrefix = `${Passkey.name}#authenticate`;
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
          challenge: randomBytes(CHALLENGE_BYTE_SIZE),
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

    return new Passkey({
      keyMaterial: bufferSourceToUint8Array(extensionResults.prf.results.first),
      logger,
      passkey,
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
   * Registers a passkey with the authenticator and returns the credentials that are used to fetch the key material to
   * derive an encryption key.
   *
   * NOTE: this requires PRF extension support and will throw an error if the authenticator does not support it.
   * @param {RegisterPasskeyParameters} options - The client and user details.
   * @returns {Promise<Passkey>} A promise that resolves to a registered passkey.
   * @throws {FailedToRegisterPasskeyError} if the public key credentials failed to be created on the authenticator.
   * @throws {PasskeyNotSupportedError} If the browser does not support WebAuthn or the authenticator does not support
   * the PRF extension.
   * @public
   * @static
   */
  public static async register({ client, logger, user }: RegisterPasskeyParameters): Promise<IPasskey> {
    const __logPrefix = `${Passkey.name}#register`;
    const salt = randomBytes(SALT_BYTE_SIZE);
    let _error: string;
    let credential: PublicKeyCredential | null;
    let extensionResults: AuthenticationExtensionsClientOutputs;

    if (!Passkey.isSupported()) {
      throw new PasskeyNotSupportedError('webauthn not supported');
    }

    try {
      credential = (await navigator.credentials.create({
        publicKey: {
          authenticatorSelection: {
            residentKey: 'required', // make passkey discoverable on the device
            userVerification: 'discouraged',
          },
          challenge: randomBytes(CHALLENGE_BYTE_SIZE),
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
            id: client.origin,
            name: client.title,
          },
          user: {
            id: new TextEncoder().encode(generate()),
            name: user.username,
            displayName: user.name,
          },
        },
      })) as PublicKeyCredential | null;
    } catch (error) {
      logger.error(`${__logPrefix}:`, error);

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
      initializationVector: bytesToHex(randomBytes(INITIALIZATION_VECTOR_BYTE_SIZE)),
      salt: bytesToHex(salt),
      transports: (credential.response as AuthenticatorAttestationResponse).getTransports() as AuthenticatorTransport[],
    };
  }

  /**
   * public methods
   */

  /**
   * Decrypts some previously encrypted bytes using the input key material fetched from a passkey.
   * @param {Uint8Array} encryptedBytes - The encrypted bytes.
   * @returns {Promise<Uint8Array>} A promise that resolves to the decrypted bytes.
   * @public
   */
  public async decryptBytes(encryptedBytes: Uint8Array): Promise<Uint8Array> {
    const encryptionKey = await this._generateEncryptionKeyFromInputKeyMaterial();
    const decryptedBytes = await crypto.subtle.decrypt(
      {
        name: ENCRYPTION_KEY_ALGORITHM,
        iv: hexToBytes(this._passkey.initializationVector),
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
   * @public
   */
  public async encryptBytes(bytes: Uint8Array): Promise<Uint8Array> {
    const encryptionKey = await this._generateEncryptionKeyFromInputKeyMaterial();
    const encryptedBytes = await crypto.subtle.encrypt(
      {
        name: ENCRYPTION_KEY_ALGORITHM,
        iv: hexToBytes(this._passkey.initializationVector),
      },
      encryptionKey,
      bytes
    );

    return bufferSourceToUint8Array(encryptedBytes);
  }
}
