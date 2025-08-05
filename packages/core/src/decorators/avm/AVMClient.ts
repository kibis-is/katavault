import { AVMChain, AVMNode } from '@kibisis/chains';
import { encode as encodeMsgpack } from '@msgpack/msgpack';
import axios, { type AxiosResponse } from 'axios';

// _base
import { BaseClass } from '@/_base';

// errors
import { FailedToFetchChainInformationError } from '@/errors';

// types
import type {
  AVMClientParameters,
  AVMPendingTransactionResponse,
  AVMStatusResponse,
  WithCommonParameters,
} from '@/types';

export default class AVMClient extends BaseClass {
  /**
   * private static properties
   */
  public static _algodVersion = '2';
  /**
   * public static properties
   */
  public static displayName = 'AVMClient';
  /**
   * private properties
   */
  private readonly _chain: AVMChain;

  public constructor({ chain, ...commonParams }: WithCommonParameters<AVMClientParameters>) {
    super(commonParams);

    this._chain = chain;
  }

  /**
   * private static methods
   */

  private static _nodeHeaders(node: AVMNode): Record<string | 'X-Algo-API-Token', string> {
    return {
      ...(node.token && {
        ['X-Algo-API-Token']: node.token,
      }),
    };
  }

  /**
   * private methods
   */

  private _defaultNode(): AVMNode | null {
    return this._chain.networkConfiguration().algods.nodes[this._chain.networkConfiguration().algods.default] ?? null;
  }

  /**
   * public methods
   */

  /**
   * Get the associated chain.
   *
   * @returns {AVMChain} The AVM chain.
   * @public
   */
  public chain(): AVMChain {
    return this._chain;
  }

  public async status(): Promise<AVMStatusResponse> {
    const __logPrefix = `${AVMClient.displayName}#status`;
    const node = this._defaultNode();
    let _error: string;
    let response: AxiosResponse<AVMStatusResponse>;

    if (!node) {
      _error = `failed to get default algod node for chain "${this._chain.chainID()}"`;

      this._logger.error(`${__logPrefix} - ${_error}`);

      throw new FailedToFetchChainInformationError(_error);
    }

    try {
      response = await axios.get<AVMStatusResponse>(`${node.origin}/v${AVMClient._algodVersion}/status`, {
        headers: AVMClient._nodeHeaders(node),
      });

      return response.data;
    } catch (error) {
      this._logger.error(`${__logPrefix} -`, error);

      throw error;
    }
  }

  public async statusAfterRound(round: number): Promise<AVMStatusResponse> {
    const __logPrefix = `${AVMClient.displayName}#statusAfterRound`;
    const node = this._defaultNode();
    let _error: string;
    let response: AxiosResponse<AVMStatusResponse>;

    if (!node) {
      _error = `failed to get default algod node for chain "${this._chain.chainID()}"`;

      this._logger.error(`${__logPrefix} - ${_error}`);

      throw new FailedToFetchChainInformationError(_error);
    }

    try {
      response = await axios.get<AVMStatusResponse>(
        `${node.origin}/v${AVMClient._algodVersion}/wait-for-block-after/${round}`,
        {
          headers: AVMClient._nodeHeaders(node),
        }
      );

      return response.data;
    } catch (error) {
      this._logger.error(`${__logPrefix} -`, error);

      throw error;
    }
  }

  public async pendingTransaction(transactionID: string): Promise<AVMPendingTransactionResponse> {
    const __logPrefix = `${AVMClient.displayName}#pendingTransaction`;
    const node = this._defaultNode();
    let _error: string;
    let response: AxiosResponse<AVMPendingTransactionResponse>;

    if (!node) {
      _error = `failed to get default algod node for chain "${this._chain.chainID()}"`;

      this._logger.error(`${__logPrefix} - ${_error}`);

      throw new FailedToFetchChainInformationError(_error);
    }

    try {
      response = await axios.get<AVMPendingTransactionResponse>(
        `${node.origin}/v${AVMClient._algodVersion}/transactions/pending/${transactionID}`,
        {
          headers: AVMClient._nodeHeaders(node),
        }
      );

      return response.data;
    } catch (error) {
      this._logger.error(`${__logPrefix} -`, error);

      throw error;
    }
  }

  public async sendTransaction({
    signature,
    transaction,
  }: Record<'signature' | 'transaction', Uint8Array>): Promise<string> {
    const __logPrefix = `${AVMClient.displayName}#sendTransaction`;
    const node = this._defaultNode();
    let _error: string;
    let response: AxiosResponse<Record<'txId', string>>;

    if (!node) {
      _error = `failed to get default algod node for chain "${this._chain.chainID()}"`;

      this._logger.error(`${__logPrefix} - ${_error}`);

      throw new FailedToFetchChainInformationError(_error);
    }

    try {
      response = await axios.post<Record<'txId', string>>(
        `${node.origin}/v${AVMClient._algodVersion}/transactions`,
        encodeMsgpack({
          sig: signature,
          txn: transaction,
        }),
        {
          headers: {
            ['Content-Type']: 'application/x-binary',
            ...AVMClient._nodeHeaders(node),
          },
        }
      );

      return response.data.txId;
    } catch (error) {
      this._logger.error(`${__logPrefix} -`, error);

      throw error;
    }
  }
}
