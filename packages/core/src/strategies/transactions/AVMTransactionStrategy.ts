import { concat } from '@agoralabs-sh/bytes';
import { base58, utf8 } from '@kibisis/encoding';
import { ed25519 } from '@noble/curves/ed25519';

// _base
import { BaseClass } from '@/_base';

// enums
import { AccountTypeEnum } from '@/enums';

// types
import type {
  AVMSignRawTransactionParameters,
  CommonParameters,
  // ConnectedAccountStoreItem,
  EphemeralAccountStoreItem,
  WithAccountStoreItem,
  WithIndex,
} from '@/types';

export default class AVMTransactionStrategy extends BaseClass {
  /**
   * public static properties
   */
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
  public _signTransaction({ privateKey, transaction }: AVMSignRawTransactionParameters): Uint8Array {
    return ed25519.sign(concat(this._rawPrefix, transaction), privateKey);
  }

  /**
   * public methods
   */

  public async signRawTransactions(
    params: WithIndex<WithAccountStoreItem<Record<'transaction', Uint8Array>>>[]
  ): Promise<WithIndex<Record<'signature', Uint8Array | null>>[]> {
    // const connectedAccountTransactions = params.filter(({ account }) => account.__type === AccountTypeEnum.Connected) as WithIndex<WithAccountStoreItem<Record<'transaction', Uint8Array>, ConnectedAccountStoreItem>>[];
    const ephemeralAccountTransactions = params.filter(
      ({ account }) => account.__type === AccountTypeEnum.Ephemeral
    ) as WithIndex<WithAccountStoreItem<Record<'transaction', Uint8Array>, EphemeralAccountStoreItem>>[];
    const signedTransactions: WithIndex<Record<'signature', Uint8Array | null>>[] = [];

    // TODO: for connected accounts group them off to their respected connectors and send them to be signed

    // for ephemeral accounts, simply use the key data and sign the transaction
    for (const { account, index, transaction } of ephemeralAccountTransactions) {
      signedTransactions.push({
        index,
        signature: this._signTransaction({
          privateKey: base58.decode(account.keyData),
          transaction,
        }),
      });
    }

    return signedTransactions;
  }
}
