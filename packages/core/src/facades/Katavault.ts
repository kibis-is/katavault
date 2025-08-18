import { CAIP002Namespace, type Chain, type ChainConstructor } from '@kibisis/chains';
import { base58, base64, hex } from '@kibisis/encoding';

// _base
import { BaseClass } from '@/_base';

// constants
import {
  BALANCE_FETCH_DELAY,
  BALANCES_UPDATE_TIMEOUT,
  IDB_ACCOUNTS_STORE_NAME,
  IDB_PASSKEY_STORE_NAME,
  IDB_PASSWORD_STORE_NAME,
  IDB_SETTINGS_STORE_NAME,
} from '@/constants';

// decorators
import { AccountStore, CredentialID } from '@/decorators';

// enums
import { AccountTypeEnum, AppTypeEnum, AuthenticationMethodEnum, EphemeralAccountOriginEnum } from '@/enums';

// errors
import {
  AccountDoesNotExistError,
  BaseError,
  ChainNotSupportedError,
  FailedToFetchChainInformationError,
  NotAuthenticatedError,
} from '@/errors';

// events
import { AccountsUpdatedEvent } from '@/events';

// facades
import AppManager from './AppManager';

// strategies
import { BalancesContext, SignContext, TransactionContext } from '@/strategies';

// types
import type {
  Account,
  AuthenticateWithPasskeyParameters,
  AuthenticateWithPasswordParameters,
  AuthenticationStore,
  Balance,
  ClientInformation,
  ConnectedAccountStoreItem,
  EphemeralAccount,
  EphemeralAccountStoreItem,
  KatavaultParameters,
  PasskeyStoreSchema,
  RenderVaultAppParameters,
  SendRawTransactionParameters,
  SendRawTransactionResult,
  SetAccountNameByKeyParameters,
  SignMessageParameters,
  SignRawTransactionParameters,
  SignRawTransactionResult,
  Vault,
  WithAccountStoreItem,
  WithChain,
  WithEncoding,
  WithIndex,
} from '@/types';

// utilities
import {
  authenticateWithPasskey,
  authenticateWithPassword,
  initializeVault,
  publicKeyFromPrivateKey,
  usernameFromVault,
} from '@/utilities';

export default class Katavault extends BaseClass {
  /**
   * public static properties
   */
  public static readonly displayName = 'Katavault';
  /**
   * private properties
   */
  private _accountsStore: AccountStore | null = null;
  private readonly _appManager: AppManager;
  private _authenticationStore: AuthenticationStore | null = null;
  private readonly _balancesContext: BalancesContext;
  private _pollingBalanceID: number | null = null;
  private _chains: Chain[];
  private _debug: boolean;
  private readonly _clientInformation: ClientInformation;
  private readonly _signContext: SignContext;
  private readonly _transactionContext: TransactionContext;
  private _vault: Vault | null = null;

  public constructor({ chains, clientInformation, debug = false, ...commonParams }: KatavaultParameters) {
    super(commonParams);

    this._chains = chains;
    this._clientInformation = clientInformation;
    this._debug = debug;
    this._appManager = new AppManager(commonParams);
    this._balancesContext = new BalancesContext(commonParams);
    this._signContext = new SignContext(commonParams);
    this._transactionContext = new TransactionContext(commonParams);
  }

  /**
   * private methods
   */

