import { concat } from '@agoralabs-sh/bytes';
import { utf8 } from '@kibisis/encoding';
import { ed25519 } from '@noble/curves/ed25519';

// _base
import { BaseClass } from '@/_base';

// enums
import { AccountTypeEnum } from '@/enums';

// types
import type { AVMSignMessageParameters, CommonParameters, WithAccountStoreItem } from '@/types';
import { AccountDoesNotExistError, FailedToSignError } from '@/errors';

export default class AVMSignStrategy extends BaseClass {
  /**
   * public static properties
   */
  public static messagePrefix = 'MX';
  /**
   * private properties
   */
  private readonly _rawMessagePrefix: Uint8Array;

  public constructor(params: CommonParameters) {
    super(params);

    this._rawMessagePrefix = utf8.decode(AVMSignStrategy.messagePrefix);
  }

  /**
   * private methods
   */

  /**
   * Signs the given message using the provided private key.
   *
   * The payload to be signed for AVM messages is the message prefixed with an "MX".
   *
   * @param {AVMSignMessageParameters} params - The input parameters.
   * @param {Uint8Array} params.privateKey - The private key used to sign the message.
   * @param {string | Uint8Array} params.message - A UTF-8 encoded message or raw bytes to sign.
   * @return {Uint8Array} The signature generated from the message signing.
   * @private
   */
  private _signMessage({ message, privateKey }: AVMSignMessageParameters): Uint8Array {
    return ed25519.sign(
      concat(this._rawMessagePrefix, typeof message === 'string' ? utf8.decode(message) : message),
      privateKey
    );
  }

  /**
   * public methods
   */

  public async signMessage({
    account,
    message,
  }: WithAccountStoreItem<Record<'message', string | Uint8Array>>): Promise<Uint8Array> {
    switch (account.__type) {
      case AccountTypeEnum.Connected:
        // TODO: for connected accounts use the connector to sign the message
        throw new FailedToSignError('connected accounts not supported');
      case AccountTypeEnum.Ephemeral:
        return this._signMessage({
          message,
          privateKey: account.keyData,
        });
      default:
        throw new AccountDoesNotExistError('unknown account type');
    }
  }
}
