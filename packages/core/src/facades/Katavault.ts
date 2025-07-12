import { type Chain, type ChainWithNetworkParameters, networkParametersFromChain } from '@kibisis/chains';
import type { ILogger } from '@kibisis/utilities';
// import { ed25519 } from '@noble/curves/ed25519';
// import { concatBytes } from '@noble/hashes/utils';
import { type IDBPDatabase, openDB } from 'idb';

// constants
import {
  IDB_CONFIG_STORE_NAME,
  IDB_DB_NAME,
  IDB_EPHEMERAL_ACCOUNTS_STORE_NAME,
  IDB_PASSKEY_STORE_NAME,
  IDB_PASSWORD_STORE_NAME,
  // SIGN_MESSAGE_PREFIX,
} from '@/constants';

// decorators
import { EphemeralAccountStore } from '@/decorators';

// enums
import { AccountTypeEnum, AuthenticationMethodEnum } from '@/enums';

// errors
import {
  AccountDoesNotExistError,
  FailedToFetchNetworkError,
  // InvalidAccountError,
  NotAuthenticatedError,
} from '@/errors';

// facades
import AppManager from './AppManager';

// types
import type {
  Account,
  // AddAccountParameters,
  AuthenticateWithPasskeyParameters,
  AuthenticateWithPasswordParameters,
  AuthenticationStore,
  ClientInformation,
  EphemeralAccountStoreItemWithPasskey,
  EphemeralAccountStoreItemWithPassword,
  // ImportAccountWithMnemonicParameters,
  // ImportAccountWithPrivateKeyParameters,
  KatavaultParameters,
  PasskeyStoreSchema,
  SetAccountNameByKeyParameters,
  // SignMessageParameters,
  UserInformation,
  Vault,
  VaultSchema,
  // WithEncoding,
} from '@/types';

// utilities
import {
  // addressFromPrivateKey,
  authenticateWithPasskey,
  authenticateWithPassword,
  // base58ToBytes,
  bytesToBase58,
  // bytesToBase64,
  bytesToHex,
  // generatePrivateKey,
  // isValidMnemonic,
  // privateKeyFromMnemonic,
  privateKeyFromPasswordCredentials,
  publicKeyFromPrivateKey,
  // utf8ToBytes,
} from '@/utilities';

export default class Katavault {
  // public static variables
  public static readonly displayName = 'Katavault';
  // private variables
  private readonly _appManager: AppManager;
  private _authenticationStore: AuthenticationStore | null = null;
  private _chains: ChainWithNetworkParameters[];
  private readonly _clientInformation: ClientInformation;
  private _ephemeralAccountStore: EphemeralAccountStore;
  private readonly _logger: ILogger;
  private _user: UserInformation | null = null;
  private _vault: IDBPDatabase<VaultSchema>;

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
   * Adds the account to the provider.
   * @param {AddAccountParameters} params - The account to be added.
   * @returns {Promise<Account>} A promise that resolves to the added account.
   * @throws {EncryptionError} If the account's private key failed to be encrypted.
   * @throws {NotAuthenticatedError} If the Katavault has not been authenticated.
   * @private
   */
  // private async _addAccount({ name, privateKey }: AddAccountParameters): Promise<Account> {
  //   const address = addressFromPrivateKey(privateKey);
  //   let encryptedKeyData: Uint8Array;
  //   let passkey: PasskeyStoreSchema | null;
  //
  //   switch (this._authenticationStore?.__type) {
  //     case AuthenticationMethodEnum.Passkey:
  //       encryptedKeyData = await this._authenticationStore.store.encryptBytes(privateKey);
  //       passkey = await this._authenticationStore.store.passkey();
  //
  //       if (!passkey) {
  //         throw new NotAuthenticatedError('not authenticated');
  //       }
  //
  //       await this._ephemeralAccountStore.upsert([
  //         {
  //           address,
  //           credentialID: passkey.credentialID,
  //           keyData: bytesToHex(encryptedKeyData),
  //           name,
  //         },
  //       ]);
  //
  //       break;
  //     case AuthenticationMethodEnum.Password:
  //       encryptedKeyData = await this._authenticationStore.store.encryptBytes(privateKey);
  //
  //       await this._ephemeralAccountStore.upsert([
  //         {
  //           address,
  //           passwordHash: bytesToHex(this._authenticationStore.store.hash()),
  //           keyData: bytesToHex(encryptedKeyData),
  //           name,
  //         },
  //       ]);
  //
  //       break;
  //     default:
  //       throw new NotAuthenticatedError('not authenticated');
  //   }
  //
  //   return {
  //     address,
  //     name,
  //   };
  // }

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
  public async _generateCredentialAccount(name?: string): Promise<Account> {
    let encodedPublicKey: string;
    let encryptedKeyData: Uint8Array;
    let keyMaterial: Uint8Array | null;
    let passkey: PasskeyStoreSchema | null;
    let password: string | null;
    let privateKey: Uint8Array;

    switch (this._authenticationStore?.__type) {
      case AuthenticationMethodEnum.Passkey:
        keyMaterial = this._authenticationStore.store.keyMaterial();
        passkey = await this._authenticationStore.store.passkey();

        if (!keyMaterial || !passkey) {
          throw new NotAuthenticatedError('not authenticated');
        }

        encodedPublicKey = bytesToBase58(publicKeyFromPrivateKey(keyMaterial));
        encryptedKeyData = await this._authenticationStore.store.encryptBytes(keyMaterial); // use the passkey material - it will contain a high enough entropy to be secure

        await this._ephemeralAccountStore.upsert([
          {
            __type: AccountTypeEnum.Ephemeral,
            key: encodedPublicKey,
            credentialID: passkey.credentialID,
            keyData: bytesToBase58(encryptedKeyData),
            name,
          },
        ]);

        return {
          __type: AccountTypeEnum.Ephemeral,
          key: encodedPublicKey,
          name,
        };
      case AuthenticationMethodEnum.Password:
        password = this._authenticationStore.store.password();

        if (!password || !this._user) {
          throw new NotAuthenticatedError('not authenticated');
        }

        privateKey = await privateKeyFromPasswordCredentials({
          hostname: this._clientInformation.hostname,
          password,
          username: this._user.username,
        });
        encodedPublicKey = bytesToBase58(publicKeyFromPrivateKey(privateKey));
        encryptedKeyData = await this._authenticationStore.store.encryptBytes(privateKey);

        await this._ephemeralAccountStore.upsert([
          {
            __type: AccountTypeEnum.Ephemeral,
            key: encodedPublicKey,
            passwordHash: bytesToHex(this._authenticationStore.store.hash()),
            keyData: bytesToBase58(encryptedKeyData),
            name,
          },
        ]);

        return {
          __type: AccountTypeEnum.Ephemeral,
          key: encodedPublicKey,
          name,
        };
      default:
        throw new NotAuthenticatedError('not authenticated');
    }
  }

