import { type Chain, type ChainWithNetworkParameters, networkParametersFromChain } from '@kibisis/chains';
import type { ILogger } from '@kibisis/utilities';

// constants
import {
  IDB_ACCOUNTS_STORE_NAME,
  IDB_PASSKEY_STORE_NAME,
  IDB_PASSWORD_STORE_NAME,
  IDB_SETTINGS_STORE_NAME,
} from '@/constants';

// decorators
import { AccountStore } from '@/decorators';

// enums
import { AccountTypeEnum, AuthenticationMethodEnum } from '@/enums';

// errors
import { FailedToFetchNetworkError, NotAuthenticatedError } from '@/errors';

// facades
import AppManager from './AppManager';

// types
import type {
  Account,
  // AuthenticateWithPasskeyParameters,
  // AuthenticateWithPasswordParameters,
  AuthenticationStore,
  ClientInformation,
  ConnectedAccountStoreItem,
  EphemeralAccountStoreItem,
  KatavaultParameters,
  PasskeyStoreSchema,
  UserInformation,
  Vault,
} from '@/types';

// utilities
import {
  // authenticateWithPasskey,
  // authenticateWithPassword,
  bytesToBase58,
  credentialID,
  // initializeVault,
  privateKeyFromPasswordCredentials,
  publicKeyFromPrivateKey,
  usernameFromVault,
} from '@/utilities';

export default class Katavault {
  // public static variables
  public static readonly displayName = 'Katavault';
  // private variables
  private _accountsStore: AccountStore;
  private readonly _appManager: AppManager;
  private _authenticationMethods: AuthenticationStore[];
  private _chains: ChainWithNetworkParameters[];
  private readonly _clientInformation: ClientInformation;
  private readonly _logger: ILogger;
  private _user: UserInformation | null = null;
  private _vault: Vault;

  public constructor({ chains, clientInformation, logger }: KatavaultParameters) {
    this._chains = chains;
    this._clientInformation = clientInformation;
    this._logger = logger;
    this._appManager = new AppManager({ logger });
  }

  /**
   * private methods
   */

  /**
   * Gets the decrypted ephemeral account's private key by the base58 encoded public key.
   * @param {string} key - The public key, encoded with base58, of the account to get the private key from.
   * @returns {Promise<Uint8Array>} A promise that resolves to the decrypted private key or null if the private key
   * could not be retrieved.
   * @throws {NotAuthenticatedError} If the Katavault has not been authenticated.
   * @throws {DecryptionError} If there was an issue with decryption or the credentials were not found.
   * @private
   */
  // private async _decryptEphemeralAccountByKey(key: string): Promise<Uint8Array | null> {
  //   const __logPrefix = `${Katavault.displayName}#_decryptEphemeralAccountByKey`;
  //   const account = await this._ephemeralAccountStore.accountByKey(key);
  //   let credentialID: string | null;
  //   let passkey: PasskeyStoreSchema | null;
  //   let passwordHash: string | null;
  //
  //   if (!account) {
  //     this._logger.debug(`${__logPrefix}: account "${key}" not found`);
  //
  //     return null;
  //   }
  //
  //   switch (this._authenticationStore?.__type) {
  //     case AuthenticationMethodEnum.Passkey:
  //       credentialID = (account as EphemeralAccountStoreItemWithPasskey).credentialID ?? null;
  //       passkey = await this._authenticationStore.store.passkey();
  //
  //       // check that the account is encrypted using the correct credential
  //       if (!credentialID || !passkey || credentialID !== passkey.credentialID) {
  //         this._logger.debug(
  //           `${__logPrefix}: account "${key}" found, but not encrypted using the supplied passkey`
  //         );
  //
  //         return null;
  //       }
  //
  //       return await this._authenticationStore.store.decryptBytes(base58ToBytes(account.keyData));
  //     case AuthenticationMethodEnum.Password:
  //       passwordHash = (account as EphemeralAccountStoreItemWithPassword).passwordHash ?? null;
  //
  //       // check if the account was encrypted using the correct password
  //       if (!passwordHash || passwordHash !== bytesToHex(this._authenticationStore.store.hash())) {
  //         this._logger.debug(
  //           `${__logPrefix}: account "${key}" found, but not encrypted using the supplied password`
  //         );
  //
  //         return null;
  //       }
  //
  //       return await this._authenticationStore.store.decryptBytes(base58ToBytes(account.keyData));
  //     default:
  //       throw new NotAuthenticatedError('not authenticated');
  //   }
  // }

