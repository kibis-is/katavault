import { CAIP002Namespace, Chain } from '@kibisis/chains';

// _base
import { BaseClass } from '@/_base';

// errors
import { ChainNotSupportedError } from '@/errors';

// strategies
import AVMBalancesStrategy from './AVMBalancesStrategy';

// types
import type { Balance, CommonParameters, EphemeralAccountStoreItem, WithAccountStoreItem } from '@/types';

export default class BalancesContext extends BaseClass {
  /**
   * public static properties
   */
  public static readonly displayName = 'BalancesContext';
  /**
   * private properties
   */
  private readonly _avmBalancesStrategy: AVMBalancesStrategy;

  public constructor(params: CommonParameters) {
    super(params);

    this._avmBalancesStrategy = new AVMBalancesStrategy(params);
  }

  /**
   * public methods
   */

  /**
   * Delegates the fetching of the balance to the respective strategy.
   *
   * @param {WithAccountStoreItem<Record<'chain', Chain>, EphemeralAccountStoreItem>} params - The input parameters.
   * @param {EphemeralAccountStoreItem} params.account - The account to get the balance for.
   * @param {Chain} params.chain - The [CAIP-002]{@link https://chainagnostic.org/CAIPs/caip-2} chain ID to fetch the
   * balance from.
   * @returns {Promise<Balance>} A promise that resolves to account's balance information.
   * @throws {ChainNotSupportedError} If the chain is not supported.
   * @public
   */
  public async balance({
    account,
    chain,
  }: WithAccountStoreItem<Record<'chain', Chain>, EphemeralAccountStoreItem>): Promise<Balance> {
    switch (chain.namespace()) {
      case CAIP002Namespace.Algorand:
      case CAIP002Namespace.AVM:
        return await this._avmBalancesStrategy.balance({
          account,
          chain,
        });
      default:
        throw new ChainNotSupportedError(`namespace "${chain.namespace()}" not supported`);
    }
  }
}
