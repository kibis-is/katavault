// decorators
import { Vault } from '@/decorators';

// types
import type { Logger, ProviderParameters } from '@/types';

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

  /**
   * The list of all the AVM addresses within the wallet.
   * @returns {string[]} The list of AVM addresses in the wallet.
   */
  public async addresses(): Promise<string[]> {
    const items = await this._vault.accounts();

    return items.keys().toArray();
  }
}