  /**
   * Generates a credential account in the wallet. The credential account is an account derived from the user's
   * credential; for passkeys, this is the key material returned from the passkey; for passwords this is the combination
   * of the username, password and hostname.
   *
   * **NOTE:** Requires authentication.
   * @param {string} name - [optional] An optional name for the account. Defaults to undefined.
   * @returns {Promise<Account>} A promise that resolves to the generated credential account.
   * @throws {EncryptionError} If the account's private key failed to be encrypted.
   * @throws {NotAuthenticatedError} If Katavault has not been authenticated.
   * @public
   */
  // public async _generateCredentialAccount(name?: string): Promise<Account> {
  //   let encodedPublicKey: string;
  //   let encryptedKeyData: Uint8Array;
  //   let keyMaterial: Uint8Array | null;
  //   let passkey: PasskeyStoreSchema | null;
  //   let password: string | null;
  //   let privateKey: Uint8Array;
  //
  //   switch (this._authenticationMethods?.__type) {
  //     case AuthenticationMethodEnum.Passkey:
  //       keyMaterial = this._authenticationMethods.store.keyMaterial();
  //       passkey = await this._authenticationMethods.store.passkey();
  //
  //       if (!keyMaterial || !passkey) {
  //         throw new NotAuthenticatedError('not authenticated');
  //       }
  //
  //       encodedPublicKey = bytesToBase58(publicKeyFromPrivateKey(keyMaterial));
  //       encryptedKeyData = await this._authenticationMethods.store.encryptBytes(keyMaterial); // use the passkey material - it will contain a high enough entropy to be secure
  //
  //       await this._accountsStore.upsert([
  //         {
  //           __type: AccountTypeEnum.Ephemeral,
  //           credentialID: credentialID({
  //             method: AuthenticationMethodEnum.Passkey,
  //             passkeyCredentialID: passkey.credentialID,
  //           }),
  //           key: encodedPublicKey,
  //           keyData: bytesToBase58(encryptedKeyData),
  //           name,
  //         },
  //       ]);
  //
  //       return {
  //         __type: AccountTypeEnum.Ephemeral,
  //         key: encodedPublicKey,
  //         name,
  //       };
  //     case AuthenticationMethodEnum.Password:
  //       password = this._authenticationMethods.store.password();
  //
  //       if (!password || !this._user) {
  //         throw new NotAuthenticatedError('not authenticated');
  //       }
  //
  //       privateKey = await privateKeyFromPasswordCredentials({
  //         hostname: this._clientInformation.hostname,
  //         password,
  //         username: this._user.username,
  //       });
  //       encodedPublicKey = bytesToBase58(publicKeyFromPrivateKey(privateKey));
  //       encryptedKeyData = await this._authenticationMethods.store.encryptBytes(privateKey);
  //
  //       await this._accountsStore.upsert([
  //         {
  //           __type: AccountTypeEnum.Ephemeral,
  //           credentialID: credentialID({
  //             method: AuthenticationMethodEnum.Password,
  //             password,
  //           }),
  //           key: encodedPublicKey,
  //           keyData: bytesToBase58(encryptedKeyData),
  //           name,
  //         },
  //       ]);
  //
  //       return {
  //         __type: AccountTypeEnum.Ephemeral,
  //         key: encodedPublicKey,
  //         name,
  //       };
  //     default:
  //       throw new NotAuthenticatedError('not authenticated');
  //   }
  // }

