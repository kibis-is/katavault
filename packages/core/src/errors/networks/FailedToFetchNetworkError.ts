// constants
import { FAILED_TO_FETCH_NETWORK_ERROR } from '@/constants';

// errors
import { BaseError } from '@/errors';

export default class FailedToFetchNetworkError extends BaseError {
  public readonly type = FAILED_TO_FETCH_NETWORK_ERROR;
}
