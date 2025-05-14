// constants
import { INVALID_PASSWORD_ERROR } from '@/constants';

// errors
import { BaseError } from '@/errors';

export default class InvalidPasswordError extends BaseError {
  public readonly type = INVALID_PASSWORD_ERROR;
}