  /**
   * public methods
   */

  /**
   * Gets a list of accounts within the wallet.
   *
   * **NOTE:** Requires authentication.
   * @returns {Promise<Account[]>} A promise that resolves to the accounts stored in the wallet.
   * @throws {NotAuthenticatedError} If the Katavault has not been authenticated.
   * @public
   */
  public async accounts(): Promise<Account[]> {
    let accounts: (ConnectedAccountStoreItem | EphemeralAccountStoreItem)[];

    if (!this.isAuthenticated()) {
      throw new NotAuthenticatedError('not authenticated');
    }

    accounts = await this._accountsStore.accounts();

    return accounts.map(({ __type, key, name }) => ({
      __type,
      key,
      name,
    }));
  }

  /**
   * Adds the new chain to the list of supported chains if it does not already exist, otherwise it updates the existing
   * chain by the genesis hash.
   * @param {Chain} chain - The chain to be added.
   * @throws {FailedToFetchNetworkError} If the chain's network parameters could not be fetched.
   * @public
   */
  public async addChain(chain: Chain): Promise<ChainWithNetworkParameters> {
    const __logPrefix = `${Katavault.displayName}#addChain`;
    let index: number;
    let _chain: ChainWithNetworkParameters;
    let _error: string;

    try {
      _chain = await networkParametersFromChain(chain);
      index = this._chains.findIndex(({ genesisHash }) => genesisHash === _chain.genesisHash);

      // if the chain already exists, update the chain
      if (index >= 0) {
        this._chains[index] = _chain;

        return _chain;
      }

      // otherwise, add the chain
      this._chains.push(_chain);

      return _chain;
    } catch (error) {
      _error = `failed to add chain "${chain.displayName}"`;

      this._logger.error(`${__logPrefix}: ${_error} - `, error);

      throw new FailedToFetchNetworkError(_error);
    }
  }

  /**
   * Opens up a modal to allow the user to choose how to authenticate.
   * @throws {DecryptionError} If the stored challenge failed to be decrypted.
   * @throws {FailedToAuthenticatePasskeyError} If the authenticator did not return the public key credentials.
   * @throws {FailedToRegisterPasskeyError} If the public key credentials failed to be created on the authenticator.
   * @throws {InvalidPasswordError} If supplied password does not match the stored password.
   * @throws {PasskeyNotSupportedError} If the browser does not support WebAuthn or the authenticator does not support.
   * @throws {UserCanceledPasskeyRequestError} If the user canceled the request or the request timed out.
   * @throws {UserCanceledUIRequestError} If the user canceled the request.
   * @public
   */
  public async authenticate(): Promise<void> {
    const __logPrefix = `${Katavault.displayName}#authenticate`;
    const { authenticationStore, vault } = await this._appManager.renderAuthenticationApp({
      clientInformation: this._clientInformation,
    });
    let accounts: Account[];

    this._accountsStore = new AccountStore({
      logger: this._logger,
      vault,
    });
    this._authenticationMethods = [authenticationStore];
    this._vault = vault;

    // accounts = await this.accounts();

    // if no ephemeral accounts exist, create a new one from the account credentials
    // if (!accounts.some(({ __type }) => __type === AccountTypeEnum.Ephemeral)) {
    //   const { key } = await this._generateCredentialAccount();
    //
    //   this._logger.debug(`${__logPrefix}: created new credential account "${key}" for user "${user.username}"`);
    // }
  }

