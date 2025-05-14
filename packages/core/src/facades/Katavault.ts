import { ed25519 } from '@noble/curves/ed25519';
import { concatBytes } from '@noble/hashes/utils';

// constants
import { SIGN_MESSAGE_PREFIX } from '@/constants';

// decorators
import { PasskeyDecorator, VaultDecorator } from '@/decorators';

// errors
import { AccountDoesNotExistError } from '@/errors';

// types
import type {
  Account,
  ClientInformation,
  KatavaultParameters,
  Logger,
  Passkey,
  AccountWithKeyData,
  SignMessageParameters,
  WithEncoding,
} from '@/types';

// utilities
import { addressFromPrivateKey, bytesToBase64, bytesToHex, generatePrivateKey, utf8ToBytes } from '@/utilities';

export default class Katavault {
  // public static variables
  public static readonly displayName = 'Katavault';
  // private variables
  private readonly _client: ClientInformation;
  private readonly _logger: Logger;
  private readonly _vault: VaultDecorator;

  public constructor({ client, logger, vault }: KatavaultParameters) {
    this._client = client;
    this._logger = logger;
    this._vault = vault;
  }

  /**
   * private methods
   */

  /**
   * Convenience method to authenticate with the passkey and decrypt an encrypted private key.
   * @param {AccountWithKeyData} item - A vault item containing the encrypted private key.
   * @returns {Promise<Uint8Array>} A promise that resolves to the decrypted private key.
   * @throws {FailedToAuthenticatePasskeyError} If the authenticator did not return the public key credentials.
   * @throws {FailedToRegisterPasskeyError} If the public key credentials failed to be created on the authenticator.
   * @throws {PasskeyNotSupportedError} If the browser does not support WebAuthn or the authenticator does not support.
   * @throws {UserCanceledPasskeyRequestError} If the user canceled the passkey request.
   * @private
   */
  private async _decryptPrivateKey(item: AccountWithKeyData): Promise<Uint8Array> {
    const passkey = await this._passkey();
    const passkeyClient = await PasskeyDecorator.authenticate({
      passkey,
      logger: this._logger,
    });

    return await passkeyClient.decryptBytes(item.keyData);
  }

  /**
   * Extracts the passkey from the vault. If no passkey exists in the vault, a new one is registered via Web
   * Authentication and added to the vault.
   * @returns {Promise<PasskeyStoreSchema>} A promise that resolves to a retried or created passkey.
   * @throws {FailedToRegisterPasskeyError} If the public key credentials failed to be created on the authenticator.
   * @throws {PasskeyNotSupportedError} If the browser does not support WebAuthn or the authenticator does not support.
   * @throws {UserCanceledPasskeyRequestError} If the user canceled the passkey request.
   * @private
   */
  private async _passkey(): Promise<Passkey> {
    const __logPrefix = `${Katavault.displayName}#_passkey`;
    let passkey = await this._vault.passkey();

    // if there is no passkey, register a new one
    if (!passkey) {
      passkey = await PasskeyDecorator.register({
        client: this._client,
        logger: this._logger,
      });

      this._logger.debug(`${__logPrefix}: registered new passkey "${passkey.credentialID}"`);

      await this._vault.setPasskey(passkey);

      this._logger.debug(`${__logPrefix}: saved new passkey "${passkey.credentialID}" to vault`);
    }

    return passkey;
  }

  /**
   * The secret key is the concatenation of a private key (32 byte) + the (uncompressed) public key.
   * @returns {Uint8Array} The secret key.
   * @private
   */
  private _secretKey(privateKey: Uint8Array): Uint8Array {
    const publicKey = ed25519.getPublicKey(privateKey);
    const secretKey = new Uint8Array(privateKey.length + publicKey.length);

    secretKey.set(privateKey);
    secretKey.set(publicKey, privateKey.length);

    return secretKey;
  }

  /**
   * public methods
   */

  /**
   * Gets a list of accounts within the wallet.
   * @returns {Promise<Account[]>} A promise that resolves to the accounts stored in the wallet.
   * @public
   */
  public async accounts(): Promise<Account[]> {
    const items = await this._vault.items();

    return items
      .entries()
      .toArray()
      .map(([address, { name }]) => ({
        address,
        name,
      }));
  }

