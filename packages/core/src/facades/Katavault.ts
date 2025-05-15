import { ed25519 } from '@noble/curves/ed25519';
import { concatBytes } from '@noble/hashes/utils';
import { IDBPDatabase, openDB } from 'idb';

// constants
import {
  IDB_ACCOUNTS_STORE_NAME,
  IDB_PASSKEY_STORE_NAME,
  IDB_PASSWORD_STORE_NAME,
  SIGN_MESSAGE_PREFIX,
} from '@/constants';

// decorators
import { AccountStore, PasskeyStore, PasswordStore } from '@/decorators';

// enums
import { AuthenticationMethod } from '@/enums';

// errors
import { AccountDoesNotExistError, InvalidPasswordError, NotAuthenticatedError } from '@/errors';

// types
import type {
  Account,
  AccountStoreItemWithPasskey,
  AccountStoreItemWithPassword,
  AuthenticateWithPasskeyParameters,
  AuthenticateWithPasswordParameters,
  AuthenticationStore,
  ClientInformation,
  InitializeVaultParameters,
  KatavaultParameters,
  Logger,
  PasskeyStoreSchema,
  SignMessageParameters,
  UserInformation,
  VaultSchema,
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
import { encode as encodeUtf8 } from '@stablelib/utf8';

export default class Katavault {
  // public static variables
  public static readonly displayName = 'Katavault';
  // private variables
  private _accountStore: AccountStore;
  private _authenticationStore: AuthenticationStore | null = null;
  private readonly _clientInformation: ClientInformation;
  private readonly _logger: Logger;
  private _user: UserInformation;
  private _vault: IDBPDatabase<VaultSchema>;

  public constructor({ clientInformation, logger }: KatavaultParameters) {
    this._clientInformation = clientInformation;
    this._logger = logger;
  }

  /**
   * private methods
   */

  /**
   * Gets the decrypted account private key by address.
   * @param {string} address - The address of the account to get the private key from.
   * @returns {Promise<Uint8Array>} A promise that resolves to the decrypted private key or null if the private key
   * could.
   * @throws {NotAuthenticatedError} If the Katavault has not been authenticated.
   * @throws {DecryptionError} If there was an issue with decryption or the credentials were not found.
   * @private
   */
  private async _decryptedAccountKeyByAddress(address: string): Promise<Uint8Array | null> {
    const __logPrefix = `${Katavault.displayName}#_decryptedAccountKeyByAddress`;
    const account = await this._accountStore.accountByAddress(address);
    let credentialID: string | null;
    let passkey: PasskeyStoreSchema | null;
    let passwordHash: string | null;

    if (!this.isAuthenticated()) {
      throw new NotAuthenticatedError('not authenticated');
    }

    if (!account) {
      this._logger.debug(`${__logPrefix}: account "${address}" not found`);

      return null;
    }

    switch (this._authenticationStore?.__type) {
      case AuthenticationMethod.Passkey:
        credentialID = (account as AccountStoreItemWithPasskey).credentialID ?? null;
        passkey = await this._authenticationStore.store.passkey();

        // check that the account is encrypted using the correct credential
        if (!credentialID || !passkey || credentialID !== passkey.credentialID) {
          this._logger.debug(
            `${__logPrefix}: account "${address}" found, but not encrypted using the supplied passkey`
          );

          return null;
        }

        return await this._authenticationStore.store.decryptBytes(hexToBytes(account.keyData));
      case AuthenticationMethod.Password:
        passwordHash = (account as AccountStoreItemWithPassword).passwordHash ?? null;

        // check if the account was encrypted using the correct password
        if (!passwordHash || passwordHash !== bytesToHex(this._authenticationStore.store.hash())) {
          this._logger.debug(
            `${__logPrefix}: account "${address}" found, but not encrypted using the supplied password`
          );

          return null;
        }

        return await this._authenticationStore.store.decryptBytes(hexToBytes(account.keyData));
      default:
        throw new NotAuthenticatedError('not authenticated');
    }
  }

  /**
   * Initializes the vault connection.
   * @param {InitializeVaultParameters} params - The user information to identify the vault.
   * @returns {Promise<IDBPDatabase<VaultSchema>>} A promise that resolves to the initialized vault.
   * @private
   * @static
   */
  private static async _initializeVault({
    logger,
    user,
  }: InitializeVaultParameters): Promise<IDBPDatabase<VaultSchema>> {
    const __logPrefix = `${Katavault.displayName}#_initializeVault`;
    const name = createVaultName(user.username);

    return await openDB<VaultSchema>(name, undefined, {
      upgrade: (_db, oldVersion, newVersion) => {
        // we are creating a new database
        if (oldVersion <= 0 && newVersion && newVersion > 0) {
          // create the stores
          _db.createObjectStore(IDB_ACCOUNTS_STORE_NAME);
          _db.createObjectStore(IDB_PASSKEY_STORE_NAME);
          _db.createObjectStore(IDB_PASSWORD_STORE_NAME);

          logger.debug(`${__logPrefix}: created new vault "${name}"`);
        }
      },
    });
  }

  /**
   * public methods
   */

  /**
   * Authenticates with a passkey.
   * @param {AuthenticateWithPasskeyParameters} params - The user information.
   * @throws {FailedToAuthenticatePasskeyError} If the authenticator did not return the public key credentials.
   * @throws {FailedToRegisterPasskeyError} If the public key credentials failed to be created on the authenticator.
   * @throws {PasskeyNotSupportedError} If the browser does not support WebAuthn or the authenticator does not support.
   * @throws {UserCanceledPasskeyRequestError} If the user canceled the request or the request timed out.
   * @public
   */
  public async authenticateWithPasskey({ user }: AuthenticateWithPasskeyParameters): Promise<void> {
    const __logPrefix = `${Katavault.displayName}#authenticateWithPasskey`;
    const vault = await Katavault._initializeVault({
      logger: this._logger,
      user,
    });
    const store = new PasskeyStore({
      logger: this._logger,
      vault,
    });
    let keyMaterial: Uint8Array;
    let passkey = await store.passkey();

    // if there is no passkey register a new one
    if (!passkey) {
      this._logger.debug(`${__logPrefix}: no passkey exists, registering new credential`);

      passkey = await PasskeyStore.register({
        client: this._clientInformation,
        logger: this._logger,
        user,
      });

      await store.setPasskey(passkey);
    }

    this._logger.debug(`${__logPrefix}: authenticating new credential "${passkey.credentialID}"`);

    keyMaterial = await PasskeyStore.authenticate({
      logger: this._logger,
      ...passkey,
    });

    store.setKeyMaterial(keyMaterial);

    this._accountStore = new AccountStore({
      logger: this._logger,
      vault,
    });
    this._authenticationStore = {
      __type: AuthenticationMethod.Passkey,
      store,
    };
    this._user = user;
    this._vault = vault;
  }

  /**
   * Authenticates with the supplied password.
   * @param {AuthenticateWithPasswordParameters} params - The password and user information.
   * @throws {DecryptionError} If the stored challenge failed to be decrypted.
   * @throws {InvalidPasswordError} If supplied password does not match the stored password.
   * @public
   */
  public async authenticateWithPassword({ password, user }: AuthenticateWithPasswordParameters): Promise<void> {
    const __logPrefix = `${Katavault.displayName}#authenticateWithPassword`;
    const vault = await Katavault._initializeVault({
      logger: this._logger,
      user,
    });
    const store = new PasswordStore({
      logger: this._logger,
      vault,
    });
    let encryptedChallenge = await store.challenge();
    let isVerified: boolean;

    // set the password
    store.setPassword(password);

    // if there is no stored challenge, encrypt a new one into the store.
    if (!encryptedChallenge) {
      this._logger.debug(`${__logPrefix}: initializing new password store`);

      encryptedChallenge = bytesToHex(await store.encryptBytes(encodeUtf8(PasswordStore.challenge)));

      await store.setChallenge(encryptedChallenge);
      await store.setLastUsedAt();
    }

    // if stored challenge exists, verify the supplied password
    if (encryptedChallenge) {
      this._logger.debug(`${__logPrefix}: password store exists`);

      isVerified = await store.verify();

      if (!isVerified) {
        throw new InvalidPasswordError('incorrect password');
      }
    }

    this._accountStore = new AccountStore({
      logger: this._logger,
      vault,
    });
    this._authenticationStore = {
      __type: AuthenticationMethod.Password,
      store,
    };
    this._user = user;
    this._vault = vault;
  }

  /**
   * Gets a list of accounts within the wallet.
   *
   * **NOTE:** Requires authentication.
   * @returns {Promise<Account[]>} A promise that resolves to the accounts stored in the wallet.
   * @throws {NotAuthenticatedError} If the Katavault has not been authenticated.
   * @public
   */
  public async accounts(): Promise<Account[]> {
    const items = await this._accountStore.accounts();

    if (!this.isAuthenticated()) {
      throw new NotAuthenticatedError('not authenticated');
    }

    let results: Account[] = [];

    for (const account of items) {
      let credentialID: string | null;
      let passkey: PasskeyStoreSchema | null;
      let passwordHash: string | null;

      switch (this._authenticationStore?.__type) {
        case AuthenticationMethod.Passkey:
          credentialID = (account as AccountStoreItemWithPasskey).credentialID ?? null;
          passkey = await this._authenticationStore.store.passkey();

          if (credentialID && passkey && credentialID === passkey.credentialID) {
            results.push({
              address: account.address,
              name: account.name,
            });
          }

          break;
        case AuthenticationMethod.Password:
          passwordHash = (account as AccountStoreItemWithPassword).passwordHash ?? null;

          // check if the account was encrypted using the correct password
          if (passwordHash && passwordHash === bytesToHex(this._authenticationStore.store.hash())) {
            results.push({
              address: account.address,
              name: account.name,
            });
          }

          break;
        default:
          break;
      }
    }

    return results;
  }

  /**
   * Deletes all accounts and settings.
   *
   * **NOTE:** Requires authentication.
   * @throws {NotAuthenticatedError} If the Katavault has not been authenticated.
   * @public
   */
  public async clear(): Promise<void> {
    if (!this.isAuthenticated()) {
      throw new NotAuthenticatedError('not authenticated');
    }

    this._authenticationStore = null;
    await this._vault.clear(IDB_ACCOUNTS_STORE_NAME);
    await this._vault.clear(IDB_PASSKEY_STORE_NAME);
    await this._vault.clear(IDB_PASSWORD_STORE_NAME);
  }

  /**
   * Generates a new account in the wallet.
   *
   * **NOTE:** Requires authentication.
   * @param {string} name - [optional] An optional name for the account. Defaults to undefined.
   * @returns {Promise<Account>} A promise that resolves to the created account.
   * @throws {EncryptionError} If the account's private key failed to be encrypted.
   * @throws {NotAuthenticatedError} If Katavault has not been authenticated.
   * @public
   */
  public async generateAccount(name?: string): Promise<Account> {
    const privateKey: Uint8Array = generatePrivateKey();
    const address = addressFromPrivateKey(privateKey);
    let encryptedKeyData: Uint8Array;
    let passkey: PasskeyStoreSchema | null;

    switch (this._authenticationStore?.__type) {
      case AuthenticationMethod.Passkey:
        encryptedKeyData = await this._authenticationStore.store.encryptBytes(privateKey);
        passkey = await this._authenticationStore.store.passkey();

        if (!passkey) {
          throw new NotAuthenticatedError('not authenticated');
        }

        await this._accountStore.upsert([
          {
            address,
            credentialID: passkey.credentialID,
            keyData: bytesToHex(encryptedKeyData),
            name,
          },
        ]);

        break;
      case AuthenticationMethod.Password:
        encryptedKeyData = await this._authenticationStore.store.encryptBytes(privateKey);

        await this._accountStore.upsert([
          {
            address,
            passwordHash: bytesToHex(this._authenticationStore.store.hash()),
            keyData: bytesToHex(encryptedKeyData),
            name,
          },
        ]);

        break;
      default:
        throw new NotAuthenticatedError('not authenticated');
    }

    return {
      address,
      name,
    };
  }

  /**
   * Checks if Katavault is authenticated.
   * @returns {boolean} True if Katavault is authenticated, false otherwise.
   * @private
   */
  public isAuthenticated(): boolean {
    return !!this._authenticationStore;
  }

  /**
   * Removes the account from the provider for the specified address if it exists.
   *
   * **NOTE:** Requires authentication.
   * @param {string} address - The address of the account to remove from the wallet.
   * @throws {NotAuthenticatedError} If the Katavault has not been authenticated.
   * @public
   */
  public async removeAccount(address: string): Promise<void> {
    const __logPrefix = `${Katavault.displayName}#removeAccount`;
    let results: string[];

    if (!this.isAuthenticated()) {
      throw new NotAuthenticatedError('not authenticated');
    }

    results = await this._accountStore.remove([address]);

    this._logger.debug(`${__logPrefix}: removed accounts [${results.map((value) => `"${value}"`).join(',')}]`);
  }

  public async signMessage(parameters: WithEncoding<SignMessageParameters>): Promise<string>;
  public async signMessage(parameters: Omit<SignMessageParameters, 'encoding'>): Promise<Uint8Array>;
  /**
   * Signs a message or some arbitrary bytes.
   *
   * **NOTE:** Requires authentication.
   * **NOTE:** The message is prepended with "MX" for domain separation.
   * @param {SignMessageParameters} parameters - The signer, the message and optional output encoding.
   * @returns {Promise<string | Uint8Array>} A promise that resolves to the signature of the signed message. If the
   * encoding parameter was specified, the signature will be encoded in that format, otherwise signature will be in raw
   * bytes.
   * @throws {NotAuthenticatedError} If the Katavault has not been authenticated.
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
