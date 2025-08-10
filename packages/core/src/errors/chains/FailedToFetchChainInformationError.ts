// constants
import { FAILED_TO_FETCH_CHAIN_INFORMATION_ERROR } from '@/constants';

// errors
import { BaseError } from '@/errors';

export default class FailedToFetchChainInformationError extends BaseError {
  public readonly type = FAILED_TO_FETCH_CHAIN_INFORMATION_ERROR;
}
