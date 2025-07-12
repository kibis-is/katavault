import type { ILogger } from '@kibisis/utilities';

// types
import type { StoreParameters, Vault } from '@/types';

export default abstract class BaseStore {
  // protected variables
  protected readonly _logger: ILogger;
  protected readonly _vault: Vault;

  protected constructor({ logger, vault }: StoreParameters) {
    this._logger = logger;
    this._vault = vault;
  }

  /**
   * public methods
   */

  /**
   * Gets the vault name.
   * @returns {string} The name of the vault.
   * @public
   */
  public name(): string {
    return this._vault.name;
  }

  /**
   * Gets the vault version.
   * @returns {number} The vault version.
   * @public
   */
  public version(): number {
    return this._vault.version;
  }
}
