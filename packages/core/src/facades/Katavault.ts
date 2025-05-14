import { ed25519 } from '@noble/curves/ed25519';
import { concatBytes } from '@noble/hashes/utils';
import { deleteDB } from 'idb';

// constants
import { SIGN_MESSAGE_PREFIX } from '@/constants';

// decorators
import { AccountsVaultDecorator } from '@/decorators';

// enums
import { AuthenticationMethod } from '@/enums';

// errors
import { AccountDoesNotExistError, UnknownAuthenticationMethodError } from '@/errors';

// types
import type {
  Account,
  AccountStoreItemWithPasskey,
  AccountStoreItemWithPassword,
  AuthenticationClient,
  InitializeKatavaultParameters,
  KatavaultParameters,
  Logger,
  SignMessageParameters,
  UserInformation,
  WithEncoding,
} from '@/types';

// utilities
import {
  addressFromPrivateKey,
  bytesToBase64,
  bytesToHex,
  createVaultName,
  generatePrivateKey,
  hexToBytes,
  utf8ToBytes,
} from '@/utilities';

export default class Katavault {
  // public static variables
  public static readonly displayName = 'Katavault';
  // private variables
  private readonly _accountsVaultClient: AccountsVaultDecorator;
  private readonly _authenticationClient: AuthenticationClient;
  private readonly _logger: Logger;
  private readonly _user: UserInformation;

  public constructor({ accountsVaultClient, authenticationClient, logger, user }: KatavaultParameters) {
    this._accountsVaultClient = accountsVaultClient;
    this._authenticationClient = authenticationClient;
    this._logger = logger;
    this._user = user;
  }

  /**
   * public static methods
   */

  public static async initialize({
    authenticationClient,
    logger,
    user,
  }: InitializeKatavaultParameters): Promise<Katavault> {
    return new Katavault({
      accountsVaultClient: await AccountsVaultDecorator.initialize({ logger, user }),
      authenticationClient,
      logger,
      user,
    });
  }

  /**
   * private methods
   */

  /**
   * Gets the decrypted account private key by address.
   * @param {string} address - The address of the account to get the private key from.
   * @returns {Promise<Uint8Array>} A promise that resolves to the decrypted private key or null if the private key
   * could.
   * @throws {UnknownAuthenticationMethodError} If the authentication method is unknown or there are no credentials stored.
   * @throws {DecryptionError} If there was an issue with decryption or the credentials were not found.
   * @private
   */
  private async _decryptedAccountKeyByAddress(address: string): Promise<Uint8Array | null> {
    const __logPrefix = `${Katavault.displayName}#_decryptedAccountKeyByAddress`;
    const account = await this._accountsVaultClient.accountByAddress(address);
    let credentialID: string | null;
    let passwordHash: string | null;

    if (!account) {
      this._logger.debug(`${__logPrefix}: account "${address}" not found`);

      return null;
    }

    if (this._authenticationClient.__type === AuthenticationMethod.Passkey) {
      credentialID = (account as AccountStoreItemWithPasskey).credentialID ?? null;

      // check that the account is encrypted using the correct credential
      if (!credentialID || credentialID !== (await this._authenticationClient.vault.credentialID())) {
        this._logger.debug(`${__logPrefix}: account "${address}" found, but not encrypted using the supplied passkey`);

        return null;
      }

      return await this._authenticationClient.vault.decryptBytes(hexToBytes(account.keyData));
    }

    if (this._authenticationClient.__type === AuthenticationMethod.Password) {
      passwordHash = (account as AccountStoreItemWithPassword).passwordHash ?? null;

      // check if the account was encrypted using the correct password
      if (!passwordHash || passwordHash !== bytesToHex(this._authenticationClient.vault.hash())) {
        this._logger.debug(`${__logPrefix}: account "${address}" found, but not encrypted using the supplied password`);

        return null;
      }

      return await this._authenticationClient.vault.decryptBytes(hexToBytes(account.keyData));
    }

    throw new UnknownAuthenticationMethodError(`unknown authentication method`);
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
    const items = await this._accountsVaultClient.accounts();

    return items.map(({ address, name }) => ({
      address,
      name,
    }));
  }

  /**
   * Deletes all accounts and settings.
   * @public
   */
  public async clear(): Promise<void> {
    return await deleteDB(createVaultName(this._user.username));
  }

  /**
   * Generates a new account in the wallet.
   * @param {string} name - [optional] An optional name for the account. Defaults to undefined.
   * @returns {Promise<Account>} A promise that resolves to the created account.
   * @throws {EncryptionError} If the
   * @public
   */
  public async generateAccount(name?: string): Promise<Account> {
    const privateKey: Uint8Array = generatePrivateKey();
    const address = addressFromPrivateKey(privateKey);
    let encryptedKeyData: Uint8Array;

    if (this._authenticationClient.__type === AuthenticationMethod.Passkey) {
      encryptedKeyData = await this._authenticationClient.vault.encryptBytes(privateKey);

      await this._accountsVaultClient.upsert([
        {
          address,
          credentialID: await this._authenticationClient.vault.credentialID(),
          keyData: bytesToHex(encryptedKeyData),
          name,
        },
      ]);
    }

    if (this._authenticationClient.__type === AuthenticationMethod.Password) {
      encryptedKeyData = await this._authenticationClient.vault.encryptBytes(privateKey);

      await this._accountsVaultClient.upsert([
        {
          address,
          passwordHash: bytesToHex(this._authenticationClient.vault.hash()),
          keyData: bytesToHex(encryptedKeyData),
          name,
        },
      ]);
    }

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
    const results = await this._accountsVaultClient.remove([address]);

    this._logger.debug(`${__logPrefix}: removed accounts [${results.map((value) => `"${value}"`).join(',')}]`);
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
   * @see {@link https://algorand.github.io/js-algorand-sdk/functions/signBytes.html}
   * @public
   */
  public async signMessage({ address, encoding, message }: SignMessageParameters): Promise<string | Uint8Array> {
    const privateKey = await this._decryptedAccountKeyByAddress(address);
    let signature: Uint8Array;
    let toSign: Uint8Array;

    if (!privateKey) {
      throw new AccountDoesNotExistError(`account "${address}" does not exist`);
    }

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
