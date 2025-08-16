// constants
import { PASSWORD_TOO_WEAK_ERROR } from '@/constants';

// errors
import { BaseError } from '@/errors';

export default class PasswordTooWeakError extends BaseError {
  public readonly type = PASSWORD_TOO_WEAK_ERROR;
}
