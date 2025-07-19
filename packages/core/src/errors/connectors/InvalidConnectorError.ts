// constants
import { INVALID_CONNECTOR_ERROR } from '@/constants';

// errors
import { BaseError } from '@/errors';

export default class InvalidConnectorError extends BaseError {
  public readonly type = INVALID_CONNECTOR_ERROR;
}
