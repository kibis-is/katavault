import { Account } from 'algosdk';

// utilities
import { addressFromPrivateKey } from '@/utilities';

// types
import type { Logger, ProviderParameters } from '@/types';

export default class Provider {
  private readonly _logger: Logger;
  private readonly _keys: [Uint8Array, ...Uint8Array[]];

  public constructor({ keys, logger }: ProviderParameters) {
    this._logger = logger;
    this._keys = keys;
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

    return this._keys.reduce((acc, key, index) => {
      try {
        return [...acc, addressFromPrivateKey(key)];
      } catch (error) {
        this._logger.error(`${__logPrefix}: failed to convert key at index "${index}"`);

        return acc;
      }
    }, []);
  }
}
