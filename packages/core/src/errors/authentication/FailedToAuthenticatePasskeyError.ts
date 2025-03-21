// constants
import { FAILED_TO_AUTHENTICATE_PASSKEY_ERROR } from '@/constants';

// errors
import { BaseError } from '@/errors';

export default class FailedToAuthenticatePasskeyError extends BaseError {
  public readonly type = FAILED_TO_AUTHENTICATE_PASSKEY_ERROR;
}