  /**
   * Initializes the vault connection.
   * @returns {Promise<Vault>} A promise that resolves to the initialized vault.
   * @private
   */
  private async _initializeVault(): Promise<Vault> {
    const __logPrefix = `${Katavault.displayName}#_initializeVault`;

    return await openDB<VaultSchema>(IDB_DB_NAME, undefined, {
      upgrade: (_db, oldVersion, newVersion) => {
        // we are creating a new database
        if (oldVersion <= 0 && newVersion && newVersion > 0) {
          // create the stores
          _db.createObjectStore(IDB_EPHEMERAL_ACCOUNTS_STORE_NAME);
          _db.createObjectStore(IDB_CONFIG_STORE_NAME);
          _db.createObjectStore(IDB_PASSKEY_STORE_NAME);
          _db.createObjectStore(IDB_PASSWORD_STORE_NAME);

          this._logger.debug(`${__logPrefix}: created new vault "${IDB_DB_NAME}"`);
        }
      },
    });
  }

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
    const ephemeralAccounts = await this._ephemeralAccountStore.accounts();

    if (!this.isAuthenticated()) {
      throw new NotAuthenticatedError('not authenticated');
    }

    let results: Account[] = [];

    for (const account of ephemeralAccounts) {
      let credentialID: string | null;
      let passkey: PasskeyStoreSchema | null;
      let passwordHash: string | null;

      switch (this._authenticationStore?.__type) {
        case AuthenticationMethodEnum.Passkey:
          credentialID = (account as EphemeralAccountStoreItemWithPasskey).credentialID ?? null;
          passkey = await this._authenticationStore.store.passkey();

          if (credentialID && passkey && credentialID === passkey.credentialID) {
            results.push({
              __type: account.__type,
              key: account.key,
              name: account.name,
            });
          }

          break;
        case AuthenticationMethodEnum.Password:
          passwordHash = (account as EphemeralAccountStoreItemWithPassword).passwordHash ?? null;

          // check if the account was encrypted using the correct password
          if (passwordHash && passwordHash === bytesToHex(this._authenticationStore.store.hash())) {
            results.push({
              __type: account.__type,
              key: account.key,
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
    const vault = await this._initializeVault();
    const { authenticationStore, user } = await this._appManager.renderAuthenticationApp({
      clientInformation: this._clientInformation,
      vault,
    });
    let accounts: Account[];

    this._ephemeralAccountStore = new EphemeralAccountStore({
      logger: this._logger,
      vault,
    });
    this._authenticationStore = authenticationStore;
    this._user = user;
    this._vault = vault;

    accounts = await this.accounts();

    // if no ephemeral accounts exist, create a new one from the account credentials
    if (!accounts.some(({ __type }) => __type === AccountTypeEnum.Ephemeral)) {
      const { key } = await this._generateCredentialAccount(user.displayName ?? user.username);

      this._logger.debug(`${__logPrefix}: created new credential account "${key}" for user "${user.username}"`);
    }
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
  public async authenticateWithPasskey({ user }: AuthenticateWithPasskeyParameters): Promise<void> {
    const __logPrefix = `${Katavault.displayName}#authenticateWithPasskey`;
    const vault = await this._initializeVault();
    let accounts: Account[];

    this._authenticationStore = {
      __type: AuthenticationMethodEnum.Passkey,
      store: await authenticateWithPasskey({
        clientInformation: this._clientInformation,
        logger: this._logger,
        user,
        vault,
      }),
    };
    this._ephemeralAccountStore = new EphemeralAccountStore({
      logger: this._logger,
      vault,
    });
    this._user = user;
    this._vault = vault;

    accounts = await this.accounts();

    // if no ephemeral accounts exist, create a new one from the account credentials
    if (!accounts.some(({ __type }) => __type === AccountTypeEnum.Ephemeral)) {
      const { key } = await this._generateCredentialAccount(user.displayName ?? user.username);

      this._logger.debug(`${__logPrefix}: created new credential account "${key}" for user "${user.username}"`);
    }
  }

  /**
   * Authenticates with the supplied password.
   * @param {AuthenticateWithPasswordParameters} params - The password and user information.
   * @param {string} params.password - The password.
   * @param {UserInformation} params.user - The user information.
   * @throws {DecryptionError} If the stored challenge failed to be decrypted.
   * @throws {InvalidPasswordError} If supplied password does not match the stored password.
   * @public
   */
  public async authenticateWithPassword({ password, user }: AuthenticateWithPasswordParameters): Promise<void> {
    const __logPrefix = `${Katavault.displayName}#authenticateWithPassword`;
    const vault = await this._initializeVault();
    let accounts: Account[];

    this._authenticationStore = {
      __type: AuthenticationMethodEnum.Password,
      store: await authenticateWithPassword({
        logger: this._logger,
        password,
        user,
        vault,
      }),
    };
    this._ephemeralAccountStore = new EphemeralAccountStore({
      logger: this._logger,
      vault,
    });
    this._user = user;
    this._vault = vault;

    accounts = await this.accounts();

    // if no ephemeral accounts exist, create a new one from the account credentials
    if (!accounts.some(({ __type }) => __type === AccountTypeEnum.Ephemeral)) {
      const { key } = await this._generateCredentialAccount(user.displayName ?? user.username);

      this._logger.debug(`${__logPrefix}: created new credential account "${key}" for user "${user.username}"`);
    }
  }

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

    this._authenticationStore = null;
    await this._vault.clear(IDB_EPHEMERAL_ACCOUNTS_STORE_NAME);
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
  // public async generateAccount(name?: string): Promise<Account> {
  //   return await this._addAccount({
  //     name,
  //     privateKey: generatePrivateKey(),
  //   });
  // }

  /**
   * Imports an account from a 25-word mnemonic.
   *
   * **NOTE:** Requires authentication.
   * @param {ImportAccountWithPrivateKeyParameters} params - The 25-word mnemonic of the account to be imported and an
   * optional name for the account.
   * @returns {Promise<Account>} A promise that resolves to the imported account.
   * @throws {InvalidAccountError} If the supplied mnemonic is not valid.
   * @throws {EncryptionError} If the account's private key failed to be encrypted.
   * @throws {NotAuthenticatedError} If Katavault has not been authenticated.
   * @public
   */
  // public async importAccountFromMnemonic({ mnemonic, name }: ImportAccountWithMnemonicParameters): Promise<Account> {
  //   const formattedMnemonic = mnemonic
  //     .trim()
  //     .split(/[\s,]+/) // split on whitespace and commas
  //     .join(' '); // join back together with whitespace
  //
  //   if (isValidMnemonic(formattedMnemonic)) {
  //     throw new InvalidAccountError('invalid mnemonic');
  //   }
  //
  //   return await this._addAccount({
  //     name,
  //     privateKey: privateKeyFromMnemonic(formattedMnemonic),
  //   });
  // }

  /**
   * Imports an account from a private key.
   *
   * **NOTE:** Requires authentication.
   * @param {ImportAccountWithPrivateKeyParameters} params - The private key of the account to be imported and an
   * optional name for the account.
   * @returns {Promise<Account>} A promise that resolves to the imported account.
   * @throws {EncryptionError} If the account's private key failed to be encrypted.
   * @throws {NotAuthenticatedError} If Katavault has not been authenticated.
   * @public
   */
  // public async importAccountFromPrivateKey({
  //   name,
  //   privateKey,
  // }: ImportAccountWithPrivateKeyParameters): Promise<Account> {
  //   return await this._addAccount({
  //     name,
  //     privateKey,
  //   });
  // }

  /**
   * Checks if Katavault is authenticated.
   * @returns {boolean} True if Katavault is authenticated, false otherwise.
   * @private
   */
  public isAuthenticated(): boolean {
    return !!this._authenticationStore;
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

    results = await this._ephemeralAccountStore.remove([key]);

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
  public async setAccountNameByKey({ key, name }: SetAccountNameByKeyParameters): Promise<Account> {
    const account = await this._ephemeralAccountStore.accountByKey(key);

    if (!account) {
      throw new AccountDoesNotExistError(`account "${key}" does not exist`);
    }

    await this._ephemeralAccountStore.upsert([
      {
        ...account,
        name,
      },
    ]);

    return {
      __type: account.__type,
      key,
      name,
    };
  }

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
