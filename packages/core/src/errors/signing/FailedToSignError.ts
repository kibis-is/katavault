// constants
import { FAILED_TO_SIGN_ERROR } from '@/constants';

// errors
import { BaseError } from '@/errors';

export default class FailedToSignError extends BaseError {
  public readonly type = FAILED_TO_SIGN_ERROR;
}
