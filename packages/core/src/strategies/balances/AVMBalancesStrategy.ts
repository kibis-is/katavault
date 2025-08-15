import { CAIP002Namespace } from '@kibisis/chains';
import { base58 } from '@kibisis/encoding';

// _base
import { BaseClass } from '@/_base';

// adapters
import { AVMAdapter } from '@/adapters';

// decorators
import { AVMAddress } from '@/decorators';

// types
import type { Balance, BalanceParameters } from '@/types';

export default class AVMBalancesStrategy extends BaseClass {
  /**
   * public methods
   */

  /**
   * Sends a raw transaction to the specified AVM chain and waits for it to be confirmed after a maximum of 4 rounds.
   *
   * @param {BalanceParameters<CAIP002Namespace.Algorand | CAIP002Namespace.AVM>} parameters - The input parameters.
   * @param {EphemeralAccountStoreItem} parameters.account - The account to get the balance for.
   * @param {AVMChain} parameters.chain - The [CAIP-002]{@link https://chainagnostic.org/CAIPs/caip-2} AVM chain ID.
   * @param {number} [parameters.delay] - An optional delay to apply before sending request. Defaults to 0.
   * @return {Promise<Balance>} A promise that resolves to the transaction ID of the confirmed transaction.
   * @throws {FailedToFetchChainInformationError} If the default Algod node information cannot be fetched.
   * @public
   */
  public async balance({
    account,
    chain,
    delay = 0,
  }: BalanceParameters<CAIP002Namespace.Algorand | CAIP002Namespace.AVM>): Promise<Balance> {
    return new Promise<Balance>((resolve, reject) => {
      window.setTimeout(async () => {
        const adapter = new AVMAdapter({
          chain,
          logger: this._logger,
        });

        try {
          const { amount, round: block } = await adapter.accountInformation(
            AVMAddress.fromPublicKey(base58.decode(account.key)).address()
          );

          return resolve({
            amount: String(amount),
            block: String(block),
            lastUpdatedAt: new Date().getTime().toString(),
          });
        } catch (error) {
          return reject(error);
        }
      }, delay);
    });
  }
}