  /**
   * Updates the balances for all the ephemeral accounts for each chain. A small delay is added between each fetch on
   * the same chain to avoid rate limits.
   *
   * On completion, a `kv:ev:accounts_updated` is sent to let the app know the application has been updated.
   *
   * @private
   * @async
   */
  private async _updateBalances(): Promise<void> {
    const __logPrefix = `${Katavault.displayName}#_updateBalances`;
    let account: EphemeralAccountStoreItem;
    let accounts: EphemeralAccountStoreItem[];
    let username: string;

    if (!this._vault || !this._accountsStore) {
      return;
    }

    accounts = (await this._accountsStore.accounts()).filter(
      ({ __type }) => __type === AccountTypeEnum.Ephemeral
    ) as EphemeralAccountStoreItem[];

    for (const chain of this._chains) {
      for (let i = 0; i < accounts.length; i++) {
        account = accounts[i];

        try {
          accounts[i].balances[chain.chainID()] = await this._balancesContext.balance({
            account,
            chain,
            delay: i > 0 ? 0 : BALANCE_FETCH_DELAY, // for accounts on the same network, add a small delay to avoid rate limits
          });
        } catch (error) {
          this._logger.error(`${__logPrefix}:`, error);
        }
      }
    }

    // save to the vault store
    await this._accountsStore.upsert(accounts);

    username = usernameFromVault(this._vault);

    this._logger.debug(`${__logPrefix}: updated balances for user "${username}"`);

    // emit an event for this user
    window.dispatchEvent(new AccountsUpdatedEvent(username));
  }

  /**
   * Generates a credential account in the wallet. The credential account is an account derived from the user's
   * credential; for passkeys, this is the key material returned from the passkey; for passwords this is the combination
   * of the username, password and hostname.
   *
   * **NOTE:** Requires authentication.
   *
   * @returns {Promise<Account>} A promise that resolves to the generated credential account.
   * @throws {EncryptionError} If the account's private key failed to be encrypted.
   * @throws {NotAuthenticatedError} If Katavault has not been authenticated.
   * @private
   */
  private async _generateCredentialAccountIfNoneExists(): Promise<EphemeralAccount> {
    const __logPrefix = `${Katavault.displayName}#_generateCredentialAccountIfNoneExists`;
    let account: EphemeralAccountStoreItem | null;
    let accounts: (ConnectedAccountStoreItem | EphemeralAccountStoreItem)[];
    let balances: Record<string, Balance>;
    let _credentialID: CredentialID;
    let encryptedKeyData: Uint8Array;
    let key: string;
    let passkey: PasskeyStoreSchema | null;
    let password: string | null;
    let privateKey: Uint8Array;
    let username: string;

    if (!this._accountsStore || !this._authenticationStore || !this._vault) {
      throw new NotAuthenticatedError('not authenticated');
    }

    username = usernameFromVault(this._vault);
    accounts = await this._accountsStore.accounts();
    balances = this._chains.reduce<Record<string, Balance>>(
      (acc, currentValue) => ({
        ...acc,
        [currentValue.chainID()]: {
          amount: '0',
          block: '0',
          lastUpdatedAt: '0',
        },
      }),
      {}
    );

    switch (this._authenticationStore?.__type) {
      case AuthenticationMethodEnum.Passkey:
        passkey = await this._authenticationStore.store.passkey();

        if (!passkey) {
          throw new NotAuthenticatedError('not authenticated');
        }

        _credentialID = CredentialID.create({
          method: AuthenticationMethodEnum.Passkey,
          passkeyCredentialID: passkey.credentialID,
        });
        privateKey = await this._authenticationStore.store.derivePrivateKey();
        key = base58.encode(publicKeyFromPrivateKey(privateKey));

        // check if the credential account exists
        account =
          (accounts.find(
            (value) =>
              value.__type === AccountTypeEnum.Ephemeral &&
              value.credentialID === _credentialID.toString() &&
              value.key === key
          ) as EphemeralAccountStoreItem | undefined) ?? null;

        if (account) {
          this._logger.debug(
            `${__logPrefix}: credential account "${key}" for user "${username}" using "${this._authenticationStore.__type}" already exists`
          );

          return {
            __type: account.__type,
            balances: account.balances,
            key: account.key,
            name: account.name,
            origin: account.origin,
          };
        }

        encryptedKeyData = await this._authenticationStore.store.encryptBytes(privateKey); // use the passkey material - it will contain a high enough entropy to be secure
        account = {
          __type: AccountTypeEnum.Ephemeral,
          balances,
          credentialID: _credentialID.toString(),
          key,
          keyData: base58.encode(encryptedKeyData),
          name: username,
          origin: EphemeralAccountOriginEnum.Credential,
        };

        await this._accountsStore.upsert([account]);

        this._logger.debug(
          `${__logPrefix}: created credential account "${key}" for user "${username}" using "${this._authenticationStore.__type}"`
        );

        return {
          __type: account.__type,
          balances: account.balances,
          key: account.key,
          name: account.name,
          origin: account.origin,
        };
      case AuthenticationMethodEnum.Password:
        password = this._authenticationStore.store.password();

        if (!password) {
          throw new NotAuthenticatedError('not authenticated');
        }

        _credentialID = CredentialID.create({
          method: AuthenticationMethodEnum.Password,
          password,
        });
        privateKey = await this._authenticationStore.store.derivePrivateKey();
        key = base58.encode(publicKeyFromPrivateKey(privateKey));

        // check if the credential account exists
        account =
          (accounts.find(
            (value) =>
              value.__type === AccountTypeEnum.Ephemeral &&
              value.credentialID === _credentialID.toString() &&
              value.key === key
          ) as EphemeralAccountStoreItem | undefined) ?? null;

        // if a credential account already exists, return it
        if (account) {
          this._logger.debug(
            `${__logPrefix}: credential account "${key}" for user "${username}" using "${this._authenticationStore.__type}" already exists`
          );

          return {
            __type: account.__type,
            balances: account.balances,
            key: account.key,
            name: account.name,
            origin: account.origin,
          };
        }

        encryptedKeyData = await this._authenticationStore.store.encryptBytes(privateKey);
        account = {
          __type: AccountTypeEnum.Ephemeral,
          balances,
          credentialID: _credentialID.toString(),
          key,
          keyData: base58.encode(encryptedKeyData),
          name: username,
          origin: EphemeralAccountOriginEnum.Credential,
        };

        await this._accountsStore.upsert([account]);

        this._logger.debug(
          `${__logPrefix}: created credential account "${key}" for user "${username}" using "${this._authenticationStore.__type}"`
        );

        return {
          __type: account.__type,
          balances: account.balances,
          key: account.key,
          name: account.name,
          origin: account.origin,
        };
      default:
        throw new NotAuthenticatedError('not authenticated');
    }
  }

