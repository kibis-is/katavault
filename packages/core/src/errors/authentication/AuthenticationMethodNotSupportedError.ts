// constants
import { AUTHENTICATION_METHOD_NOT_SUPPORTED_ERROR } from '@/constants';

// errors
import { BaseError } from '@/errors';

export default class AuthenticationMethodNotSupportedError extends BaseError {
  public readonly type = AUTHENTICATION_METHOD_NOT_SUPPORTED_ERROR;
}