  /**
   * Authenticates with a passkey.
   * @param {AuthenticateWithPasskeyParameters} params - The user information.
   * @param {UserInformation} params.user - The user information.
   * @throws {FailedToAuthenticatePasskeyError} If the authenticator did not return the public key credentials.
   * @throws {FailedToRegisterPasskeyError} If the public key credentials failed to be created on the authenticator.
   * @throws {PasskeyNotSupportedError} If the browser does not support WebAuthn or the authenticator does not support.
   * @throws {UserCanceledPasskeyRequestError} If the user canceled the request or the request timed out.
   * @public
   */
  // public async authenticateWithPasskey({ user }: AuthenticateWithPasskeyParameters): Promise<void> {
  //   const __logPrefix = `${Katavault.displayName}#authenticateWithPasskey`;
  //   const vault = await initializeVault({
  //     logger: this._logger,
  //     username: user.username,
  //   });
  //   let accounts: (ConnectedAccountStoreItem | EphemeralAccountStoreItem)[];
  //
  //   this._authenticationMethods = {
  //     __type: AuthenticationMethodEnum.Passkey,
  //     store: await authenticateWithPasskey({
  //       clientInformation: this._clientInformation,
  //       logger: this._logger,
  //       user,
  //       vault,
  //     }),
  //   };
  //   this._accountsStore = new AccountStore({
  //     logger: this._logger,
  //     vault,
  //   });
  //   this._user = user;
  //   this._vault = vault;
  //
  //   accounts = await this._accountsStore.accounts();
  //
  //   // if no ephemeral account for the credentials exists, create a new one
  //   if (!accounts.some(({ __type }) => __type === AccountTypeEnum.Ephemeral)) {
  //     const { key } = await this._generateCredentialAccount(user.displayName ?? user.username);
  //
  //     this._logger.debug(`${__logPrefix}: created new credential account "${key}" for user "${user.username}"`);
  //   }
  // }

  /**
   * Authenticates with the supplied password.
   * @param {AuthenticateWithPasswordParameters} params - The password and user information.
   * @param {string} params.password - The password.
   * @param {UserInformation} params.user - The user information.
   * @throws {DecryptionError} If the stored challenge failed to be decrypted.
   * @throws {InvalidPasswordError} If supplied password does not match the stored password.
   * @public
   */
  // public async authenticateWithPassword({ password, user }: AuthenticateWithPasswordParameters): Promise<void> {
  //   const __logPrefix = `${Katavault.displayName}#authenticateWithPassword`;
  //   const vault = await initializeVault({
  //     logger: this._logger,
  //     username: user.username,
  //   });
  //   let accounts: Account[];
  //
  //   this._authenticationMethods = {
  //     __type: AuthenticationMethodEnum.Password,
  //     store: await authenticateWithPassword({
  //       logger: this._logger,
  //       password,
  //       user,
  //       vault,
  //     }),
  //   };
  //   this._accountsStore = new AccountStore({
  //     logger: this._logger,
  //     vault,
  //   });
  //   this._user = user;
  //   this._vault = vault;
  //
  //   accounts = await this.accounts();
  //
  //   // if no ephemeral accounts exist, create a new one from the account credentials
  //   if (!accounts.some(({ __type }) => __type === AccountTypeEnum.Ephemeral)) {
  //     const { key } = await this._generateCredentialAccount(user.displayName ?? user.username);
  //
  //     this._logger.debug(`${__logPrefix}: created new credential account "${key}" for user "${user.username}"`);
  //   }
  // }

  /**
   * Gets the supported chains.
   * @returns {ChainWithNetworkParameters[]} The supported chains.
   * @public
   */
  public chains(): ChainWithNetworkParameters[] {
    return this._chains;
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

    this._authenticationMethods = [];
    await this._vault.clear(IDB_ACCOUNTS_STORE_NAME);
    await this._vault.clear(IDB_PASSKEY_STORE_NAME);
    await this._vault.clear(IDB_PASSWORD_STORE_NAME);
    await this._vault.clear(IDB_SETTINGS_STORE_NAME);
  }

  /**
   * Checks if Katavault is authenticated.
   * @returns {boolean} True if Katavault is authenticated, false otherwise.
   * @private
   */
  public isAuthenticated(): boolean {
    return !!this._authenticationMethods;
  }

