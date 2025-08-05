import { concat } from '@agoralabs-sh/bytes';
import { AVMChain, AVMNode } from '@kibisis/chains';
import { utf8 } from '@kibisis/encoding';
import { encode as encodeMsgpack } from '@msgpack/msgpack';
import { ed25519 } from '@noble/curves/ed25519';
import axios, { AxiosResponse } from 'axios';

// _base
import { BaseClass } from '@/_base';

// enums
import { AccountTypeEnum } from '@/enums';

// errors
import { FailedToFetchChainInformationError, FailedToSendTransactionError } from '@/errors';

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
   * private static methods
   */

  private static _defaultNode(chain: AVMChain): AVMNode | null {
    return chain.networkConfiguration().algods.nodes[chain.networkConfiguration().algods.default] ?? null;
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
    const node = AVMTransactionStrategy._defaultNode(chain);
    let _error: string;
    let response: AxiosResponse<Record<'txId', string>>;

    if (!node) {
      _error = `failed to get default algod node for chain "${chain.chainID()}"`;

      this._logger.error(`${__logPrefix} - ${_error}`);

      throw new FailedToFetchChainInformationError(_error);
    }

    try {
      response = await axios.post(
        `${node.origin}/v2/transactions`,
        encodeMsgpack({
          sig: signature,
          txn: transaction,
        }),
        {
          headers: {
            ['Content-Type']: 'application/x-binary',
            ...(node.token && {
              ['X-Algo-API-Token']: node.token,
            }),
          },
        }
      );

      return response.data.txId;
    } catch (error) {
      this._logger.error(`${__logPrefix} - `, error);

      throw new FailedToSendTransactionError(error.message);
    }
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
