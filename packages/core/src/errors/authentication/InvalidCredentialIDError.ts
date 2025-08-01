// constants
import { INVALID_CREDENTIAL_ID_ERROR } from '@/constants';

// errors
import { BaseError } from '@/errors';

export default class InvalidCredentialIDError extends BaseError {
  public readonly type = INVALID_CREDENTIAL_ID_ERROR;
}
