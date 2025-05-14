// constants
import { UNKNOWN_AUTHENTICATION_ERROR } from '@/constants';

// errors
import { BaseError } from '@/errors';

export default class UnknownAuthenticationMethodError extends BaseError {
  public readonly type = UNKNOWN_AUTHENTICATION_ERROR;
}
