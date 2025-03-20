// constants
import { PASSKEY_NOT_SUPPORTED_ERROR } from '@/constants';

// errors
import { BaseError } from '@/errors';

export default class PasskeyNotSupportedError extends BaseError {
  public readonly type = PASSKEY_NOT_SUPPORTED_ERROR;
}
