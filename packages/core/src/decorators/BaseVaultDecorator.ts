import type { IDBPDatabase } from 'idb';

// types
import type { Logger, VaultDecoratorParameters, VaultSchema } from '@/types';

export default abstract class BaseVaultDecorator {
  // protected variables
  protected readonly _logger: Logger;
  protected readonly _vault: IDBPDatabase<VaultSchema>;

  protected constructor({ logger, vault }: VaultDecoratorParameters) {
    this._logger = logger;
    this._vault = vault;
  }

  /**
   * public abstract methods
   */

  public abstract clearStore(): Promise<void>;

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
   * Closes the connection to the indexedDB.
   * @public
   */
  public close(): void {
    this._vault.close();
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
