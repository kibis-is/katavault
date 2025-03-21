// decorators
import { PasskeyDecorator, VaultDecorator } from '@/decorators';

// types
import type {
  Account,
  ClientInformation,
  EmbeddedWalletParameters,
  Logger,
  Passkey,
  PrivateKey,
  UserInformation,
} from '@/types';

// utilities
import { addressFromPrivateKey, generatePrivateKey } from '@/utilities';

export default class EmbeddedWallet {
  // public static variables
  public static readonly displayName = 'EmbeddedWallet';
  // private variables
  private readonly _client: ClientInformation;
  private readonly _logger: Logger;
  private readonly _user: UserInformation;
  private readonly _vault: VaultDecorator;

  public constructor({ client, logger, user, vault }: EmbeddedWalletParameters) {
    this._client = client;
    this._logger = logger;
    this._user = user;
    this._vault = vault;
  }

  /**
   * private methods
   */

  public async _passkey(): Promise<Passkey> {
    const __logPrefix = `${EmbeddedWallet.displayName}#_passkey`;
    let passkey = await this._vault.passkey();

    // if there is no passkey, register a new one
    if (!passkey) {
      passkey = await PasskeyDecorator.register({
        client: this._client,
        logger: this._logger,
        user: this._user,
      });

      this._logger.debug(`${__logPrefix}: registered new passkey "${passkey.credentialID}"`);

      await this._vault.setPasskey(passkey);

      this._logger.debug(`${__logPrefix}: saved new passkey "${passkey.credentialID}" to vault`);
    }

    return passkey;
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
      new Map<string, PrivateKey>([
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
    const __logPrefix = `${EmbeddedWallet.displayName}#removeAccount`;
    const items = await this._vault.items();
    let result: string[];

    if (items.has(address)) {
      result = await this._vault.removeItems([address]);

      this._logger.debug(`${__logPrefix}: removed accounts [${result.map((value) => `"${value}"`).join(',')}]`);
    }
  }
}