  private _startPollingBalances(): void {
    this._pollingBalanceID = window.setInterval(this._updateBalances.bind(this), BALANCES_UPDATE_TIMEOUT);
  }

  private _stopPollingBalances(): void {
    if (this._pollingBalanceID) {
      window.clearInterval(this._pollingBalanceID);
    }
  }

  /**
   * public methods
   */

  /**
   * Gets a list of accounts within the vault.
   *
   * **NOTE:** Requires authentication.
   *
   * @returns {Promise<Account[]>} A promise that resolves to the accounts stored in the vault.
   * @throws {NotAuthenticatedError} If Katavault has not been authenticated.
   * @public
   */
  public async accounts(): Promise<Account[]> {
    let accounts: (ConnectedAccountStoreItem | EphemeralAccountStoreItem)[];

    if (!this.isAuthenticated() || !this._accountsStore) {
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
   * chain by the CAIP-002 chain ID.
   *
   * @param {ChainConstructor} chain - The chain to be added.
   * @throws {FailedToFetchChainInformationError} If the chain failed to fetch the chain information.
   * @public
   */
  public async addChain(chain: ChainConstructor): Promise<void> {
    const __logPrefix = `${Katavault.displayName}#addChain`;
    let _chain: Chain;
    let index: number;

    try {
      switch (chain.namespace) {
        case CAIP002Namespace.Algorand:
        case CAIP002Namespace.AVM:
          _chain = await chain.initialize();
          break;
        default:
          throw new ChainNotSupportedError(`chain "${chain.namespace}" not supported`);
      }
    } catch (error) {
      if ((error as BaseError).isKatavaultError) {
        throw error;
      }

      this._logger.error(`${__logPrefix}: failed to add chain "${chain.displayName}" - `, error);

      throw new FailedToFetchChainInformationError(error.message);
    }

    index = this._chains.findIndex((value) => value.chainID() === _chain.chainID());

    // if the chain already exists, update the chain
    if (index >= 0) {
      this._chains[index] = _chain;

      return;
    }

    // otherwise, add the chain
    this._chains.push(_chain);

    return;
  }

  /**
   * Opens up a modal to allow the user to choose how to authenticate.
   *
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
    const { authenticationStore, vault } = await this._appManager.renderAuthenticationApp({
      clientInformation: this._clientInformation,
      debug: this._debug,
    });

    this._accountsStore = new AccountStore({
      logger: this._logger,
      vault,
    });
    this._authenticationStore = authenticationStore;
    this._vault = vault;

    await this._generateCredentialAccountIfNoneExists();
    await this._updateBalances();
    this._startPollingBalances();
  }

  /**
   * Authenticates with a passkey.
   *
   * @param {AuthenticateWithPasskeyParameters} params - The user information.
   * @param {string} params.username - A globally unique identifier for the user. This could be, for example, an email
   * address.
   * @throws {FailedToAuthenticatePasskeyError} If the authenticator did not return the public key credentials.
   * @throws {FailedToRegisterPasskeyError} If the public key credentials failed to be created on the authenticator.
   * @throws {PasskeyNotSupportedError} If the browser does not support WebAuthn or the authenticator does not support.
   * @throws {UserCanceledPasskeyRequestError} If the user canceled the request or the request timed out.
   * @public
   */
  public async authenticateWithPasskey({ username }: AuthenticateWithPasskeyParameters): Promise<void> {
    const vault = await initializeVault({
      logger: this._logger,
      username,
    });

    this._authenticationStore = {
      __type: AuthenticationMethodEnum.Passkey,
      store: await authenticateWithPasskey({
        clientInformation: this._clientInformation,
        logger: this._logger,
        username,
        vault,
      }),
    };
    this._accountsStore = new AccountStore({
      logger: this._logger,
      vault,
    });
    this._vault = vault;

    await this._generateCredentialAccountIfNoneExists();
    await this._updateBalances();
    this._startPollingBalances();
  }

  /**
   * Authenticates with the supplied password.
   *
   * @param {AuthenticateWithPasswordParameters} params - The password and user information.
   * @param {string} params.password - The password.
   * @param {string} params.username - A globally unique identifier for the user. This could be, for example, an email
   * address.
   * @throws {DecryptionError} If the stored challenge failed to be decrypted.
   * @throws {InvalidPasswordError} If supplied password does not match the stored password.
   * @throws {PasswordTooWeakError} If this is a new sign-up, and the supplied password does not have enough entropy.
   * @public
   * @async
   */
  public async authenticateWithPassword({ password, username }: AuthenticateWithPasswordParameters): Promise<void> {
    const vault = await initializeVault({
      logger: this._logger,
      username,
    });

    this._authenticationStore = {
      __type: AuthenticationMethodEnum.Password,
      store: await authenticateWithPassword({
        clientInformation: this._clientInformation,
        logger: this._logger,
        password,
        username,
        vault,
      }),
    };
    this._accountsStore = new AccountStore({
      logger: this._logger,
      vault,
    });
    this._vault = vault;

    await this._generateCredentialAccountIfNoneExists();
    await this._updateBalances();
    this._startPollingBalances();
  }

  /**
   * Gets the supported chains.
   *
   * @returns {Chain[]} The supported chains.
   * @public
   */
  public chains(): Chain[] {
    return this._chains;
  }

  /**
   * Deletes all accounts and settings.
   *
   * **NOTE:** Requires authentication.
   *
   * @throws {NotAuthenticatedError} If Katavault has not been authenticated.
   * @public
   */
  public async clear(): Promise<void> {
    if (!this.isAuthenticated()) {
      throw new NotAuthenticatedError('not authenticated');
    }

    this._authenticationStore = null;

    if (this._vault) {
      await this._vault.clear(IDB_ACCOUNTS_STORE_NAME);
      await this._vault.clear(IDB_PASSKEY_STORE_NAME);
      await this._vault.clear(IDB_PASSWORD_STORE_NAME);
      await this._vault.clear(IDB_SETTINGS_STORE_NAME);
    }
  }

  /**
   * Gets the holding accounts of the vault. If no holding accounts exist, a new one is created from the saved
   * credentials.
   *
   * **NOTE:** Requires authentication.
   *
   * @returns {Promise<[Account, ...Account[]]>} A promise that resolves to the holding accounts stored in the vault.
   * @throws {NotAuthenticatedError} If Katavault has not been authenticated.
   * @throws {EncryptionError} If the account's private key failed to be encrypted.
   * @public
   */
  public async holdingAccounts(): Promise<[Account, ...Account[]]> {
    const accounts = await this.accounts();
    let holdingAccounts = accounts.filter(({ __type }) => __type === AccountTypeEnum.Ephemeral);

    if (holdingAccounts.length > 0) {
      return holdingAccounts as [Account, ...Account[]];
    }

    // if there are no holding accounts, create a new one from the credentials
    return [await this._generateCredentialAccountIfNoneExists()];
  }

  /**
   * Checks if Katavault is authenticated.
   *
   * @returns {boolean} True if Katavault is authenticated, false otherwise.
   * @public
   */
  public isAuthenticated(): boolean {
    return !!this._authenticationStore;
  }

  /**
   * Logs the user out and closes the vault.
   *
   * @public
   */
  public logout(): void {
    const __logPrefix = `${Katavault.displayName}#logout`;

    this._startPollingBalances();

    // close any open apps
    [AppTypeEnum.Authentication, AppTypeEnum.Vault].forEach((type) => this._appManager.closeApp(type));

    // close the vault
    this._vault?.close();

    this._authenticationStore = null;
    this._accountsStore = null;
    this._vault = null;

    this._logger.debug(`${__logPrefix} - logged out`);
  }

  /**
   * Opens the vault application.
   *
   * **NOTE:** Requires authentication.
   *
   * @throws {NotAuthenticatedError} If Katavault has not been authenticated.
   * @public
   */
  public openVault(): void {
    let params: RenderVaultAppParameters;

    if (!this._authenticationStore || !this._vault) {
      throw new NotAuthenticatedError('not authenticated');
    }

    params = {
      authenticationStore: this._authenticationStore,
      chains: this._chains,
      onLogout: () => this.logout(),
      vault: this._vault,
    };

    // open wallet app
    (async () => {
      await this._appManager.renderVaultApp({
        ...params,
        clientInformation: this._clientInformation,
        debug: this._debug,
      });
    })();
  }

  /**
   * Removes the account from the vault for the specified key if it exists.
   *
   * **NOTE:** Requires authentication.
   *
   * @param {string} key - The base58 encoded public key of the account to remove from the vault.
   * @throws {NotAuthenticatedError} If Katavault has not been authenticated.
   * @public
   */
  public async removeAccountByKey(key: string): Promise<void> {
    const __logPrefix = `${Katavault.displayName}#removeAccountByKey`;
    let results: string[];

    if (!this.isAuthenticated() || !this._vault) {
      throw new NotAuthenticatedError('not authenticated');
    }

    results = await (
      this._accountsStore ??
      new AccountStore({
        logger: this._logger,
        vault: this._vault,
      })
    ).remove([key]);

    this._logger.debug(`${__logPrefix}: removed accounts [${results.map((value) => `"${value}"`).join(',')}]`);

    // emit an event for this user
    window.dispatchEvent(new AccountsUpdatedEvent(usernameFromVault(this._vault)));
  }

  /**
   * Removes a chain from the list of supported chains based on the CAIP-002 chain ID.
   *
   * @param {string} chainID - The CAIP-002 chain ID of the chain to be removed.
   * @public
   */
  public removeChainByChainID(chainID: string): void {
    this._chains = this._chains.filter((chain) => chain.chainID() !== chainID);
  }

  /**
   * Sends a list of raw transactions, along with their signatures, to the specified chain. The corresponding array will
   * contain whether the transaction submission was successful, the transaction ID and an error if the transaction
   * submission was unsuccessful. The index of the result array will match that of the supplied transaction array.
   *
   * @param {SendRawTransactionParameters[]} parameters - An array containing the chain ID, the raw transaction and
   * the signature of the signed transaction.
   * @return {Promise<SendRawTransactionResult[]>} A promise that resolves to an array of results that will contain
   * whether the transaction submission was successful, the transaction ID and an error if the transaction submission was unsuccessful.
   * Each element's index in the result list corresponds to the supplied parameter list indices.
   * @public
   */
  public async sendRawTransactions(parameters: SendRawTransactionParameters[]): Promise<SendRawTransactionResult[]> {
    const __logPrefix = `${Katavault.displayName}#sendRawTransactions`;
    const results = Array.from<SendRawTransactionParameters, SendRawTransactionResult>(
      { length: parameters.length },
      () => ({
        error: null,
        success: false,
        transactionID: null,
      })
    );
    let chain: Chain | null;

    for (let i = 0; i < parameters.length; i++) {
      const { chainID, signature, transaction } = parameters[i];

      chain = this._chains.find((chain) => chain.chainID() === chainID) ?? null;

      if (!chain) {
        this._logger.warn(`${__logPrefix}: chain "${chainID}", at transaction index "${i}", not supported`);

        results[i] = {
          error: new ChainNotSupportedError(`chain "${chainID}" not supported`),
          success: false,
          transactionID: null,
        };

        continue;
      }

      results[i] = await this._transactionContext.sendRawTransaction({
        chain,
        signature,
        transaction,
      });
    }

    return results;
  }

  /**
   * Updates the name of an account by its key.
   *
   * **NOTE:** Requires authentication.
   *
   * @param {SetAccountNameByKeyParameters} params - The key of the account and the new name to set.
   * @param {string} params.key - The base58 encoded public key of the account.
   * @param {string} params.name - The new name for the account.
   * @returns {Promise<Account>} A promise that resolves to the updated account.
   * @throws {NotAuthenticatedError} If Katavault has not been authenticated.
   * @throws {AccountDoesNotExistError} If the specified key does not exist in the vault.
   * @public
   */
  public async setAccountNameByKey({ key, name }: SetAccountNameByKeyParameters): Promise<Account> {
    let account: ConnectedAccountStoreItem | EphemeralAccountStoreItem | null;
    let accountsStore: AccountStore;

    if (!this.isAuthenticated() || !this._vault) {
      throw new NotAuthenticatedError('not authenticated');
    }

    accountsStore =
      this._accountsStore ??
      new AccountStore({
        logger: this._logger,
        vault: this._vault,
      });
    account = await accountsStore.accountByKey(key);

    if (!account) {
      throw new AccountDoesNotExistError(`account "${key}" does not exist`);
    }

    await accountsStore.upsert([
      {
        ...account,
        name,
      },
    ]);

    // emit an event for this user
    window.dispatchEvent(new AccountsUpdatedEvent(usernameFromVault(this._vault)));

    return {
      __type: account.__type,
      key,
      name,
    };
  }

  /**
   * Signs and sends an array of raw transactions using the appropriate account and chain. The corresponding array will
   * contain whether the transaction submission was successful, the transaction ID and an error if the transaction
   * submission was unsuccessful. The index of the result array will match that of the supplied transaction array.
   *
   * **NOTE:** Requires authentication.
   *
   * @param {SignRawTransactionParameters[]} parameters - An array containing the base58 encoded account key, the chain
   * ID and the raw transaction to be signed.
   * @return {Promise<SendRawTransactionResult[]>} A promise that resolves to an array of results that will contain
   * whether the transaction signed and submitted was successfully, the transaction ID and an error if the transaction signing or submission was unsuccessful.
   * Each element's index in the result list corresponds to the supplied parameter list indices.
   * @throws {NotAuthenticatedError} If the user is not authenticated.
   * @public
   */
  public async signAndSendRawTransactions(
    parameters: SignRawTransactionParameters[]
  ): Promise<SendRawTransactionResult[]> {
    const __logPrefix = `${Katavault.displayName}#signAndSendRawTransactions`;
    let signatures: SignRawTransactionResult[];

    if (!this.isAuthenticated() || !this._vault) {
      throw new NotAuthenticatedError('not authenticated');
    }

    signatures = await this.signRawTransactions(parameters);

    return await Promise.all(
      signatures.map(async ({ error, success, signature }, index) => {
        let chain: Chain | null;

        if (error || !signature || !success) {
          return {
            error,
            success,
            transactionID: null,
          };
        }

        const { chainID, transaction } = parameters[index];

        chain = this._chains.find((chain) => chain.chainID() === chainID) ?? null;

        if (!chain) {
          this._logger.warn(`${__logPrefix}: chain "${chainID}", at transaction index "${index}", not supported`);

          return {
            error: new ChainNotSupportedError(`chain "${chainID}" not supported`),
            success: false,
            transactionID: null,
          };
        }

        return await this._transactionContext.sendRawTransaction({
          chain,
          signature,
          transaction,
        });
      })
    );
  }

  public async signMessage(parameters: WithEncoding<SignMessageParameters>): Promise<string>;
  public async signMessage(parameters: Omit<SignMessageParameters, 'encoding'>): Promise<Uint8Array>;
  /**
   * Signs a message or some arbitrary bytes using the appropriate account and chain.
   *
   * **NOTE:** Requires authentication.
   *
   * @param {SignMessageParameters} params - The input parameters.
   * @param {string} params.accountKey - The base58 public key of the account that will be used for signing.
   * @param {string} params.chainID - The CAIP-002 chain ID.
   * @param {Encoding} [params.encoding] - The output encoding of the signature. If no encoding is specified, the
   * signature will be as raw bytes (Uint8Array).
   * @param {string | Uint8Array} params.message - A UTF-8 encoded message or raw bytes to sign.
   * @returns {Promise<string | Uint8Array>} A promise that resolves to the signature of the signed message. If the
   * encoding parameter was specified, the signature will be encoded in that format, otherwise the signature will be in
   * raw bytes.
   * @throws {NotAuthenticatedError} If Katavault has not been authenticated.
   * @throws {ChainNotSupportedError} If the specified chain is not supported.
   * @throws {AccountDoesNotExistError} If the specified address does not exist in the vault.
   * @throws {AuthenticationMethodNotSupportedError} If the authentication method is not supported.
   * @throws {DecryptionError} If there was an issue with decryption, or if the key was encrypted with the incorrect
   * credentials.
   * @public
   */
  public async signMessage({
    accountKey,
    chainID,
    encoding,
    message,
  }: SignMessageParameters): Promise<string | Uint8Array> {
    let account: ConnectedAccountStoreItem | EphemeralAccountStoreItem | null;
    let chain: Chain | null;
    let signature: Uint8Array;

    if (!this._authenticationStore || !this._vault) {
      throw new NotAuthenticatedError('not authenticated');
    }

    chain = this._chains.find((chain) => chain.chainID() === chainID) ?? null;

    if (!chain) {
      throw new ChainNotSupportedError(`chain "${chainID}" not supported`);
    }

    account = await (
      this._accountsStore ??
      new AccountStore({
        logger: this._logger,
        vault: this._vault,
      })
    ).accountByKey(accountKey);

    if (!account) {
      throw new AccountDoesNotExistError(`account "${accountKey}" does not exist`);
    }

    // TODO: check if connected account supports chain ID
    // if (account.__type === AccountTypeEnum.Connected) {
    //
    // }

    signature = await this._signContext.signMessage({
      account:
        account.__type === AccountTypeEnum.Ephemeral
          ? await this._authenticationStore?.store.decryptEphemeralAccount(account)
          : account,
      chain,
      message,
    });

    // encode if necessary
    switch (encoding) {
      case 'base64':
        return base64.encode(signature);
      case 'hex':
        return hex.encode(signature);
      default:
        return signature;
    }
  }

  /**
   * Signs an array of raw transactions using the appropriate account and chain. The corresponding array will
   * contain whether the transaction signing was successful, the signature (if successful) and an error if the
   * transaction signing was unsuccessful. The index of the result array will match that of the supplied transaction
   * array.
   *
   * **NOTE:** Requires authentication.
   *
   * @param {SignRawTransactionParameters[]} parameters - An array containing the base58 encoded account key, the chain
   * ID and the raw transaction to be signed.
   * @return {Promise<SignRawTransactionResult[]>} A promise that resolves to an array of results that will contain
   * whether the transaction was signed successfully, the signature (if successful) and an error if the transaction
   * signing was unsuccessful. Each element's index in the result list corresponds to the supplied parameter list
   * indices.
   * @throws {NotAuthenticatedError} If the user is not authenticated.
   * @public
   */
  public async signRawTransactions(parameters: SignRawTransactionParameters[]): Promise<SignRawTransactionResult[]> {
    const __logPrefix = `${Katavault.displayName}#signRawTransactions`;
    let account: ConnectedAccountStoreItem | EphemeralAccountStoreItem | null;
    let chain: Chain | null;
    let extendedParams: WithIndex<WithAccountStoreItem<WithChain<Record<'transaction', Uint8Array>>>>[];
    let results: SignRawTransactionResult[];
    let signedTransactions: WithIndex<SignRawTransactionResult>[];

    if (!this._authenticationStore || !this._vault) {
      throw new NotAuthenticatedError('not authenticated');
    }

    extendedParams = [];
    results = Array.from<SignRawTransactionParameters, SignRawTransactionResult>({ length: parameters.length }, () => ({
      error: null,
      signature: null,
      success: false,
    }));

    for (let i = 0; i < parameters.length; i++) {
      const { accountKey, chainID, transaction } = parameters[i];

      chain = this._chains.find((chain) => chain.chainID() === chainID) ?? null;

      if (!chain) {
        this._logger.warn(`${__logPrefix}: chain "${chainID}", at transaction index "${i}", not supported`);

        results[i] = {
          error: new ChainNotSupportedError(`chain "${chainID}" not supported`),
          success: false,
          signature: null,
        };

        continue;
      }

      account = await (
        this._accountsStore ??
        new AccountStore({
          logger: this._logger,
          vault: this._vault,
        })
      ).accountByKey(accountKey);

      if (!account) {
        this._logger.warn(`account "${accountKey}", at transaction index "${i}", does not exist`);

        results[i] = {
          error: new AccountDoesNotExistError(`account "${accountKey}" does not exist`),
          success: false,
          signature: null,
        };

        continue;
      }

      // TODO: check if connected account supports chain ID
      // if (account.__type === AccountTypeEnum.Connected) {
      //
      // }

      extendedParams.push({
        account:
          account.__type === AccountTypeEnum.Ephemeral
            ? await this._authenticationStore.store.decryptEphemeralAccount(account)
            : account,
        chain,
        index: i,
        transaction,
      });
    }

    signedTransactions = await this._transactionContext.signRawTransactions(extendedParams);

    // add the signed transaction results to the result array by the passed index
    signedTransactions.forEach(({ index, ...result }) => (results[index] = result));

    return results;
  }

  /**
   * Gets the username for the authenticated user or null if Katavault is not authenticated.
   *
   * **NOTE:** Requires authentication.
   *
   * @returns {string} The username of the logged-in user.
   * @throws {NotAuthenticatedError} If the user is not authenticated.
   */
  public username(): string {
    if (!this._vault) {
      throw new NotAuthenticatedError('not authenticated');
    }

    return usernameFromVault(this._vault);
  }
}
