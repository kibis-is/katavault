import { BaseError } from '@kibisis/katavault-core';

// constants
import { WALLET_NOT_INITIALIZED_ERROR } from '@/constants';

export default class WalletNotInitializedError extends BaseError {
  public readonly type = WALLET_NOT_INITIALIZED_ERROR;
}
