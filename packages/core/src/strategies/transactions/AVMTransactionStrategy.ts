import { concat } from '@agoralabs-sh/bytes';
import { utf8 } from '@kibisis/encoding';
import { ed25519 } from '@noble/curves/ed25519';

// _base
import { BaseClass } from '@/_base';

// adapters
import { AVMAdapter } from '@/adapters';

// enums
import { AccountTypeEnum } from '@/enums';

// types
import type {
  AVMSignRawTransactionParameters,
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

  /**
   * Sends a raw transaction to the specified AVM chain and waits for it to be confirmed after a maximum of 4 rounds.
   *
   * @param {WithChain<Record<'signature' | 'transaction', Uint8Array>>} params - The input parameters.
   * @param {AVMChain} params.chain - The CAIP-002 AVM chain ID.
   * @param {Uint8Array} params.signature - The signature of the signed transaction.
   * @param {Uint8Array} params.transaction - The raw transaction data.
   * @return {Promise<string>} A promise that resolves to the transaction ID of the confirmed transaction.
   * @throws {FailedToFetchChainInformationError} If the default Algod node information cannot be fetched.
   * @throws {FailedToSendTransactionError} If the transaction failed to be submitted to the network, or the transaction
   * failed to be added to the round, after a maximum of 4 rounds.
   * @public
   */
  public async sendRawTransaction({
    chain,
    signature,
    transaction,
  }: WithChain<Record<'signature' | 'transaction', Uint8Array>>): Promise<string> {
    const adapter = new AVMAdapter({
      chain,
      logger: this._logger,
    });

    return await adapter.sendTransaction({
      signature,
      transaction,
    });
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
