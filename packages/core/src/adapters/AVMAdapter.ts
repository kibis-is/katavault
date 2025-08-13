import { AVMChain, AVMNode } from '@kibisis/chains';
import { Algodv2, decodeUnsignedTransaction, Transaction, waitForConfirmation } from 'algosdk';
import type { Account } from 'algosdk/dist/types/client/v2/algod';

// _base
import { BaseClass } from '@/_base';

// errors
import { FailedToFetchChainInformationError, FailedToSendTransactionError } from '@/errors';

// types
import type { AVMAdapterParameters, WithCommonParameters } from '@/types';

export default class AVMAdapter extends BaseClass {
  /**
   * public static properties
   */
  public static displayName = 'AVMAdapter';
  /**
   * private properties
   */
  private _chain: AVMChain;

  public constructor({ chain, ...commonParams }: WithCommonParameters<AVMAdapterParameters>) {
    super(commonParams);

    this._chain = chain;
  }

  /**
   * public methods
   */

  private _defaultNode(): AVMNode | null {
    return this._chain.networkConfiguration().algods.nodes[this._chain.networkConfiguration().algods.default] ?? null;
  }

  /**
   * public methods
   */

  /**
   * Retrieves account information for the provided address using the Algod client.
   *
   * @param {string} address - The address for which information is to be fetched.
   * @return {Promise<Account>} A promise that resolves to the account information.
   * @throws {FailedToFetchChainInformationError} Throws an error if the default algod node cannot be retrieved.
   * @public
   * @async
   */
  public async accountInformation(address: string): Promise<Account> {
    const algod = this.algod();

    if (!algod) {
      throw new FailedToFetchChainInformationError(
        `failed to get default algod node for chain "${this._chain.chainID()}"`
      );
    }

    return await algod.accountInformation(address).do();
  }

  public algod(): Algodv2 | null {
    const node = this._defaultNode();

    if (!node) {
      return null;
    }

    return new Algodv2(node.token ?? '', node.origin, node.port);
  }

  /**
   * Get the associated chain.
   *
   * @returns {AVMChain} The AVM chain.
   * @public
   */
  public chain(): AVMChain {
    return this._chain;
  }

  /**
   * Sends a transaction to the AVM blockchain, attaching a signature to the provided unsigned transaction. Once the
   * transaction is successfully submitted, the network is checked to confirm which block the transaction was added,
   * up to a maximum of 4 blocks.
   *
   * @param {Object} params - The parameters to send the transaction.
   * @param {Uint8Array} params.signature - The signature of the signed transaction.
   * @param {Uint8Array} params.transaction - The unsigned transaction.
   * @return {Promise<string>} The transaction ID of the successfully confirmed transaction.
   * @throws {FailedToFetchChainInformationError} If the default Algod node information cannot be fetched.
   * @throws {FailedToSendTransactionError} If the transaction could not be sent or was rejected by the network.
   * @public
   */
  public async sendTransaction({
    signature,
    transaction,
  }: Record<'signature' | 'transaction', Uint8Array>): Promise<string> {
    const __logPrefix = `${AVMAdapter.displayName}#sendTransaction`;
    const algod = this.algod();
    let decodedTransaction: Transaction;

    if (!algod) {
      throw new FailedToFetchChainInformationError(
        `failed to get default algod node for chain "${this._chain.chainID()}"`
      );
    }

    decodedTransaction = decodeUnsignedTransaction(transaction);

    try {
      const { txid } = await algod
        .sendRawTransaction(decodedTransaction.attachSignature(decodedTransaction.sender, signature))
        .do();
      const { confirmedRound } = await waitForConfirmation(algod, txid, 4);

      this._logger.debug(`${__logPrefix} - transaction confirmed at round "${confirmedRound}"`);

      return txid;
    } catch (error) {
      this._logger.error(`${__logPrefix} -`, error);

      throw new FailedToSendTransactionError(error.message);
    }
  }

  public setChain(chain: AVMChain): void {
    this._chain = chain;
  }
}
