// constants
import { FAILED_TO_REGISTER_PASSKEY_ERROR } from '@/constants';

// errors
import { BaseError } from '@/errors';

export default class FailedToRegisterPasskeyError extends BaseError {
  public readonly type = FAILED_TO_REGISTER_PASSKEY_ERROR;
}
