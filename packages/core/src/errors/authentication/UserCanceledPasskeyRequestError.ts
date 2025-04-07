// constants
import { USER_CANCELED_PASSKEY_REQUEST_ERROR } from '@/constants';

// errors
import { BaseError } from '@/errors';

export default class UserCanceledPasskeyRequestError extends BaseError {
  public readonly type = USER_CANCELED_PASSKEY_REQUEST_ERROR;
}
