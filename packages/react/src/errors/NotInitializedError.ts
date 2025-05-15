import { BaseError } from '@kibisis/katavault-core';

// constants
import { NOT_INITIALIZED_ERROR } from '@/constants';

export default class NotInitializedError extends BaseError {
  public readonly type = NOT_INITIALIZED_ERROR;
}