  /**
   * Deletes all accounts and settings.
   * @public
   */
  public async clear(): Promise<void> {
    return await this._vault.clear();
  }

  /**
   * Generates a new account in the wallet.
   * @param {string} name - [optional] An optional name for the account. Defaults to undefined.
   * @returns {Promise<Account>} A promise that resolves to the created account.
   * @throws {FailedToAuthenticatePasskeyError} If the authenticator did not return the public key credentials.
   * @throws {FailedToRegisterPasskeyError} If the public key credentials failed to be created on the authenticator.
   * @throws {PasskeyNotSupportedError} If the browser does not support WebAuthn or the authenticator does not support.
   * @throws {UserCanceledPasskeyRequestError} If the user canceled the request or the request timed out.
   * @public
   */
  public async generateAccount(name?: string): Promise<Account> {
    const passkey = await this._passkey();
    const passkeyClient = await PasskeyDecorator.authenticate({
      passkey,
      logger: this._logger,
    });
    const privateKey: Uint8Array = generatePrivateKey();
    const address = addressFromPrivateKey(privateKey);

    // encrypt the private key add it to the vault
    await this._vault.upsertItems(
      new Map<string, AccountWithKeyData>([
        [
          address,
          {
            keyData: await passkeyClient.encryptBytes(privateKey),
            name,
          },
        ],
      ])
    );

    return {
      address,
      name,
    };
  }

  /**
   * Removes the account from the wallet for the specified address, if it exists.
   * @param {string} address - The address of the account to remove from the wallet.
   * @public
   */
  public async removeAccount(address: string): Promise<void> {
    const __logPrefix = `${Katavault.displayName}#removeAccount`;
    const items = await this._vault.items();
    let result: string[];

    if (items.has(address)) {
      result = await this._vault.removeItems([address]);

      this._logger.debug(`${__logPrefix}: removed accounts [${result.map((value) => `"${value}"`).join(',')}]`);
    }
  }

  public async signMessage(parameters: WithEncoding<SignMessageParameters>): Promise<string>;
  public async signMessage(parameters: Omit<SignMessageParameters, 'encoding'>): Promise<Uint8Array>;
  /**
   * Signs a message or some arbitrary bytes.
   *
   * **NOTE:** The message is prepended with "MX" for domain separation.
   * @param {SignMessageParameters} parameters - The signer, the message and optional output encoding.
   * @returns {Promise<string | Uint8Array>} A promise that resolves to the signature of the signed message. If the
   * encoding parameter was specified, the signature will be encoded in that format, otherwise signature will be in raw
   * bytes.
   * @throws {AccountDoesNotExistError} If the specified address does not exist in the wallet.
   * @throws {FailedToAuthenticatePasskeyError} If the authenticator did not return the public key credentials.
   * @throws {FailedToRegisterPasskeyError} If the public key credentials failed to be created on the authenticator.
   * @throws {PasskeyNotSupportedError} If the browser does not support WebAuthn or the authenticator does not support.
   * @throws {UserCanceledPasskeyRequestError} If the user canceled the passkey request.
   * @see {@link https://algorand.github.io/js-algorand-sdk/functions/signBytes.html}
   * @public
   */
  public async signMessage({ address, encoding, message }: SignMessageParameters): Promise<string | Uint8Array> {
    const __logPrefix = `${Katavault.displayName}#signMessage`;
    const item = await this._vault.itemByAddress(address);
    let _error: string;
    let privateKey: Uint8Array;
    let signature: Uint8Array;
    let toSign: Uint8Array;

    if (!item) {
      _error = `account "${address}" does not exist`;

      this._logger.debug(`${__logPrefix}: ${_error}`);

      throw new AccountDoesNotExistError(_error);
    }

    privateKey = await this._decryptPrivateKey(item);
    toSign = concatBytes(
      utf8ToBytes(SIGN_MESSAGE_PREFIX), // "MX" prefix
      typeof message === 'string' ? utf8ToBytes(message) : message
    );
    signature = ed25519.sign(toSign, privateKey);

    switch (encoding) {
      case 'base64':
        return bytesToBase64(signature);
      case 'hex':
        return bytesToHex(signature);
      default:
        return signature;
    }
  }
}
