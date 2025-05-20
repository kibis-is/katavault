// constants
import { NETWORK_NOT_SUPPORTED_ERROR } from '@/constants';

// errors
import { BaseError } from '@/errors';

export default class NetworkNotSupportedError extends BaseError {
  public readonly type = NETWORK_NOT_SUPPORTED_ERROR;
}
