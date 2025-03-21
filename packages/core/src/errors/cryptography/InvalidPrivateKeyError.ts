// constants
import { INVALID_PRIVATE_KEY_ERROR } from '@/constants';

// errors
import { BaseError } from '@/errors';

export default class InvalidPrivateKeyError extends BaseError {
  public readonly type = INVALID_PRIVATE_KEY_ERROR;
}
