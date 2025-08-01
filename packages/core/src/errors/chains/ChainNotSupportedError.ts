// constants
import { CHAIN_NOT_SUPPORTED_ERROR } from '@/constants';

// errors
import { BaseError } from '@/errors';

export default class ChainNotSupportedError extends BaseError {
  public readonly type = CHAIN_NOT_SUPPORTED_ERROR;
}
