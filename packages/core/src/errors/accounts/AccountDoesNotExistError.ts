// constants
import { ACCOUNT_DOES_NOT_EXIST_ERROR } from '@/constants';

// errors
import { BaseError } from '@/errors';

export default class AccountDoesNotExistError extends BaseError {
  public readonly type = ACCOUNT_DOES_NOT_EXIST_ERROR;
}
