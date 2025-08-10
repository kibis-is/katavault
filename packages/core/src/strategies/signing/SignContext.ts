import { CAIP002Namespace } from '@kibisis/chains';

// _base
import { BaseClass } from '@/_base';

// errors
import { ChainNotSupportedError } from '@/errors';

// strategies
import AVMSignStrategy from './AVMSignStrategy';

// types
import type { CommonParameters, WithAccountStoreItem, WithChain } from '@/types';

export default class SignContext extends BaseClass {
  /**
   * public static properties
   */
  public static readonly displayName = 'SignContext';
  /**
   * private properties
   */
  private readonly _avmSignStrategy: AVMSignStrategy;

  public constructor(params: CommonParameters) {
    super(params);

    this._avmSignStrategy = new AVMSignStrategy(params);
  }

  /**
   * public methods
   */

  /**
   * Delegates the sign message to the respective strategy. The delegated strategy will handle any connections to
   * external wallets, or if the account is ephemeral, it will sign the message using the chain's standardized method.
   * @param {WithAccountStoreItem<WithChain<Record<'message', string | Uint8Array>>>} params - The input parameters.
   * @param {ConnectedAccountStoreItem | EphemeralAccountStoreItem} params.account - The account to use to sign.
   * @param {Chain} params.chain - The chain to use to sign.
   * @param {string | Uint8Array} params.message - A UTF-8 encoded message or raw bytes to sign.
   * @returns {Promise<Uint8Array>} A promise that resolves to the signature of the signed message.
   * @throws {AccountDoesNotExistError} If the account type is invalid.
   * @throws {FailedToSignError} If the account type is connected and failed to sign the message.
   * @public
   */
  public async signMessage({
    account,
    chain,
    message,
  }: WithAccountStoreItem<WithChain<Record<'message', string | Uint8Array>>>): Promise<Uint8Array> {
    switch (chain.namespace()) {
      case CAIP002Namespace.Algorand:
      case CAIP002Namespace.AVM:
        return await this._avmSignStrategy.signMessage({
          account,
          message,
        });
      default:
        throw new ChainNotSupportedError(`namespace "${chain.namespace()}" not supported`);
    }
  }
}
