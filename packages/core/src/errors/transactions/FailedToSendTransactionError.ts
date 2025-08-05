// constants
import { FAILED_TO_SEND_TRANSACTION_ERROR } from '@/constants';

// errors
import { BaseError } from '@/errors';

export default class FailedToSendTransactionError extends BaseError {
  public readonly type = FAILED_TO_SEND_TRANSACTION_ERROR;
}
