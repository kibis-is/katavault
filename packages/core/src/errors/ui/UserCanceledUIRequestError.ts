// constants
import { USER_CANCELED_UI_REQUEST_ERROR } from '@/constants';

// errors
import { BaseError } from '@/errors';

export default class UserCanceledUIRequestError extends BaseError {
  public readonly type = USER_CANCELED_UI_REQUEST_ERROR;
}
