// decorators
import { Passkey, Vault } from '@/decorators';

// errors
import { VaultNotInitializedError } from '@/errors';

// types
import type { Account, Logger, PrivateKey, ProviderParameters } from '@/types';

// utilities
import { addressFromPrivateKey, generatePrivateKey } from '@/utilities';

export default class Provider {
  private readonly _logger: Logger;
  private readonly _vault: Vault;

  public constructor({ logger, vault }: ProviderParameters) {
    this._logger = logger;
    this._vault = vault;
  }

  /**
   * private methods
   */

  /**
   * public methods
   */

  public async generateAccount(name?: string): Promise<Account> {
    const passkey = await this._vault.passkey();
    let address: string;
    let passkeyClient: Passkey;
    let privateKey: Uint8Array;

    if (!passkey) {
      throw new VaultNotInitializedError('passkey not found');
    }

    privateKey = generatePrivateKey();
    passkeyClient = await Passkey.authenticate({
      passkey,
      logger: this._logger,
    });
    address = addressFromPrivateKey(privateKey);

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
   * The list of all the AVM addresses within the wallet.
   * @returns {string[]} The list of AVM addresses in the wallet.
   */
  public async addresses(): Promise<string[]> {
    const items = await this._vault.items();

    return items.keys().toArray();
  }
}
