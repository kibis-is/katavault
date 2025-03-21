// constants
import { INVALID_ACCOUNT_ERROR } from '@/constants';

// errors
import { BaseError } from '@/errors';

export default class InvalidAccountError extends BaseError {
  public readonly type = INVALID_ACCOUNT_ERROR;
}
