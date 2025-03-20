// utilities
import { addressFromPrivateKey } from '@/utilities';

// types
import type { AccountWithPrivateKeyBytes, Logger, ProviderParameters } from '@/types';

export default class Provider {
  private readonly _logger: Logger;
  private readonly _accounts: [AccountWithPrivateKeyBytes, ...AccountWithPrivateKeyBytes[]];

  public constructor({ accounts, logger }: ProviderParameters) {
    this._accounts = accounts;
    this._logger = logger;
  }

  /**
   * public methods
   */

  /**
   * The list of all the AVM addresses within the wallet.
   * @returns {string[]} The list of AVM addresses in the wallet.
   */
  public addresses(): string[] {
    const __logPrefix = `${Provider.name}#addresses`;

    return this._accounts.reduce((acc, account, index) => {
      try {
        return [...acc, addressFromPrivateKey(account.privateKey)];
      } catch (error) {
        this._logger.error(`${__logPrefix}: failed to convert key at index "${index}"`);

        return acc;
      }
    }, []);
  }
}
