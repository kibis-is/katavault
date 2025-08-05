import { concat } from '@agoralabs-sh/bytes';
import { utf8 } from '@kibisis/encoding';
import { ed25519 } from '@noble/curves/ed25519';

// _base
import { BaseClass } from '@/_base';

// decorators
import { AVMClient } from '@/decorators';

// enums
import { AccountTypeEnum } from '@/enums';

// errors
import { FailedToSendTransactionError } from '@/errors';

// types
import type {
  AVMPendingTransactionResponse,
  AVMSignRawTransactionParameters,
  AVMStatusResponse,
  CommonParameters,
  // ConnectedAccountStoreItem,
  EphemeralAccountStoreItemWithDecryptedKeyData,
  WithAccountStoreItem,
  WithChain,
  WithIndex,
} from '@/types';

export default class AVMTransactionStrategy extends BaseClass {
  /**
   * public static properties
   */
  public static readonly displayName = 'AVMTransactionStrategy';
  public static transactionPrefix = 'TX';
  /**
   * private properties
   */
  private readonly _rawPrefix: Uint8Array;

  public constructor(params: CommonParameters) {
    super(params);

    this._rawPrefix = utf8.decode(AVMTransactionStrategy.transactionPrefix);
  }

  /**
   * private methods
   */

  /**
   * Signs the given transaction using the provided private key. The payload to be signed for AVM transactions are
   * prefixed with a "TX".
   *
   * @param {AVMSignRawTransactionParameters} params - The input parameters.
   * @param {Uint8Array} params.privateKey - The private key used to sign the transaction.
   * @param {Uint8Array} params.transaction - The raw transaction to be signed.
   * @return {Uint8Array} The signature generated from the transaction signing.
   * @private
   */
  private _signTransaction({ privateKey, transaction }: AVMSignRawTransactionParameters): Uint8Array {
    return ed25519.sign(concat(this._rawPrefix, transaction), privateKey);
  }

  /**
   * public methods
   */

  public async sendRawTransaction({
    chain,
    signature,
    transaction,
  }: WithChain<Record<'signature' | 'transaction', Uint8Array>>): Promise<string> {
    const __logPrefix = `${AVMTransactionStrategy.displayName}#sendRawTransaction`;
    const client = new AVMClient({
      chain,
      logger: this._logger,
    });
    let currentRound: number;
    let pendingTransaction: AVMPendingTransactionResponse | null = null;
    let status: AVMStatusResponse;
    let stopRound: number;
    let transactionID: string;

    try {
      transactionID = await client.sendTransaction({
        signature,
        transaction,
      });
    } catch (error) {
      this._logger.error(`${__logPrefix} - `, error);

      throw new FailedToSendTransactionError(error.message);
    }

    try {
      status = await client.status();
    } catch (error) {
      this._logger.error(`${__logPrefix} - failed to get avm chain status:`, error);

      throw new FailedToSendTransactionError(error.message);
    }

    currentRound = status['last-round'];
    stopRound = currentRound + 4; // transaction should be confirmed by at least 4 rounds

    // iterate each round and check if the transaction has been confirmed
    while (currentRound < stopRound) {
      try {
        pendingTransaction = await client.pendingTransaction(transactionID);
      } catch (_) {
        /* ignore errors */
      }

      // check if the transaction was successful
      if (pendingTransaction?.['confirmed-round']) {
        this._logger.debug(
          `${__logPrefix} - transaction confirmed at round "${pendingTransaction['confirmed-round']}"`
        );

        return transactionID;
      }

      // throw an error id the transaction was submitted but rejected
      if (pendingTransaction?.['pool-error']) {
        this._logger.error(`${__logPrefix} - ${pendingTransaction['pool-error']}`);

        throw new FailedToSendTransactionError(pendingTransaction['pool-error']);
      }

      // wait for the next round to appear onchain
      try {
        await client.statusAfterRound(currentRound);
      } catch (_) {
        /* ignore errors */
      }

      currentRound = currentRound + 1;
    }

    throw new FailedToSendTransactionError('failed to send transaction');
  }

  public async signRawTransactions(
    parameters: WithIndex<WithAccountStoreItem<Record<'transaction', Uint8Array>>>[]
  ): Promise<WithIndex<Record<'signature', Uint8Array | null>>[]> {
    // const connectedAccountTransactions = params.filter(({ account }) => account.__type === AccountTypeEnum.Connected) as WithIndex<WithAccountStoreItem<Record<'transaction', Uint8Array>, ConnectedAccountStoreItem>>[];
    const ephemeralAccountTransactions = parameters.filter(
      ({ account }) => account.__type === AccountTypeEnum.Ephemeral
    ) as WithIndex<
      WithAccountStoreItem<Record<'transaction', Uint8Array>, EphemeralAccountStoreItemWithDecryptedKeyData>
    >[];
    const signedTransactions: WithIndex<Record<'signature', Uint8Array | null>>[] = [];

    // TODO: for connected accounts group them by their respected connectors and send them to be signed

    // for ephemeral accounts, simply use the key data and sign the transaction
    for (const { account, index, transaction } of ephemeralAccountTransactions) {
      signedTransactions.push({
        index,
        signature: this._signTransaction({
          privateKey: account.keyData,
          transaction,
        }),
      });
    }

    return signedTransactions;
  }
}
