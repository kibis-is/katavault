// constants
import { FAILED_TO_INITIALIZE_ERROR } from '@/constants';

// errors
import { BaseError } from '@/errors';

export default class FailedToInitializeError extends BaseError {
  public readonly type = FAILED_TO_INITIALIZE_ERROR;
}