  /**
   * Removes the account from the provider for the specified key if it exists.
   *
   * **NOTE:** Requires authentication.
   * @param {string} key - The key, encoded with base58, of the account to remove from the wallet.
   * @throws {NotAuthenticatedError} If the Katavault has not been authenticated.
   * @public
   */
  public async removeAccountByKey(key: string): Promise<void> {
    const __logPrefix = `${Katavault.displayName}#removeAccount`;
    let results: string[];

    if (!this.isAuthenticated()) {
      throw new NotAuthenticatedError('not authenticated');
    }

    results = await this._accountsStore.remove([key]);

    this._logger.debug(`${__logPrefix}: removed accounts [${results.map((value) => `"${value}"`).join(',')}]`);
  }

  /**
   * Removes a chain from the list of supported chains based on the provided genesis hash.
   * @param {string} genesisHash - The base64 encoded genesis hash of the chain to be removed.
   * @public
   */
  public removeChainByGenesisHash(genesisHash: string): void {
    this._chains = this._chains.filter(({ genesisHash: _genesisHash }) => _genesisHash !== genesisHash);
  }

  /**
   * Updates the name of the account.
   * @param {SetAccountNameByKeyParameters} params - The address and name to set.
   * @returns {Promise<Account>} A promise that resolves to the updated account.
   * @throws {AccountDoesNotExistError} If the specified address does not exist in the wallet.
   * @public
   */
  // public async setAccountNameByKey({ key, name }: SetAccountNameByKeyParameters): Promise<Account> {
  //   const account = await this._accountsStore.accountByKey(key);
  //
  //   if (!account) {
  //     throw new AccountDoesNotExistError(`account "${key}" does not exist`);
  //   }
  //
  //   await this._accountsStore.upsert([
  //     {
  //       ...account,
  //       name,
  //     },
  //   ]);
  //
  //   return {
  //     __type: account.__type,
  //     key,
  //     name,
  //   };
  // }

  // public async signMessage(parameters: WithEncoding<SignMessageParameters>): Promise<string>;
  // public async signMessage(parameters: Omit<SignMessageParameters, 'encoding'>): Promise<Uint8Array>;
  /**
   * Signs a message or some arbitrary bytes.
   *
   * **NOTE:** Requires authentication.
   * **NOTE:** The message is prepended with "MX" for domain separation.
   * @param {SignMessageParameters} params - The signer, the message and optional output encoding.
   * @returns {Promise<string | Uint8Array>} A promise that resolves to the signature of the signed message. If the
   * encoding parameter was specified, the signature will be encoded in that format, otherwise signature will be in raw
   * bytes.
   * @throws {NotAuthenticatedError} If the Katavault has not been authenticated.
   * @throws {AccountDoesNotExistError} If the specified address does not exist in the wallet.
   * @see {@link https://algorand.github.io/js-algorand-sdk/functions/signBytes.html}
   * @public
   */
  // public async signMessage({ address, encoding, message }: SignMessageParameters): Promise<string | Uint8Array> {
  //   const privateKey = await this._decryptedAccountKeyByAddress(address);
  //   let signature: Uint8Array;
  //   let toSign: Uint8Array;
  //
  //   if (!privateKey) {
  //     throw new AccountDoesNotExistError(`account "${address}" does not exist`);
  //   }
  //
  //   toSign = concatBytes(
  //     utf8ToBytes(SIGN_MESSAGE_PREFIX), // "MX" prefix
  //     typeof message === 'string' ? utf8ToBytes(message) : message
  //   );
  //   signature = ed25519.sign(toSign, privateKey);
  //
  //   switch (encoding) {
  //     case 'base64':
  //       return bytesToBase64(signature);
  //     case 'hex':
  //       return bytesToHex(signature);
  //     default:
  //       return signature;
  //   }
  // }
}
