// constants
import { NOT_AUTHENTICATED_ERROR } from '@/constants';

// errors
import { BaseError } from '@/errors';

export default class NotAuthenticatedError extends BaseError {
  public readonly type = NOT_AUTHENTICATED_ERROR;
}
