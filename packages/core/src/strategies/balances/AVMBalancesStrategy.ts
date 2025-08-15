import { AVMChain } from '@kibisis/chains';
import { base58 } from '@kibisis/encoding';

// _base
import { BaseClass } from '@/_base';

// adapters
import { AVMAdapter } from '@/adapters';

// decorators
import { AVMAddress } from '@/decorators';

// types
import type { Balance, EphemeralAccountStoreItem, WithAccountStoreItem } from '@/types';

export default class AVMBalancesStrategy extends BaseClass {
  /**
   * public methods
   */

  /**
   * Sends a raw transaction to the specified AVM chain and waits for it to be confirmed after a maximum of 4 rounds.
   *
   * @param {WithAccountStoreItem<Record<'chain', AVMChain>, EphemeralAccountStoreItem>} params - The input parameters.
   * @param {EphemeralAccountStoreItem} params.account - The account to get the balance for.
   * @param {AVMChain} params.chain - The [CAIP-002]{@link https://chainagnostic.org/CAIPs/caip-2} AVM chain ID.
   * @return {Promise<Balance>} A promise that resolves to the transaction ID of the confirmed transaction.
   * @throws {FailedToFetchChainInformationError} If the default Algod node information cannot be fetched.
   * @public
   */
  public async balance({
    account,
    chain,
  }: WithAccountStoreItem<Record<'chain', AVMChain>, EphemeralAccountStoreItem>): Promise<Balance> {
    const adapter = new AVMAdapter({
      chain,
      logger: this._logger,
    });
    const { amount, round: block } = await adapter.accountInformation(
      AVMAddress.fromPublicKey(base58.decode(account.key)).address()
    );

    return {
      amount: String(amount),
      block: String(block),
      lastUpdatedAt: new Date().getTime().toString(),
    };
  }
}
